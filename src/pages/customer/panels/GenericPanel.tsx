import { Package } from 'lucide-react'

export function GenericPanel({ title }: { title: string }) {
  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: '#94A3B8' }}>
        <Package style={{ width: '44px', height: '44px', marginBottom: '14px', opacity: 0.3 }} />
        <p style={{ fontSize: '15px', fontWeight: 500, margin: 0 }}>Chưa có dữ liệu</p>
      </div>
    </div>
  )
}
