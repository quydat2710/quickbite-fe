import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { mockCategories } from '@/data/mock'
import { cn } from '@/lib/utils'
import type { CategoryId } from '@/data/mock'

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

interface CategoryGridProps {
  selectedCategory: CategoryId | null
  onSelectCategory: (id: CategoryId | null) => void
}

/**
 * Grid of food categories with icons and expand/collapse functionality.
 */
export function CategoryGrid({ selectedCategory, onSelectCategory }: CategoryGridProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-bg-white pt-6 pb-6 md:pt-12 md:pb-8">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-xl font-bold">Danh mục</h2>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group">
            Tất cả
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {mockCategories.slice(0, isExpanded ? 15 : 7).map((cat) => {
            const iconSrc = categoryIcons[cat.id]
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className="group flex flex-col items-center gap-2 py-2 outline-none"
              >
                <div
                  className={cn(
                    'h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative',
                    isSelected
                      ? 'bg-white shadow-md ring-2 ring-primary -translate-y-0.5'
                      : 'bg-white shadow-xs ring-1 ring-black/5 group-hover:shadow-sm group-hover:-translate-y-0.5'
                  )}
                >
                  <img
                    src={iconSrc}
                    alt={cat.name}
                    className={cn(
                      'h-9 w-9 md:h-10 md:w-10 object-contain transition-transform duration-300 mix-blend-darken contrast-125 brightness-105',
                      isSelected && 'scale-110'
                    )}
                  />
                  {isSelected && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs transition-colors whitespace-nowrap',
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
            className="group flex flex-col items-center gap-2 py-2 outline-none"
          >
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-surface-active group-hover:bg-surface-hover flex items-center justify-center transition-all duration-300 group-hover:shadow-xs group-hover:-translate-y-0.5">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              )}
            </div>
            <span className="text-xs font-medium text-text-secondary group-hover:text-primary transition-colors whitespace-nowrap">
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

// Need useState import
import { useState } from 'react'
