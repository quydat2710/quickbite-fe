import { useState, useEffect } from 'react'

/**
 * Custom hook for typewriter placeholder effect.
 * Cycles through a list of suggestions with typing and deleting animation.
 */
export function useTypewriter(suggestions: string[]) {
  const [placeholder, setPlaceholder] = useState('')
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = suggestions[suggestionIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false)
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
        return
      }
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
      }, 30)
    } else {
      if (charIndex === currentWord.length) {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
        return
      }
      timeout = setTimeout(() => {
        setPlaceholder(currentWord.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
      }, 80)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, suggestionIndex, suggestions])

  return placeholder
}
