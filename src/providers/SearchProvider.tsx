// ── Search Provider ──
// Global search orchestration: state, debounce, cancellation, keyboard, preload, analytics, sessions.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type {
  SearchContextValue,
  SuggestionGroup,
  SearchSuggestion,
} from '@/types/search.types'
import { searchService, normalizeQuery } from '@/services/search.service'

// ── Constants ──
const DEBOUNCE_MS = 200
const MAX_RECENT = 10
const RECENT_STORAGE_KEY = 'quickbite:recent-searches'

// ── Session ID generator ──
function createSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ── localStorage helpers with dedup & normalization ──
function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(items: string[]) {
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full — silently ignore
  }
}

function addRecent(items: string[], query: string): string[] {
  const normalized = normalizeQuery(query)
  if (!normalized) return items

  // Deduplicate (case-insensitive), keep display form of newest
  const filtered = items.filter((item) => normalizeQuery(item) !== normalized)
  const updated = [query.trim(), ...filtered].slice(0, MAX_RECENT)
  saveRecent(updated)
  return updated
}

// ── Context ──
const SearchContext = createContext<SearchContextValue | null>(null)

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within <SearchProvider>')
  return ctx
}

// ── Provider ──
export function SearchProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  // ── State ──
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQueryState] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestionGroup[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // ── Preloaded data ──
  const [trendingData, setTrendingData] = useState<SearchSuggestion[]>([])
  const [popularNearby, setPopularNearby] = useState<SearchSuggestion[]>([])

  // ── Refs ──
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Preload trending + popular on mount ──
  useEffect(() => {
    searchService.searchTrending().then(setTrendingData).catch(() => {})
    searchService.searchPopularNearby().then(setPopularNearby).catch(() => {})
  }, [])

  // ── Flatten suggestions for keyboard nav ──
  const flatSuggestions = useMemo(() => {
    return suggestions.flatMap((group) => group.items)
  }, [suggestions])

  // ── Cancel inflight request ──
  const cancelPending = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
  }, [])

  // ── Fetch suggestions (debounced) ──
  const fetchSuggestions = useCallback((q: string) => {
    cancelPending()

    if (!q.trim()) {
      setSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)

    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortControllerRef.current = controller
      const startTime = Date.now()

      try {
        const results = await searchService.searchSuggestions(q, controller.signal)
        if (!controller.signal.aborted) {
          setSuggestions(results)
          setActiveIndex(-1)
          setIsLoadingSuggestions(false)

          // Track query event
          if (sessionId) {
            searchService.trackEvent({
              type: 'query_change',
              sessionId,
              query: q,
              timestamp: Date.now(),
              latencyMs: Date.now() - startTime,
            })
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Expected — request was cancelled by newer query
          return
        }
        if (!controller.signal.aborted) {
          setSuggestions([])
          setIsLoadingSuggestions(false)
        }
      }
    }, DEBOUNCE_MS)
  }, [cancelPending, sessionId])

  // ── Actions ──
  const openSearch = useCallback((seedQuery?: string) => {
    const sid = createSessionId()
    setSessionId(sid)
    setIsOpen(true)
    setActiveIndex(-1)

    // Sync with current page query if on /search
    if (!seedQuery && location.pathname === '/search') {
      const params = new URLSearchParams(location.search)
      const currentQ = params.get('q') || ''
      if (currentQ) {
        setQueryState(currentQ)
        fetchSuggestions(currentQ)
        searchService.trackEvent({
          type: 'overlay_open',
          sessionId: sid,
          query: currentQ,
          timestamp: Date.now(),
        })
        return
      }
    }

    if (seedQuery) {
      setQueryState(seedQuery)
      fetchSuggestions(seedQuery)
    } else {
      setQueryState('')
      setSuggestions([])
    }

    searchService.trackEvent({
      type: 'overlay_open',
      sessionId: sid,
      query: seedQuery || '',
      timestamp: Date.now(),
    })
  }, [location.pathname, location.search, fetchSuggestions])

  const closeSearch = useCallback(() => {
    cancelPending()
    setIsOpen(false)
    setSuggestions([])
    setActiveIndex(-1)

    if (sessionId) {
      searchService.trackEvent({
        type: 'overlay_close',
        sessionId,
        query,
        timestamp: Date.now(),
      })
    }
    setSessionId(null)
  }, [cancelPending, sessionId, query])

  const setQuery = useCallback((q: string) => {
    setQueryState(q)
    setActiveIndex(-1)
    fetchSuggestions(q)
  }, [fetchSuggestions])

  const submitSearch = useCallback((q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return

    // Save to recent (deduped + normalized)
    setRecentSearches((prev) => addRecent(prev, trimmed))

    // Track
    if (sessionId) {
      searchService.trackEvent({
        type: 'search_submit',
        sessionId,
        query: trimmed,
        timestamp: Date.now(),
      })
    }

    // Navigate & close
    cancelPending()
    setIsOpen(false)
    setSuggestions([])
    setSessionId(null)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }, [navigate, cancelPending, sessionId])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
    saveRecent([])
  }, [])

  const moveActiveIndex = useCallback((direction: 'up' | 'down') => {
    setActiveIndex((prev) => {
      const total = flatSuggestions.length
      if (total === 0) return -1
      if (direction === 'down') return prev < total - 1 ? prev + 1 : 0
      return prev > 0 ? prev - 1 : total - 1
    })
  }, [flatSuggestions.length])

  const selectActive = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < flatSuggestions.length) {
      const item = flatSuggestions[activeIndex]
      if (item.type === 'restaurant') {
        // Navigate to restaurant directly
        closeSearch()
        navigate(`/restaurant/${item.id}`)
      } else {
        // Fill query for other types
        setQuery(item.title)
      }

      if (sessionId) {
        searchService.trackEvent({
          type: 'suggestion_click',
          sessionId,
          query,
          resultId: item.id,
          resultType: item.type,
          timestamp: Date.now(),
        })
      }
    }
  }, [activeIndex, flatSuggestions, closeSearch, navigate, setQuery, sessionId, query])

  // ── Keyboard shortcuts: Ctrl+K / ⌘+K ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          closeSearch()
        } else {
          openSearch()
        }
      }

      // Ctrl+Backspace to clear when open
      if (isOpen && (e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
        e.preventDefault()
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, openSearch, closeSearch, setQuery])

  // ── Lock body scroll when overlay is open ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      cancelPending()
    }
  }, [cancelPending])

  // ── Context value ──
  const value = useMemo<SearchContextValue>(() => ({
    // State
    isOpen,
    query,
    suggestions,
    recentSearches,
    isLoadingSuggestions,
    activeIndex,
    sessionId,
    // Preloaded data exposed via state
    // (overlay accesses via separate hook or direct import)
    // Actions
    openSearch,
    closeSearch,
    setQuery,
    submitSearch,
    clearRecent,
    setActiveIndex,
    moveActiveIndex,
    selectActive,
  }), [
    isOpen, query, suggestions, recentSearches, isLoadingSuggestions,
    activeIndex, sessionId,
    openSearch, closeSearch, setQuery, submitSearch, clearRecent,
    setActiveIndex, moveActiveIndex, selectActive,
  ])

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

// ── Hook: access preloaded data ──
// Separated to avoid re-renders on main context changes
const PreloadContext = createContext<{
  trending: SearchSuggestion[]
  popularNearby: SearchSuggestion[]
}>({ trending: [], popularNearby: [] })

export function useSearchPreload() {
  return useContext(PreloadContext)
}

// Re-export the provider wrapper that includes preload
export function SearchProviderWithPreload({ children }: { children: ReactNode }) {
  const [trending, setTrending] = useState<SearchSuggestion[]>([])
  const [popularNearby, setPopularNearby] = useState<SearchSuggestion[]>([])

  useEffect(() => {
    searchService.searchTrending().then(setTrending).catch(() => {})
    searchService.searchPopularNearby().then(setPopularNearby).catch(() => {})
  }, [])

  return (
    <PreloadContext.Provider value={{ trending, popularNearby }}>
      <SearchProvider>
        {children}
      </SearchProvider>
    </PreloadContext.Provider>
  )
}
