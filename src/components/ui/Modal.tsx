import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 480,
  md: 560,
  lg: 720,
}

export function Modal({ isOpen, onClose, title, children, className, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxW = SIZE_MAP[size]
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const mobile = vw < 768

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: mobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: mobile ? '0' : '16px',
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div
        className="animate-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
        }}
      />

      {/* Modal Panel */}
      <div
        className={cn('animate-slide-up', className)}
        style={{
          position: 'relative',
          zIndex: 10,
          background: '#fff',
          width: mobile ? '100%' : `min(${maxW}px, calc(100vw - 32px))`,
          maxWidth: mobile ? '100%' : maxW,
          maxHeight: mobile ? '92dvh' : '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: mobile ? '24px 24px 0 0' : '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle on mobile */}
        {mobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#e5e7eb' }} />
          </div>
        )}

        {/* Header */}
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
            flexShrink: 0,
          }}>
            <h3 style={{ fontWeight: 700, color: '#111827', fontSize: 16, margin: 0 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                padding: 6,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X style={{ width: 20, height: 20, color: '#9ca3af' }} />
            </button>
          </div>
        )}

        {/* Body — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
