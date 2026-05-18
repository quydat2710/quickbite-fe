import { useState, useEffect } from 'react'

/**
 * Custom hook for automatic image slider with pagination.
 */
export function useSlider(totalSlides: number, intervalMs = 4500) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, intervalMs)
    return () => clearInterval(slideInterval)
  }, [totalSlides, intervalMs])

  return { currentSlide, setCurrentSlide }
}
