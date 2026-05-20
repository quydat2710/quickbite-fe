import { useState, useEffect } from 'react'
import { Star, MessageSquare, Send, Filter, Loader2 } from 'lucide-react'
import { restaurantOwnerApi } from '@/services/api'

interface DashboardReview {
  id: string
  customerName: string
  rating: number
  comment: string
  reply?: string
  orderCode?: string
  createdAt: string
}

const STAR_FILTERS = [0, 5, 4, 3, 2, 1] // 0 = all

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} style={{ width: '16px', height: '16px', color: i <= rating ? '#F59E0B' : '#E2E8F0', fill: i <= rating ? '#F59E0B' : 'none' }} />
      ))}
    </div>
  )
}

export default function RestaurantReviewsPage() {
  const [reviews, setReviews] = useState<DashboardReview[]>([])
  const [filter, setFilter] = useState(0)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const restaurants = await restaurantOwnerApi.getMyRestaurants()
        if (restaurants.length > 0) {
          const res = await restaurantOwnerApi.getReviews(restaurants[0].id, 1, 100)
          setReviews((res.data || []).map((r: any) => ({
            id: r.id,
            customerName: r.customerName || 'Khách hàng',
            rating: r.rating,
            comment: r.comment || '',
            reply: r.reply,
            orderCode: r.orderId?.slice(0, 8)?.toUpperCase(),
            createdAt: r.createdAt,
          })))
        }
      } catch {}
      finally { setIsLoading(false) }
    }
    load()
  }, [])

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  // Stats
  const total = reviews.length
  const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0'
  const dist = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length }))
  const maxCount = Math.max(...dist.map(d => d.count), 1)

  const handleReply = (id: string) => {
    if (!replyText.trim()) return
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r))
    setReplyingId(null)
    setReplyText('')
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

      {/* ══ LEFT: Stats ══ */}
      <div style={{ width: '280px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>{avg}</p>
          <StarRating rating={Math.round(avg)} />
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>{total} đánh giá</p>
        </div>

        {/* Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {dist.map(d => (
            <div key={d.star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', width: '20px' }}>{d.star}★</span>
              <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{ width: `${(d.count / maxCount) * 100}%`, height: '100%', borderRadius: '4px', background: '#F59E0B', transition: 'width 0.4s' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#94A3B8', width: '24px', textAlign: 'right' }}>{d.count}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {STAR_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '12px', fontWeight: filter === s ? 700 : 500,
              background: filter === s ? '#0F172A' : '#F1F5F9', color: filter === s ? '#fff' : '#475569',
            }}>
              {s === 0 ? 'Tất cả' : `${s} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* ══ RIGHT: Review list ══ */}
      <div style={{ flex: 1, minWidth: '340px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8', background: '#fff', borderRadius: '16px' }}>
            <MessageSquare style={{ width: '44px', height: '44px', margin: '0 auto 14px', opacity: 0.3, display: 'block' }} />
            <p style={{ fontSize: '15px', fontWeight: 500 }}>Chưa có đánh giá nào</p>
          </div>
        ) : filtered.map(review => (
          <div key={review.id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{review.customerName}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>{review.orderCode}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Comment */}
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>{review.comment}</p>

            {/* Reply */}
            {review.reply ? (
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px 14px', borderLeft: '3px solid #DC2626' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', margin: '0 0 4px 0' }}>Phản hồi của bạn</p>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{review.reply}</p>
              </div>
            ) : replyingId === review.id ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && handleReply(review.id)}
                  autoFocus
                />
                <button onClick={() => handleReply(review.id)} style={{
                  width: '42px', height: '42px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ) : (
              <button onClick={() => { setReplyingId(review.id); setReplyText('') }} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0',
                background: '#fff', color: '#475569', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <MessageSquare style={{ width: '14px', height: '14px' }} /> Phản hồi
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
