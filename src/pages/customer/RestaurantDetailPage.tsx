import { useParams, NavLink } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, Star, Clock, MapPin, Phone, Share2,
  Heart, Plus, ShoppingBasket, Check, Store,
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

  // Generate initials for logo placeholder
  const initials = restaurant.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[280px] overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <NavLink
            to="/"
            className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </NavLink>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
              <Share2 className="h-4.5 w-4.5 text-white" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <Heart className={cn('h-4.5 w-4.5 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-white')} />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="container -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100/50">
          <div className="flex items-start gap-4">
            {/* Logo / Avatar */}
            <div className="shrink-0">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-gradient-to-br from-primary to-red-400 flex items-center justify-center shadow-sm">
                  <span className="text-white text-lg md:text-xl font-bold">{initials}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg md:text-xl font-extrabold text-gray-900 line-clamp-1 tracking-[-0.01em]">
                  {restaurant.name}
                </h1>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full shrink-0 border border-amber-100">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-extrabold text-amber-600">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{restaurant.description}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[13px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="font-medium">{restaurant.distance}km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="font-medium">{restaurant.phone}</span>
                </div>
              </div>

              {/* Category chips */}
              <div className="flex gap-1.5 mt-3">
                {restaurant.categories.map((cat) => (
                  <span key={cat} className="text-[11px] px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-semibold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mt-5">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'menu', label: 'Thực đơn' },
            { id: 'reviews', label: `Đánh giá (${reviews.length})` },
            { id: 'info', label: 'Thông tin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 px-4 py-2.5 text-[13px] font-semibold transition-all rounded-lg',
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container py-5 pb-28">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {Object.entries(menuCategories).map(([catName, items]) => (
              <div key={catName}>
                <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  {catName}
                </h3>
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.isAvailable && openItemModal(item)}
                      disabled={!item.isAvailable}
                      className={cn(
                        'w-full flex gap-4 p-4 bg-white rounded-xl text-left transition-all duration-200 border border-gray-100/60',
                        item.isAvailable
                          ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[14px] text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[12px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <span className="text-[14px] font-extrabold text-primary">{formatPrice(item.basePrice)}</span>
                          <span className="text-[11px] text-gray-300 font-medium">Đã bán {item.totalSold}</span>
                        </div>
                        {!item.isAvailable && (
                          <span className="inline-block mt-1.5 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Hết món</span>
                        )}
                      </div>
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        {item.isAvailable && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-7 w-7 bg-primary rounded-tl-xl rounded-br-xl flex items-center justify-center shadow-sm">
                            <Plus className="h-4 w-4 text-white" />
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
              <div className="text-center py-12">
                <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-[14px] font-medium">Chưa có đánh giá nào</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-red-400 flex items-center justify-center text-white text-[12px] font-bold">
                        {review.customerName[0]}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-gray-900">{review.customerName}</p>
                        <p className="text-[11px] text-gray-400">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-3 pl-3 border-l-2 border-primary/20 bg-primary/[0.03] rounded-r-lg py-2 pr-3">
                      <p className="text-[11px] font-bold text-primary mb-0.5">Phản hồi từ nhà hàng</p>
                      <p className="text-[13px] text-gray-600">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-xl p-5 space-y-4 border border-gray-100/60">
            {[
              { label: 'Địa chỉ', value: restaurant.address, icon: MapPin },
              { label: 'Giờ mở cửa', value: `${restaurant.openTime} - ${restaurant.closeTime}`, icon: Clock },
              { label: 'Điện thoại', value: restaurant.phone, icon: Phone },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-[14px] text-gray-700 font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mô tả</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{restaurant.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {itemCount > 0 && cartRestaurantId === restaurant.id && (
        <div className="fixed bottom-16 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[380px] z-40">
          <NavLink
            to="/cart"
            className="bg-primary text-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center justify-between hover:bg-primary-hover transition-all active:scale-[0.98] animate-slide-up border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBasket className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-[14px]">{itemCount} món trong giỏ</span>
            </div>
            <span className="text-[13px] font-bold bg-white/20 px-3.5 py-1.5 rounded-xl">Xem giỏ</span>
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
            <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 -mx-1">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <p className="text-[13px] text-gray-500 leading-relaxed">{selectedItem.description}</p>
              <p className="text-lg font-extrabold text-primary mt-1.5">{formatPrice(selectedItem.basePrice)}</p>
            </div>

            {/* Option Groups */}
            {selectedItem.optionGroups.map((og) => (
              <div key={og.id}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[14px] font-bold text-gray-900">{og.name}</h4>
                  {og.required && (
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Bắt buộc</span>
                  )}
                </div>
                <div className="space-y-2">
                  {og.options.map((opt) => {
                    const isSelected = (selectedOptions[og.id] || []).includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(og, opt.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-100 hover:border-gray-200'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                            isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                          )}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="text-[14px] font-medium text-gray-700">{opt.name}</span>
                        </div>
                        {opt.extraPrice > 0 && (
                          <span className="text-[13px] text-gray-400 font-medium">+{formatPrice(opt.extraPrice)}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div>
              <label className="text-[14px] font-bold text-gray-900 mb-2 block">Ghi chú</label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Ít cay, không hành..."
                className="w-full p-3 text-[14px] bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                rows={2}
              />
            </div>

            {/* Quantity & Add */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <QuantityStepper value={itemQuantity} onChange={setItemQuantity} min={1} />
              <Button onClick={handleAddToCart} size="md" className="gap-2 min-w-[160px] rounded-xl">
                <span className="font-bold">Thêm</span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-[12px] font-bold">{formatPrice(getItemTotalPrice())}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
