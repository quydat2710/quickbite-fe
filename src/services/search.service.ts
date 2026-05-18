// ── Mock Search Service ──
// Implements ISearchService with local mock data.
// Swap to REST/Elasticsearch client by replacing this file.

import type {
  ISearchService,
  SearchSuggestion,
  SuggestionGroup,
  SearchResult,
  SearchFilters,
  SearchEvent,
} from '@/types/search.types'
import { mockRestaurants } from '@/data/mock'

// ── Simple in-memory cache ──
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 60_000 // 60 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

// ── Simulated network delay ──
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Normalize query for matching & dedup ──
export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase()
}

// ── Highlight matching text ──
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// ── Mock popular searches ──
const TRENDING_QUERIES: SearchSuggestion[] = [
  { id: 't1', type: 'query', title: 'Bún bò', icon: '🍜' },
  { id: 't2', type: 'query', title: 'Cơm tấm', icon: '🍚' },
  { id: 't3', type: 'query', title: 'Pizza', icon: '🍕' },
  { id: 't4', type: 'query', title: 'Phở', icon: '🍲' },
  { id: 't5', type: 'query', title: 'Trà sữa', icon: '🧋' },
  { id: 't6', type: 'query', title: 'Gà rán', icon: '🍗' },
  { id: 't7', type: 'query', title: 'Sushi', icon: '🍣' },
  { id: 't8', type: 'query', title: 'Burger', icon: '🍔' },
]

// ── Category suggestions map ──
const CATEGORY_MAP: Record<string, SearchSuggestion> = {
  'cơm': { id: 'c-com', type: 'category', title: 'Cơm', icon: '🍚', subtitle: '12 nhà hàng' },
  'phở': { id: 'c-pho', type: 'category', title: 'Phở', icon: '🍲', subtitle: '8 nhà hàng' },
  'bún': { id: 'c-bun', type: 'category', title: 'Bún', icon: '🍜', subtitle: '10 nhà hàng' },
  'pizza': { id: 'c-pizza', type: 'category', title: 'Pizza', icon: '🍕', subtitle: '5 nhà hàng' },
  'burger': { id: 'c-burger', type: 'category', title: 'Hamburger', icon: '🍔', subtitle: '4 nhà hàng' },
  'sushi': { id: 'c-sushi', type: 'category', title: 'Sushi', icon: '🍣', subtitle: '3 nhà hàng' },
  'gà': { id: 'c-ga', type: 'category', title: 'Gà rán', icon: '🍗', subtitle: '6 nhà hàng' },
  'trà sữa': { id: 'c-trasua', type: 'category', title: 'Trà sữa', icon: '🧋', subtitle: '7 nhà hàng' },
  'lẩu': { id: 'c-lau', type: 'category', title: 'Lẩu', icon: '🍲', subtitle: '5 nhà hàng' },
  'bánh mì': { id: 'c-banhmi', type: 'category', title: 'Bánh mì', icon: '🥖', subtitle: '9 nhà hàng' },
}

// ── Query expansion suggestions ──
function generateQuerySuggestions(query: string): SearchSuggestion[] {
  const q = normalizeQuery(query)
  if (!q) return []

  const expansions = [
    { suffix: '', label: query },
    { suffix: ' gần bạn', label: `${query} gần bạn` },
    { suffix: ' bán chạy', label: `${query} bán chạy` },
    { suffix: ' giảm giá', label: `${query} giảm giá` },
  ]

  return expansions
    .slice(0, 3)
    .map((exp, i) => ({
      id: `q-${q}-${i}`,
      type: 'query' as const,
      title: exp.label,
      icon: '🔍',
    }))
}

