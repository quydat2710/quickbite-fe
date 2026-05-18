// ── Global Search Overlay ──
// Dual-state search overlay: Idle Discovery + Active Query
// Neo-Glassmorphism design: Airy, light, and heavily padded

import { useRef, useEffect, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, Clock, TrendingUp, Sparkles, ArrowRight, Trash2,
  MapPin, Star, ChevronRight, Utensils,
  Store, Tag, Ticket, Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearch, useSearchPreload } from '@/providers/SearchProvider'
import { highlightMatch } from '@/services/search.service'
import { mockRestaurants, mockCategories } from '@/data/mock'
import type { SuggestionType } from '@/types/search.types'

// ── Suggestion type icons ──
const TYPE_ICONS: Record<SuggestionType, React.ElementType> = {
  query: Search,
  restaurant: Store,
  dish: Utensils,
  category: Tag,
  voucher: Ticket,
}

export function GlobalSearchOverlay() {
  const {
    isOpen,
    query,
    suggestions,
    recentSearches,
    isLoadingSuggestions,
    activeIndex,
    setQuery,
    closeSearch,
    submitSearch,
    clearRecent,
    moveActiveIndex,
    selectActive,
    setActiveIndex,
    sessionId,
  } = useSearch()

  const { trending } = useSearchPreload()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const hasQuery = query.trim().length > 0

  // ── Autofocus input when overlay opens ──
  useEffect(() => {
    if (isOpen && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // ── Keyboard navigation ──
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveActiveIndex('down')
        break
      case 'ArrowUp':
        e.preventDefault()
        moveActiveIndex('up')
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0) {
          selectActive()
        } else if (query.trim()) {
          submitSearch(query)
        }
        break
      case 'Escape':
        e.preventDefault()
        closeSearch()
        break
      case 'Tab':
        e.preventDefault()
        moveActiveIndex('down')
        break
    }
  }

  // ── Click backdrop to close ──
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeSearch()
    }
  }

  // ── Handlers ──
  const handleSuggestionClick = (title: string, type: SuggestionType, id: string) => {
    if (type === 'restaurant') {
      closeSearch()
      navigate(`/restaurant/${id}`)
    } else {
      setQuery(title)
      inputRef.current?.focus()
    }
  }

  const handleRecentClick = (term: string) => {
    setQuery(term)
    inputRef.current?.focus()
  }

  const handleTrendingClick = (title: string) => {
    setQuery(title)
    inputRef.current?.focus()
  }

  const handleRestaurantClick = (id: string) => {
    closeSearch()
    navigate(`/restaurant/${id}`)
  }

  const handleCategoryClick = (keyword: string) => {
    setQuery(keyword)
    inputRef.current?.focus()
  }

  // ── Flatten suggestions for index matching ──
  let globalIdx = -1
  const getNextIdx = () => ++globalIdx

  if (!isOpen) return null

  // ── Quick access restaurants (top 6, compact) ──
  const quickRestaurants = mockRestaurants.slice(0, 6)
  // ── Quick categories (8 items) ──
  const quickCategories = mockCategories.slice(0, 8)

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 z-[100] flex',
        'md:items-start md:justify-center md:pt-[10vh]',
        'bg-gray-900/20 backdrop-blur-sm', // Subtle dark overlay to make the modal pop
        'search-overlay-backdrop',
      )}
    >
      <div
        className={cn(
          'relative flex flex-col w-full',
          'bg-white/80 backdrop-blur-lg border border-white/60',
          'h-[100dvh] md:h-auto',
          'md:max-w-[720px] md:rounded-3xl md:shadow-2xl md:shadow-gray-200/50 md:max-h-[80vh]',
          'search-overlay-mobile md:search-overlay-modal',
        )}
      >
        {/* ── Sticky Search Header ── */}
        <div className="sticky top-0 z-10 bg-transparent border-b border-gray-100/50 px-6 pt-6 pb-4 md:rounded-t-3xl">
          {/* Mobile top bar */}
          <div className="flex items-center gap-3 md:hidden mb-4">
            <button
              onClick={closeSearch}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm hover:bg-white transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <span className="text-base font-bold text-gray-900">Tìm kiếm</span>
          </div>

          {/* Search input */}
          <div className="relative flex items-center">
            <Search className="absolute left-5 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhà hàng, món ăn, danh mục..."
              style={{ paddingLeft: '3.25rem', paddingRight: '6rem' }}
              className={cn(
                'w-full h-14 text-base font-medium text-gray-900',
                'bg-white/60 border border-white/60 rounded-2xl shadow-sm',
                'placeholder:text-gray-400 placeholder:font-normal',
                'focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:bg-white',
                'transition-all duration-300',
              )}
            />
            <div className="absolute right-3 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full hover:bg-gray-200/50 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-gray-100/80 rounded-md">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
              </kbd>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoadingSuggestions && hasQuery && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100/50 overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full search-loading-bar" />
            </div>
          )}
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* ══ STATE A: Idle Discovery — Compact Layout ══ */}
          {!hasQuery && (
            <div className="p-6 space-y-8">
              {/* ── Recent Searches ── */}
              {recentSearches.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="section-label">GẦN ĐÂY</span>
                    </div>
                    <button
                      onClick={clearRecent}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-white/50 shadow-sm rounded-full hover:-translate-y-1 hover:shadow-md hover:bg-white transition-all duration-300 text-left group"
                      >
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                          {term}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Trending Tags ── */}
              {trending.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="section-label">XU HƯỚNG</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTrendingClick(item.title)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50/80 rounded-full hover:-translate-y-1 hover:shadow-md hover:bg-white transition-all duration-300 text-left group"
                      >
                        <TrendingUp className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Quick Categories Grid ── */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <span className="section-label">DANH MỤC</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {quickCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.keyword)}
                      className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl bg-white/60 border border-white/50 shadow-sm hover:-translate-y-1 hover:shadow-md hover:bg-white transition-all duration-300 group"
                    >
                      <Hash className="h-6 w-6 text-gray-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-primary truncate max-w-full">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Popular Nearby — Compact List ── */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="section-label">GỢI Ý CHO BẠN</span>
                  </div>
                  <button
                    onClick={() => submitSearch('gần bạn')}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    Xem tất cả
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {quickRestaurants.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRestaurantClick(r.id)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/80 hover:shadow-md border border-transparent hover:border-white/60 cursor-pointer transition-all duration-300 text-left group"
                    >
                      {/* Restaurant thumbnail */}
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-50">
                        <img
                          src={r.coverImage}
                          alt={r.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {r.promoTag && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-4 pb-1 px-1.5">
                            <span className="text-[9px] font-bold text-white leading-tight block truncate text-center">
                              {r.promoTag}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {r.name}
                          </p>
                          {r.isOnline && (
                            <span className="h-2 w-2 bg-green-400 rounded-full shrink-0 shadow-sm shadow-green-400/50" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {r.rating}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {r.distance}km
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm text-gray-500 font-medium">
                            {r.deliveryTime}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="h-8 w-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ══ STATE B: Active Query — Grouped Suggestions ══ */}
          {hasQuery && (
            <div className="py-4 px-2 md:px-4">
              {suggestions.length === 0 && !isLoadingSuggestions && (
                <div className="text-center py-16 px-6">
                  <div className="h-16 w-16 bg-white/80 shadow-sm border border-white/60 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-base text-gray-500 font-medium">
                    Không tìm thấy gợi ý cho "<span className="font-semibold text-gray-700">{query}</span>"
                  </p>
                  <button
                    onClick={() => submitSearch(query)}
                    className="mt-4 px-6 py-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-sm text-primary font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                  >
                    Tìm kiếm "{query}" →
                  </button>
                </div>
              )}

              {suggestions.map((group) => (
                <div key={group.type} className="mb-4">
                  {/* Group header */}
                  <div className="px-4 py-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {(() => {
                        const GroupIcon = TYPE_ICONS[group.type] || Search
                        return <GroupIcon className="h-4 w-4" />
                      })()}
                      {group.label}
                    </span>
                  </div>

                  {/* Group items */}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const idx = getNextIdx()
                      const isActive = idx === activeIndex
                      const ItemIcon = TYPE_ICONS[item.type] || Search

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSuggestionClick(item.title, item.type, item.id)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={cn(
                            'w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group border border-transparent',
                            isActive
                              ? 'bg-white/80 shadow-sm border-white/60 text-gray-900 scale-[1.01]'
                              : 'hover:bg-white/50 text-gray-700',
                          )}
                        >
                          {/* Icon / Image */}
                          {item.image ? (
                            <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-50">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <span className="h-12 w-12 rounded-xl bg-white/80 shadow-sm border border-white/60 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                              <ItemIcon className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                            </span>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold truncate [&_mark]:bg-primary/10 [&_mark]:text-primary [&_mark]:font-bold [&_mark]:rounded-md [&_mark]:px-1 [&_mark]:py-0.5"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(item.title, query),
                              }}
                            />
                            {item.subtitle && (
                              <p className="text-xs text-gray-400 font-medium mt-1 truncate">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          <div
                            className={cn(
                              'h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300',
                              isActive ? 'bg-white shadow-sm border border-gray-100 translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                            )}
                          >
                            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* "View all results" button */}
              {suggestions.length > 0 && (
                <div className="px-4 mt-6 mb-2">
                  <button
                    onClick={() => submitSearch(query)}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-white/80 shadow-sm border border-white/60 hover:-translate-y-0.5 hover:shadow-md hover:bg-white text-sm font-semibold text-gray-700 rounded-2xl transition-all duration-300 group"
                  >
                    <Search className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">Xem tất cả kết quả cho "{query}"</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
