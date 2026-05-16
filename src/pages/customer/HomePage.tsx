import {
  MapPin,
  Bell,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { mockRestaurants, mockCategories, mockFeaturedBrands } from '@/data/mock'
import { useState, useEffect } from 'react'
import type { CategoryId } from '@/data/mock'
import { cn } from '@/lib/utils'

// Import local category icons
import iconCom from '@/assets/categories/com.png'
import iconPho from '@/assets/categories/pho.png'
import iconBun from '@/assets/categories/bun.png'
import iconPizza from '@/assets/categories/pizza.png'
import iconCoffee from '@/assets/categories/coffee.png'
import iconChicken from '@/assets/categories/chicken.png'
import iconSushi from '@/assets/categories/sushi.png'
import iconBanhmi from '@/assets/categories/banhmi.png'
import iconMilktea from '@/assets/categories/milktea.png'
import iconDessert from '@/assets/categories/dessert.png'
import iconSnack from '@/assets/categories/snack.png'
import iconVegan from '@/assets/categories/vegan.png'
import iconBurger from '@/assets/categories/burger.png'
import iconSeafood from '@/assets/categories/seafood.png'
import iconHotpot from '@/assets/categories/hotpot.png'
import iconKorean from '@/assets/categories/korean.png'

// Map category IDs to local image paths
const categoryIcons: Record<CategoryId, string> = {
  com: iconCom,
  pho: iconPho,
  bun: iconBun,
  pizza: iconPizza,
  coffee: iconCoffee,
  chicken: iconChicken,
  sushi: iconSushi,
  banhmi: iconBanhmi,
  milktea: iconMilktea,
  dessert: iconDessert,
  snack: iconSnack,
  vegan: iconVegan,
  burger: iconBurger,
  seafood: iconSeafood,
  hotpot: iconHotpot,
  korean: iconKorean,
}

const heroSlides = [
  {
    id: 1,
    image: '/hero-banner.png',
    title: 'Đặt món ngon,',
    titleHighlight: 'giao tận nơi',
    subtitle: 'Khám phá hàng trăm nhà hàng gần bạn. Giao nhanh trong 30 phút.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    title: 'Giảm 50%',
    titleHighlight: 'đơn hàng đầu',
    subtitle: 'Nhập mã CHAOQUICKBITE để được giảm giá sốc.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
    title: 'Freeship mọi đơn',
    titleHighlight: 'tới 5km',
    subtitle: 'Đặt món thả ga, không lo phí vận chuyển.',
  }
]

const typingPlaceholders = [
  "Bạn đang thèm Bún bò?",
  "Hay là một ly Trà sữa?",
  "Gà rán giòn rụm thì sao?",
  "Tìm nhà hàng, món ăn..."
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  // Typewriter states
  const [placeholderText, setPlaceholderText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const currentFullText = typingPlaceholders[placeholderIndex]
    let typingSpeed = isDeleting ? 40 : 80

    if (!isDeleting && placeholderText === currentFullText) {
      typingSpeed = 2000
      setIsDeleting(true)
    } else if (isDeleting && placeholderText === '') {
      setIsDeleting(false)
      setPlaceholderIndex((prev) => (prev + 1) % typingPlaceholders.length)
      typingSpeed = 500
    }

    const timer = setTimeout(() => {
      setPlaceholderText(
        isDeleting
          ? currentFullText.substring(0, placeholderText.length - 1)
          : currentFullText.substring(0, placeholderText.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [placeholderText, isDeleting, placeholderIndex])

  const filteredRestaurants = selectedCategory
    ? mockRestaurants.filter((r) =>
      r.categories.some((c) =>
        c.toLowerCase().includes(
          mockCategories.find((mc) => mc.id === selectedCategory)?.keyword || ''
        )
      )
    )
    : mockRestaurants

  return (
    <div className="page-enter">
      {/* ─── Mobile Header ─── */}
      <header className="md:hidden bg-bg-white px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-primary-light rounded-lg flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] text-text-tertiary font-medium uppercase tracking-wider">
                Giao đến
              </p>
              <button className="flex items-center gap-1 font-semibold text-[13px] text-text-primary">
                227 Nguyễn Văn Cừ, Q.5
                <ChevronDown className="h-3 w-3 text-text-tertiary" />
              </button>
            </div>
          </div>
          <button className="relative p-2 rounded-lg bg-surface-active hover:bg-surface-hover transition-colors">
            <Bell className="h-4.5 w-4.5 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full ring-2 ring-white" />
          </button>
        </div>

        <Input
          isSearch
          placeholder="Tìm nhà hàng, món ăn..."
          className="bg-surface-active border-transparent focus:bg-bg-white"
        />
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[180px] md:h-[300px] lg:h-[360px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              )}
            >
              <img
                src={slide.image}
                alt={slide.titleHighlight}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-[8000ms] ease-out',
                  index === currentSlide ? 'scale-110' : 'scale-100'
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
            </div>
          ))}

          <div className="absolute inset-0 flex items-center z-10">
            <div className="container">
              <div className="w-full max-w-[640px]">
                <div style={{ maxWidth: '440px' }}>
                  <h1 className="text-white drop-shadow-lg text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    {heroSlides[currentSlide].title}
                    <br />
                    <span className="text-brand-accent">{heroSlides[currentSlide].titleHighlight}</span>
                  </h1>
                  <p className="text-white/85 drop-shadow-md text-[13px] md:text-sm mt-2 md:mt-3" style={{ maxWidth: '360px' }}>
                    {heroSlides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Desktop search bar on hero */}
                <div className="hidden md:flex flex-col mt-7 w-full">
                  <div className="group/search flex items-center rounded-xl p-1.5 relative transition-all duration-500 hero-search-bar">
                    <div className="flex items-center gap-3 flex-1 pl-4 pr-2">
                      <div className="relative shrink-0">
                        <Search className="h-4 w-4 text-white/70 group-focus-within/search:text-white transition-colors duration-300" />
                      </div>
                      <div className="h-5 w-px bg-white/20 shrink-0" />
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={placeholderText}
                        className="w-full py-3 text-[13px] font-medium outline-none bg-transparent placeholder:text-white/40 text-white tracking-wide"
                      />
                    </div>
                    <button className="hero-search-btn text-white px-5 py-3 rounded-lg font-semibold text-[13px] transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-1.5 group/btn">
                      <span>Tìm kiếm</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Quick Search Tags */}
                  <div className="flex items-center gap-2.5 mt-4 px-1 overflow-x-auto scrollbar-hide">
                    <span className="text-white/55 font-medium whitespace-nowrap text-[11px] flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Xu hướng:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {['Bún bò Huế', 'Trà sữa', 'Gà rán', 'Cơm tấm', 'Pizza'].map((tag, i) => (
                        <button
                          key={tag}
                          onClick={() => setSearchValue(tag)}
                          className="hero-search-tag px-3 py-1.5 rounded-lg text-white/85 hover:text-white transition-all font-medium text-[11px] whitespace-nowrap active:scale-95"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  index === currentSlide ? 'w-5 bg-brand-accent' : 'w-1.5 bg-white/50 hover:bg-white'
                )}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ─── Categories ─── */}
      <section className="bg-bg-white mt-1.5 md:mt-0 py-4 md:py-6">
        <div className="container">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2>Danh mục</h2>
            <button className="text-[13px] text-primary font-medium hover:underline flex items-center gap-0.5 group">
              Tất cả
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {mockCategories.slice(0, isExpanded ? 15 : 7).map((cat) => {
              const iconSrc = categoryIcons[cat.id]
              const isSelected = selectedCategory === cat.id

              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.id)
                  }
                  className="group flex flex-col items-center gap-1.5 py-1.5 outline-none"
                >
                  <div
                    className={cn(
                      'h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center transition-all duration-300 relative',
                      isSelected
                        ? 'bg-white shadow-md ring-2 ring-primary -translate-y-0.5'
                        : 'bg-white shadow-xs ring-1 ring-black/5 group-hover:shadow-sm group-hover:-translate-y-0.5'
                    )}
                  >
                    <img
                      src={iconSrc}
                      alt={cat.name}
                      className={cn(
                        'h-8 w-8 md:h-9 md:w-9 object-contain transition-transform duration-300 mix-blend-darken contrast-125 brightness-105',
                        isSelected && 'scale-110'
                      )}
                    />
                    {isSelected && (
                      <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[11px] transition-colors whitespace-nowrap',
                      isSelected
                        ? 'font-bold text-primary'
                        : 'font-medium text-text-secondary group-hover:text-text-primary'
                    )}
                  >
                    {cat.name}
                  </span>
                </button>
              )
            })}

            {/* View More / View Less Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex flex-col items-center gap-1.5 py-1.5 outline-none"
            >
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-surface-active group-hover:bg-surface-hover flex items-center justify-center transition-all duration-300 group-hover:shadow-xs group-hover:-translate-y-0.5">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                )}
              </div>
              <span className="text-[11px] font-medium text-text-secondary group-hover:text-primary transition-colors whitespace-nowrap">
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Featured Brands ─── */}
      <section className="mt-1.5 md:mt-0 bg-bg-white py-4 md:py-6">
        <div className="container">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2>Thương hiệu nổi bật</h2>
            <button className="text-[13px] text-primary font-medium hover:underline flex items-center gap-0.5 group">
              Xem tất cả
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {mockFeaturedBrands.map((brand) => (
              <button
                key={brand.id}
                className="brand-card flex-shrink-0 w-[110px] md:w-[130px] flex flex-col items-center p-3 rounded-xl bg-white border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300 group cursor-pointer"
              >
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl overflow-hidden bg-surface-active flex items-center justify-center mb-2 ring-1 ring-black/5 group-hover:ring-primary/20 transition-all">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-[12px] font-semibold text-text-primary text-center leading-tight mb-1 line-clamp-1">
                  {brand.name}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold mb-0.5">
                  {brand.promoTag}
                </span>
                <span className="text-[10px] text-text-tertiary flex items-center gap-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  {brand.distance}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Restaurants ─── */}
      <section className="mt-1.5 md:mt-0 bg-bg-white py-4 md:py-6 pb-6">
        <div className="container">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h2>
                {selectedCategory
                  ? mockCategories.find((c) => c.id === selectedCategory)?.name
                  : 'Gần bạn'}
              </h2>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                {filteredRestaurants.length} nhà hàng
              </p>
            </div>
            <button className="text-[13px] text-primary font-medium hover:underline flex items-center gap-0.5 group">
              Xem tất cả
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <div className="h-14 w-14 bg-surface-active rounded-xl flex items-center justify-center mx-auto mb-3">
                <Search className="h-7 w-7 text-text-disabled" />
              </div>
              <h3 className="text-text-secondary mb-1">Không tìm thấy nhà hàng</h3>
              <p className="text-[13px] text-text-tertiary">
                Thử chọn danh mục khác hoặc tìm kiếm theo tên
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