// ── Mock SearchService implementation ──
class MockSearchService implements ISearchService {
  async searchSuggestions(query: string, signal?: AbortSignal): Promise<SuggestionGroup[]> {
    const q = normalizeQuery(query)
    if (!q) return []

    // Check cache
    const cacheKey = `suggestions:${q}`
    const cached = getCached<SuggestionGroup[]>(cacheKey)
    if (cached) return cached

    // Simulate network latency
    await delay(80 + Math.random() * 120)

    // Check if aborted
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    const groups: SuggestionGroup[] = []

    // 1. Query suggestions (always first for speed)
    const querySuggestions = generateQuerySuggestions(query)
    if (querySuggestions.length > 0) {
      groups.push({
        type: 'query',
        label: 'Tìm kiếm',
        icon: '🔍',
        items: querySuggestions,
      })
    }

    // 2. Restaurant matches
    const restaurantMatches = mockRestaurants
      .filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.categories.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .map((r) => ({
        id: r.id,
        type: 'restaurant' as const,
        title: r.name,
        subtitle: `${r.distance}km · ${r.deliveryTime} · ⭐ ${r.rating}`,
        image: r.coverImage,
        metadata: { rating: r.rating, distance: r.distance },
      }))

    if (restaurantMatches.length > 0) {
      groups.push({
        type: 'restaurant',
        label: 'Nhà hàng',
        icon: '🏪',
        items: restaurantMatches,
      })
    }

    // 3. Category matches
    const categoryMatches = Object.entries(CATEGORY_MAP)
      .filter(([key]) => key.includes(q) || q.includes(key))
      .slice(0, 2)
      .map(([, cat]) => cat)

    if (categoryMatches.length > 0) {
      groups.push({
        type: 'category',
        label: 'Danh mục',
        icon: '🏷️',
        items: categoryMatches,
      })
    }

    // Dynamic priority ranking: sort groups by relevance score
    const priorityOrder: Record<string, number> = {
      restaurant: restaurantMatches.length > 0 ? 1 : 99,
      dish: 2,
      query: restaurantMatches.length > 0 ? 3 : 0,
      category: categoryMatches.length > 0 ? 2 : 99,
      voucher: 99,
    }
    groups.sort((a, b) => (priorityOrder[a.type] ?? 50) - (priorityOrder[b.type] ?? 50))

    // Cache result
    setCache(cacheKey, groups)
    return groups
  }

  async searchResults(query: string, filters?: SearchFilters, signal?: AbortSignal): Promise<SearchResult[]> {
    const q = normalizeQuery(query)
    if (!q) return []

    const cacheKey = `results:${q}:${JSON.stringify(filters ?? {})}`
    const cached = getCached<SearchResult[]>(cacheKey)
    if (cached) return cached

    await delay(100 + Math.random() * 150)
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    let results = mockRestaurants.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.categories.some((c) => c.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q)
    )

    // Apply filters
    if (filters?.isOpen) {
      results = results.filter((r) => r.isOnline)
    }
    if (filters?.sortBy === 'nearest') {
      results = [...results].sort((a, b) => a.distance - b.distance)
    } else if (filters?.sortBy === 'rating') {
      results = [...results].sort((a, b) => b.rating - a.rating)
    } else if (filters?.sortBy === 'fastest') {
      results = [...results].sort((a, b) => {
        const getMin = (t: string) => parseInt(t.split('-')[0]) || 0
        return getMin(a.deliveryTime) - getMin(b.deliveryTime)
      })
    }

    const mapped: SearchResult[] = results.map((r) => ({
      id: r.id,
      name: r.name,
      coverImage: r.coverImage,
      rating: r.rating,
      totalOrders: r.totalOrders,
      categories: r.categories,
      distance: r.distance,
      deliveryTime: r.deliveryTime,
      isOnline: r.isOnline,
      promoTag: r.promoTag,
      description: r.description,
      address: r.address,
    }))

    setCache(cacheKey, mapped)
    return mapped
  }

  async searchTrending(): Promise<SearchSuggestion[]> {
    const cached = getCached<SearchSuggestion[]>('trending')
    if (cached) return cached

    await delay(50)
    setCache('trending', TRENDING_QUERIES)
    return TRENDING_QUERIES
  }

  async searchPopularNearby(): Promise<SearchSuggestion[]> {
    const cached = getCached<SearchSuggestion[]>('popular-nearby')
    if (cached) return cached

    await delay(80)
    const nearby = mockRestaurants
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 4)
      .map((r) => ({
        id: r.id,
        type: 'restaurant' as const,
        title: r.name,
        subtitle: `⭐ ${r.rating} · ${r.distance}km`,
        image: r.coverImage,
      }))

    setCache('popular-nearby', nearby)
    return nearby
  }

  trackEvent(event: SearchEvent): void {
    // In production: send to analytics API
    if (import.meta.env.DEV) {
      console.log('[Search Analytics]', event.type, {
        query: event.query,
        session: event.sessionId,
        resultId: event.resultId,
        latencyMs: event.latencyMs,
      })
    }
  }
}

// ── Singleton export ──
export const searchService = new MockSearchService()
