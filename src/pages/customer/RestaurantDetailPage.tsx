import { useParams, NavLink, Link } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Star, Clock, MapPin, Phone, Plus, ShoppingBasket, Check, Store,
  ChevronRight, CalendarDays, ChevronDown, X, Minus, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { restaurantApi } from '@/services/api'
import type { MenuItem as ApiMenuItem, MenuItemOptionGroup } from '@/types/api.types'
import { useCartStore } from '@/stores'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

// Re-export local type alias for compatibility with rest of file
type MenuItem = ApiMenuItem

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()

  // ── API state ──
  const [restaurant, setRestaurant] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    if (!id) return
    setIsPageLoading(true)

    Promise.all([
      restaurantApi.getById(id).catch(() => null),
      restaurantApi.getMenu(id).catch(() => []),
      restaurantApi.getReviews(id).catch(() => ({ data: [] })),
    ]).then(([rest, menu, rev]) => {
      setRestaurant(rest)
      setMenuItems(menu || [])
      setReviews((rev as any)?.data || [])
      setIsPageLoading(false)
    })
  }, [id])

  // UI state
  const [activeCategory, setActiveCategory] = useState('')
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [isScrollSpyEnabled, setIsScrollSpyEnabled] = useState(true)

  // Menu item modal state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [itemNotes, setItemNotes] = useState('')

  // Cart
  const addItem = useCartStore((s) => s.addItem)
  const cartRestaurantId = useCartStore((s) => s.restaurantId)
  const getItemCount = useCartStore((s) => s.getItemCount)

  // Refs for ScrollSpy
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const navRef = useRef<HTMLDivElement>(null)

  if (isPageLoading) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Đang tải nhà hàng...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-1.5 text-xl font-bold text-gray-900">Không tìm thấy nhà hàng</h2>
          <NavLink to="/" className="text-red-500 font-medium text-sm hover:underline">Quay lại trang chủ</NavLink>
        </div>
      </div>
    )
  }

  // Group menu by categoryName
  const menuCategories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.categoryName]) acc[item.categoryName] = []
    acc[item.categoryName].push(item)
    return acc
  }, {})

  const categoryNames = Object.keys(menuCategories)

  // Set initial active category
  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0])
    }
  }, [categoryNames, activeCategory])

  // ── ScrollSpy: observe category sections ──
  useEffect(() => {
    if (!isScrollSpyEnabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const catName = entry.target.getAttribute('data-category')
            if (catName) {
              setActiveCategory(catName)
              // Scroll the nav tab into view
              const navTab = document.getElementById(`nav-tab-${catName}`)
              if (navTab && navRef.current) {
                navTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              }
            }
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 }
    )

    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [categoryNames, isScrollSpyEnabled])

  const scrollToCategory = (catName: string) => {
    setIsScrollSpyEnabled(false)
    setActiveCategory(catName)

    const el = categoryRefs.current[catName]
    if (el) {
      const yOffset = -130 // sticky header height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    // Re-enable ScrollSpy after scroll finishes
    setTimeout(() => setIsScrollSpyEnabled(true), 800)
  }

  // ── Item Modal Logic ──
  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item)
    setItemQuantity(1)
    setItemNotes('')
    const defaults: Record<string, string[]> = {}
    item.optionGroups.forEach((og) => {
      if (og.required) defaults[og.id] = [og.options[0].id]
      else defaults[og.id] = []
    })
    setSelectedOptions(defaults)
  }

  const toggleOption = (group: MenuItemOptionGroup, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[group.id] || []
      if (group.maxSelect === 1) {
        return { ...prev, [group.id]: [optionId] }
      }
      if (current.includes(optionId)) {
        return { ...prev, [group.id]: current.filter((o) => o !== optionId) }
      }
      if (current.length >= group.maxSelect) return prev
      return { ...prev, [group.id]: [...current, optionId] }
    })
  }

  const getItemTotalPrice = () => {
    if (!selectedItem) return 0
    let price = selectedItem.basePrice
    selectedItem.optionGroups.forEach((og) => {
      const selected = selectedOptions[og.id] || []
      og.options.forEach((opt) => {
        if (selected.includes(opt.id)) price += opt.extraPrice
      })
    })
    return price * itemQuantity
  }

  const handleAddToCart = () => {
    if (!selectedItem || !restaurant) return
    const options = selectedItem.optionGroups.flatMap((og) => {
      const selected = selectedOptions[og.id] || []
      return og.options
        .filter((opt) => selected.includes(opt.id))
        .map((opt) => ({
          groupId: og.id,
          groupName: og.name,
          optionId: opt.id,
          optionName: opt.name,
          extraPrice: opt.extraPrice,
        }))
    })
    addItem(restaurant.id, restaurant.name, {
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      unitPrice: selectedItem.basePrice,
      quantity: itemQuantity,
      options,
      notes: itemNotes,
      imageUrl: selectedItem.image,
    })
    setSelectedItem(null)
  }

  const itemCount = getItemCount()
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : restaurant.rating.toFixed(1)

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fff' }}>
      <style>{`
        .rdp-sticky-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #fff;
        }
        @media (min-width: 768px) {
          .rdp-sticky-header { top: 68px; }
        }
        .rdp-cat-nav::-webkit-scrollbar { display: none; }
        .rdp-cat-nav { -ms-overflow-style: none; scrollbar-width: none; }
        .rdp-cat-btn { transition: color 0.15s; }
        .rdp-cat-btn:hover { color: #111827; }
      `}</style>

      {/* ═══════ STICKY HEADER (breadcrumb + info + delivery + category nav) ═══════ */}
      <div className="rdp-sticky-header" style={{ boxShadow: '0 1px 0 #f3f4f6' }}>
        {/* Breadcrumbs */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '12px 20px 0' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af' }}>
            <Link to="/" style={{ color: '#9ca3af', fontWeight: 500, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
              Trang chủ
            </Link>
            <ChevronRight style={{ width: 14, height: 14 }} />
            <span style={{ color: '#6b7280', fontWeight: 500 }}>Nhà hàng</span>
            <ChevronRight style={{ width: 14, height: 14 }} />
            <span style={{ color: '#111827', fontWeight: 600 }}>{restaurant.name}</span>
          </nav>
        </div>

        {/* Restaurant info */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '12px 20px 0' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{restaurant.name}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', marginTop: 8 }}>
            <button
              onClick={() => setShowInfoModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6b7280', fontSize: 13 }}
            >
              <Star style={{ width: 15, height: 15, color: '#fbbf24', fill: '#fbbf24' }} />
              <span style={{ fontWeight: 700, color: '#111827' }}>{avgRating}</span>
              <span style={{ color: '#9ca3af' }}>({reviews.length} đánh giá)</span>
            </button>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b7280' }}>
              <Clock style={{ width: 14, height: 14, color: '#9ca3af' }} />
              <span style={{ fontWeight: 500 }}>{restaurant.deliveryTime}</span>
            </span>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b7280' }}>
              <MapPin style={{ width: 14, height: 14, color: '#9ca3af' }} />
              <span style={{ fontWeight: 500 }}>{restaurant.distance}km</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: '#6b7280' }}>
            <span>Giờ mở cửa</span>
            <span style={{ fontWeight: 600, color: '#374151' }}>Hôm nay {restaurant.openTime} - {restaurant.closeTime}</span>
          </div>

          {/* Delivery dropdowns */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, marginBottom: 12 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid #e5e7eb', background: '#f9fafb',
              fontSize: 13, fontWeight: 500, color: '#374151',
              cursor: 'pointer', minWidth: 190,
            }}>
              <CalendarDays style={{ width: 15, height: 15, color: '#9ca3af', flexShrink: 0 }} />
              <span>Ngày giao hàng: <strong style={{ color: '#ef4444' }}>Hôm nay</strong></span>
              <ChevronDown style={{ width: 14, height: 14, color: '#9ca3af', marginLeft: 'auto', flexShrink: 0 }} />
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid #e5e7eb', background: '#f9fafb',
              fontSize: 13, fontWeight: 500, color: '#374151',
              cursor: 'pointer', minWidth: 210,
            }}>
              <Clock style={{ width: 15, height: 15, color: '#9ca3af', flexShrink: 0 }} />
              <span>Thời gian giao: <strong style={{ color: '#ef4444' }}>Ngay bây giờ</strong></span>
              <ChevronDown style={{ width: 14, height: 14, color: '#9ca3af', marginLeft: 'auto', flexShrink: 0 }} />
            </button>
          </div>
        </div>

        {/* Category nav tabs */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px' }}>
          <div
            ref={navRef}
            className="rdp-cat-nav"
            style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}
          >
            {categoryNames.map((catName) => {
              const isActive = activeCategory === catName
              return (
                <button
                  key={catName}
                  id={`nav-tab-${catName}`}
                  onClick={() => scrollToCategory(catName)}
                  className="rdp-cat-btn"
                  style={{
                    position: 'relative',
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: isActive ? '#ef4444' : '#6b7280',
                    borderBottom: isActive ? '2.5px solid #ef4444' : '2.5px solid transparent',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                >
                  {catName}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════ MENU CONTENT ═══════ */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 20px 120px' }}>
        {categoryNames.map((catName) => (
          <div
            key={catName}
            ref={(el) => { categoryRefs.current[catName] = el }}
            data-category={catName}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 20 }}>
              {catName}
            </h2>

            {/* Responsive grid via CSS columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {menuCategories[catName].map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.isAvailable && openItemModal(item)}
                  disabled={!item.isAvailable}
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: 16,
                    padding: 16,
                    background: '#fff',
                    borderRadius: 14,
                    border: '1px solid #f3f4f6',
                    textAlign: 'left',
                    cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                    opacity: item.isAvailable ? 1 : 0.5,
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (item.isAvailable) {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#f3f4f6'
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', width: 96, height: 96, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!item.isAvailable && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: '#ef4444', padding: '2px 8px', borderRadius: 9999 }}>Hết</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{formatPrice(item.basePrice)}</span>
                      {item.isAvailable && (
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: '#fef2f2', border: '1px solid #fecaca',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ef4444', flexShrink: 0, transition: 'background 0.15s, color 0.15s',
                        }}>
                          <Plus style={{ width: 16, height: 16 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ FLOATING CART BAR ═══════ */}
      {itemCount > 0 && cartRestaurantId === restaurant.id && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          width: 'calc(100% - 32px)',
          maxWidth: 480,
        }}>
          <NavLink
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              borderRadius: 18,
              padding: '14px 16px',
              boxShadow: '0 8px 32px rgba(239,68,68,0.45), 0 2px 8px rgba(0,0,0,0.15)',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* Left: icon + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Icon container */}
              <div style={{
                width: 38, height: 38,
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
              }}>
                <ShoppingBasket style={{ width: 20, height: 20, color: '#fff' }} />
                {/* Count badge */}
                <div style={{
                  position: 'absolute',
                  top: -6, right: -6,
                  width: 18, height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: '#ef4444',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  {itemCount}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  {itemCount} món trong giỏ
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 }}>
                  Nhấn để xem chi tiết
                </div>
              </div>
            </div>

            {/* Right: CTA button */}
            <div style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
              backdropFilter: 'blur(4px)',
            }}>
              Xem giỏ →
            </div>
          </NavLink>
        </div>
      )}

      {/* ═══════ INFO & REVIEWS MODAL ═══════ */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={restaurant.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Restaurant Info Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Thông tin nhà hàng</h4>
            {[
              { label: 'Địa chỉ', value: restaurant.address, icon: MapPin },
              { label: 'Giờ mở cửa', value: `${restaurant.openTime} - ${restaurant.closeTime}`, icon: Clock },
              { label: 'Điện thoại', value: restaurant.phone, icon: Phone },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-gray-700 font-medium">{value}</p>
                </div>
              </div>
            ))}
            <p className="text-sm text-gray-500 leading-relaxed pt-2 border-t border-gray-100">{restaurant.description}</p>
          </div>

          {/* Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Đánh giá ({reviews.length})</h4>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-gray-900">{avgRating}</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">Chưa có đánh giá nào</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {review.customerName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{review.customerName}</p>
                        <p className="text-[11px] text-gray-400">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-3 w-3', i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-2.5 pl-3 border-l-2 border-red-200 bg-red-50/50 rounded-r-lg py-2 pr-3">
                      <p className="text-[11px] font-bold text-red-500 mb-0.5">Phản hồi từ nhà hàng</p>
                      <p className="text-sm text-gray-600">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* ═══════ ITEM DETAIL MODAL ═══════ */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
      >
        {selectedItem && (
          <div className="space-y-5">
            {/* Item Image + Price */}
            <div className="flex gap-4 items-start">
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 leading-relaxed">{selectedItem.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(selectedItem.basePrice)}</p>
              </div>
            </div>

            {/* Option Groups */}
            {selectedItem.optionGroups.map((og) => (
              <div key={og.id} className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[15px] font-bold text-gray-900">{og.name}</h4>
                  {og.required && (
                    <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full">Chọn 1</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {og.options.map((opt) => {
                    const isSelected = (selectedOptions[og.id] || []).includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(og, opt.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 12,
                          border: isSelected ? '2px solid #fca5a5' : '2px solid #f3f4f6',
                          background: isSelected ? '#fef2f2' : '#f9fafb',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: `2px solid ${isSelected ? '#ef4444' : '#d1d5db'}`,
                            background: isSelected ? '#ef4444' : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.15s',
                          }}>
                            {isSelected && <Check style={{ width: 11, height: 11, color: '#fff' }} />}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500, color: isSelected ? '#111827' : '#4b5563' }}>
                            {opt.name}
                          </span>
                        </div>
                        {opt.extraPrice > 0 && (
                          <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                            +{formatPrice(opt.extraPrice)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 8 }}>Ghi chú</label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Ít cay, không hành..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  color: '#374151',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                rows={2}
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f9fafb', borderRadius: 12, padding: '4px 6px', border: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: '#fff', border: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#374151',
                  }}
                >
                  <Minus style={{ width: 15, height: 15 }} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', minWidth: 28, textAlign: 'center' }}>
                  {itemQuantity}
                </span>
                <button
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: '#ef4444', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                  }}
                >
                  <Plus style={{ width: 15, height: 15 }} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#ef4444', color: '#fff',
                  border: 'none', borderRadius: 12,
                  padding: '12px 20px',
                  fontWeight: 700, fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                <span>Thêm vào giỏ</span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '3px 10px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {formatPrice(getItemTotalPrice())}
                </span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
