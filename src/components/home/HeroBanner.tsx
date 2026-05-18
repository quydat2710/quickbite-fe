import { Search, ArrowRight } from 'lucide-react'
import { useSlider, useTypewriter } from '@/hooks'
import { cn } from '@/lib/utils'
import { useSearch } from '@/providers/SearchProvider'

const heroImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop',
]

const searchSuggestions = [
  'Tìm kiếm món ăn, nhà hàng...',
  'Hôm nay bạn thèm gì?',
  'Thử tìm "Bún bò Huế"...',
  'Giao hàng hỏa tốc 30 phút...',
]

const popularTags = ['Bún bò Huế', 'Trà sữa', 'Gà rán', 'Cơm tấm', 'Pizza']

/**
 * Hero banner with image slider, typewriter placeholder, and popular tags.
 * Search bar is a "fake input" — clicking opens the global search overlay.
 */
export function HeroBanner() {
  const { currentSlide, setCurrentSlide } = useSlider(heroImages.length)
  const placeholder = useTypewriter(searchSuggestions)
  const { openSearch } = useSearch()

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[260px] md:h-[420px] bg-black">
        {/* Slider Container */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((img, idx) => (
            <div key={idx} className="relative w-full h-full shrink-0">
              <img
                src={img}
                alt={`Hero ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60" />
            </div>
          ))}
        </div>

        {/* Slider Pagination Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentSlide === idx
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              )}
            />
          ))}
        </div>

        {/* Content — Centered inside slider */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
          <div className="w-full max-w-[560px]">
            {/* Heading */}
            <h1 className="!text-white font-extrabold leading-tight tracking-tight text-[30px] md:text-[52px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Đặt món ngon, giao tận nơi
            </h1>
            <p className="!text-white/90 mt-4 md:mt-5 text-[14px] md:text-[17px] leading-relaxed font-medium drop-shadow-md">
              Khám phá hàng trăm nhà hàng gần bạn. Giao nhanh trong 30 phút.
            </p>

            {/* Fake search bar — opens overlay on click */}
            <button
              onClick={() => openSearch()}
              className="hidden md:flex items-center mt-7 mx-auto bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.18)] overflow-hidden w-full h-[52px] pr-1.5 cursor-text group hover:shadow-[0_10px_36px_rgba(0,0,0,0.22)] transition-shadow"
            >
              <Search className="ml-5 h-5 w-5 text-text-tertiary shrink-0" />
              <span className="flex-1 px-3 text-[14.5px] text-text-disabled text-left font-medium">
                {placeholder}
              </span>
              <span className="h-[42px] px-6 bg-primary text-white text-[14px] font-bold rounded-full flex items-center gap-2 shrink-0 shadow-[0_4px_12px_rgba(220,38,38,0.25)] group-hover:bg-primary-hover transition-colors">
                Tìm kiếm
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>

            {/* Popular tags — click opens overlay with seed query */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-5 flex-wrap">
              <span className="text-white/70 text-[13px] font-medium mr-1 drop-shadow-sm">
                Phổ biến:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => openSearch(tag)}
                  className="text-[12.5px] font-medium text-white border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/25 px-4 py-1.5 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
