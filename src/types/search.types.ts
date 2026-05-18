// ── Search Platform Types ──
// Elasticsearch-ready, generic suggestion architecture

// ── Entity types that search can return ──
export type SuggestionType = 'restaurant' | 'dish' | 'category' | 'voucher' | 'query'

export interface SearchSuggestion {
  id: string
  type: SuggestionType
  title: string
  subtitle?: string
  image?: string
  icon?: string // emoji for category/query types
  metadata?: Record<string, unknown>
}

/** Grouped suggestions for overlay display */
export interface SuggestionGroup {
  type: SuggestionType
  label: string
  icon: string
  items: SearchSuggestion[]
}

// ── Search filters ──
export interface SearchFilters {
  sortBy?: 'nearest' | 'rating' | 'fastest' | 'cheapest'
  isOpen?: boolean
  maxDistance?: number
  category?: string
}

// ── Search results (for /search page) ──
export interface SearchResult {
  id: string
  name: string
  coverImage: string
  rating: number
  totalOrders: number
  categories: string[]
  distance: number
  deliveryTime: string
  isOnline: boolean
  promoTag?: string
  description: string
  address: string
}

// ── Analytics events ──
export type SearchEventType =
  | 'overlay_open'
  | 'overlay_close'
  | 'query_change'
  | 'suggestion_click'
  | 'result_click'
  | 'search_submit'
  | 'no_result'
  | 'recent_click'
  | 'trending_click'
  | 'filter_change'

export interface SearchEvent {
  type: SearchEventType
  sessionId: string
  query: string
  timestamp: number
  resultId?: string
  resultType?: SuggestionType
  latencyMs?: number
  metadata?: Record<string, unknown>
}

// ── Search service interface ──
// Swap implementation from mock → REST API → Elasticsearch
export interface ISearchService {
  /** Realtime autocomplete suggestions (debounced, grouped) */
  searchSuggestions(query: string, signal?: AbortSignal): Promise<SuggestionGroup[]>

  /** Full search results for /search page */
  searchResults(query: string, filters?: SearchFilters, signal?: AbortSignal): Promise<SearchResult[]>

  /** Trending/popular queries */
  searchTrending(): Promise<SearchSuggestion[]>

  /** Popular restaurants nearby (for idle state) */
  searchPopularNearby(): Promise<SearchSuggestion[]>

  /** Track analytics event */
  trackEvent(event: SearchEvent): void
}

// ── Provider state ──
export interface SearchState {
  isOpen: boolean
  query: string
  seedQuery?: string
  suggestions: SuggestionGroup[]
  recentSearches: string[]
  isLoadingSuggestions: boolean
  activeIndex: number // keyboard nav: -1 = none
  sessionId: string | null
}

export interface SearchActions {
  openSearch: (seedQuery?: string) => void
  closeSearch: () => void
  setQuery: (q: string) => void
  submitSearch: (q: string) => void
  clearRecent: () => void
  setActiveIndex: (idx: number) => void
  moveActiveIndex: (direction: 'up' | 'down') => void
  selectActive: () => void
}

export type SearchContextValue = SearchState & SearchActions
