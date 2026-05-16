import { useParams, NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, Star, Clock, MapPin, Phone, Share2,
  Heart, Plus, ShoppingBasket, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { mockRestaurants, mockMenuItems, mockReviews } from '@/data/mock'
import type { MenuItem, MenuItemOptionGroup } from '@/data/mock'
import { useCartStore } from '@/stores'
import { Modal } from '@/components/ui/Modal'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Button } from '@/components/ui/Button'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const restaurant = mockRestaurants.find((r) => r.id === id)
  const menuItems = mockMenuItems[id || ''] || []
  const reviews = mockReviews[id || ''] || []
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('menu')

  // Menu item modal state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [itemNotes, setItemNotes] = useState('')

  const addItem = useCartStore((s) => s.addItem)
  const cartRestaurantId = useCartStore((s) => s.restaurantId)
  const getItemCount = useCartStore((s) => s.getItemCount)

  if (!restaurant) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-1.5">Không tìm thấy nhà hàng</h2>
          <NavLink to="/" className="text-primary font-medium text-[13px] hover:underline">Quay lại trang chủ</NavLink>
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

  return (
    <div className="page-enter min-h-screen bg-bg">
      {/* Cover Image */}
      <div className="relative h-[180px] md:h-[260px] overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <NavLink
            to="/"
            className="h-9 w-9 rounded-lg glass-dark flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-white" />
          </NavLink>
          <div className="flex gap-1.5">
            <button className="h-9 w-9 rounded-lg glass-dark flex items-center justify-center hover:bg-black/50 transition-colors">
              <Share2 className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="h-9 w-9 rounded-lg glass-dark flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <Heart className={cn('h-4 w-4 transition-colors', liked ? 'fill-primary text-primary' : 'text-white')} />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="container -mt-12 relative z-10">
        <div className="bg-bg-white rounded-xl shadow-md p-4 md:p-5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold line-clamp-1">{restaurant.name}</h1>
              <p className="text-[13px] text-text-tertiary mt-0.5 line-clamp-2">{restaurant.description}</p>
            </div>
            <div className="flex items-center gap-0.5 bg-brand-accent-light px-2.5 py-1 rounded-lg shrink-0">
              <Star className="h-3.5 w-3.5 text-brand-accent fill-brand-accent" />
              <span className="text-[13px] font-bold text-brand-accent">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[13px] text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-text-tertiary" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
              <span>{restaurant.distance}km</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-text-tertiary" />
              <span>{restaurant.phone}</span>
            </div>
          </div>

          <div className="flex gap-1 mt-2.5">
            {restaurant.categories.map((cat) => (
              <span key={cat} className="text-[10px] px-2 py-0.5 bg-surface-active rounded-md text-text-secondary font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mt-3">
        <div className="flex border-b border-divider">
          {[
            { id: 'menu', label: 'Thực đơn' },
            { id: 'reviews', label: `Đánh giá (${reviews.length})` },
            { id: 'info', label: 'Thông tin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-[13px] font-medium transition-all relative',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container py-4 pb-28">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-5">
            {Object.entries(menuCategories).map(([catName, items]) => (
              <div key={catName}>
                <h3 className="font-semibold text-[14px] text-text-primary mb-2.5">{catName}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.isAvailable && openItemModal(item)}
                      disabled={!item.isAvailable}
                      className={cn(
                        'w-full flex gap-3 p-3 bg-bg-white rounded-xl text-left transition-all duration-200',
                        item.isAvailable
                          ? 'hover:shadow-sm hover:-translate-y-0.5 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[13px] text-text-primary line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <span className="text-[13px] font-bold text-primary">{formatPrice(item.basePrice)}</span>
                          <span className="text-[10px] text-text-disabled">Đã bán {item.totalSold}</span>
                        </div>
                        {!item.isAvailable && (
                          <span className="inline-block mt-1 text-[10px] font-medium text-error bg-error-bg px-1.5 py-0.5 rounded-md">Hết món</span>
                        )}
                      </div>
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-surface-active shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        {item.isAvailable && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 bg-primary rounded-md flex items-center justify-center shadow-sm">
                            <Plus className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-10">
                <Star className="h-8 w-8 text-text-disabled mx-auto mb-2" />
                <p className="text-text-tertiary text-[13px]">Chưa có đánh giá nào</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-bg-white rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center text-white text-[11px] font-bold">
                        {review.customerName[0]}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">{review.customerName}</p>
                        <p className="text-[10px] text-text-tertiary">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-3 w-3', i < review.rating ? 'text-brand-accent fill-brand-accent' : 'text-text-disabled')} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-2.5">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-2.5 pl-3 border-l-2 border-primary/20">
                      <p className="text-[11px] font-medium text-primary mb-0.5">Phản hồi từ nhà hàng</p>
                      <p className="text-[13px] text-text-secondary">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-bg-white rounded-xl p-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Địa chỉ</p>
              <p className="text-[13px] text-text-primary">{restaurant.address}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Giờ mở cửa</p>
              <p className="text-[13px] text-text-primary">{restaurant.openTime} - {restaurant.closeTime}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Điện thoại</p>
              <p className="text-[13px] text-text-primary">{restaurant.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Mô tả</p>
              <p className="text-[13px] text-text-secondary leading-relaxed">{restaurant.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {itemCount > 0 && cartRestaurantId === restaurant.id && (
        <div className="fixed bottom-16 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[360px] z-40">
          <NavLink
            to="/cart"
            className="bg-primary text-text-inverse rounded-xl px-4 py-3 shadow-lg flex items-center justify-between hover:bg-primary-hover transition-all active:scale-[0.98] animate-slide-up"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingBasket className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[13px]">{itemCount} món trong giỏ</span>
            </div>
            <span className="text-[13px] font-bold bg-white/20 px-3 py-1.5 rounded-lg">Xem giỏ</span>
          </NavLink>
        </div>
      )}

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Item Image */}
            <div className="relative h-40 rounded-lg overflow-hidden bg-surface-active -mx-1">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <p className="text-[13px] text-text-secondary">{selectedItem.description}</p>
              <p className="text-base font-bold text-primary mt-1">{formatPrice(selectedItem.basePrice)}</p>
            </div>

            {/* Option Groups */}
            {selectedItem.optionGroups.map((og) => (
              <div key={og.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[13px] font-semibold">{og.name}</h4>
                  {og.required && (
                    <span className="text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded-md">Bắt buộc</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {og.options.map((opt) => {
                    const isSelected = (selectedOptions[og.id] || []).includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(og, opt.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-2.5 rounded-lg border transition-all',
                          isSelected
                            ? 'border-primary bg-primary-light'
                            : 'border-border hover:border-border-hover'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors',
                            isSelected ? 'border-primary bg-primary' : 'border-border'
                          )}>
                            {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <span className="text-[13px] font-medium">{opt.name}</span>
                        </div>
                        {opt.extraPrice > 0 && (
                          <span className="text-[13px] text-text-tertiary">+{formatPrice(opt.extraPrice)}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div>
              <label className="text-[13px] font-semibold text-text-primary mb-1.5 block">Ghi chú</label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Ít cay, không hành..."
                className="w-full p-2.5 text-[13px] bg-surface-active border-none rounded-lg placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={2}
              />
            </div>

            {/* Quantity & Add */}
            <div className="flex items-center justify-between pt-2 border-t border-divider">
              <QuantityStepper value={itemQuantity} onChange={setItemQuantity} min={1} />
              <Button onClick={handleAddToCart} size="md" className="gap-1.5 min-w-[150px]">
                <span>Thêm</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-[11px]">{formatPrice(getItemTotalPrice())}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
