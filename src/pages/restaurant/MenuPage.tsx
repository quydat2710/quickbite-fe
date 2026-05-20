import { useState, useEffect } from 'react'
import {
  Plus, Edit3, Trash2, ToggleLeft, ToggleRight,
  GripVertical, X, Upload, DollarSign, ChevronDown, ChevronUp, Loader2,
} from 'lucide-react'
import { restaurantOwnerApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'
import { uploadToCloudinary } from '@/lib/cloudinary'

type MenuCategory = { id: string; name: string; sortOrder: number; itemCount: number }
type DashboardMenuItem = {
  id: string; categoryId: string; name: string; description: string;
  price: number; image: string; isAvailable: boolean; totalSold: number;
}
const formatVND = formatPrice

/* ═══ Overlay ═══ */
const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 100, backdropFilter: 'blur(4px)', padding: '16px',
}

/* ═══ Category Modal ═══ */
function CategoryModal({ initial, onClose, onSave }: {
  initial?: MenuCategory; onClose: () => void; onSave: (name: string) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{initial ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex' }}><X style={{ width: '20px', height: '20px' }} /></button>
        </div>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Tên danh mục</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Món chính, Đồ uống..."
          autoFocus style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box', marginBottom: '20px' }} />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Huỷ</button>
          <button onClick={() => { if (name.trim()) onSave(name.trim()) }} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#DC2626,#EA580C)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: name.trim() ? 1 : 0.5 }}>
            {initial ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══ Option Group types ═══ */
type OptionItem = { id: string; name: string; extraPrice: number }
type OptionGroup = { id: string; name: string; required: boolean; minSelect: number; maxSelect: number; options: OptionItem[] }

const inputBase: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }

/* ═══ Item Modal ═══ */
function ItemModal({ initial, categoryId, onClose, onSave }: {
  initial?: DashboardMenuItem; categoryId: string; onClose: () => void
  onSave: (item: Omit<DashboardMenuItem, 'id' | 'totalSold'>) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [desc, setDesc] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial?.price?.toString() || '')
  const [avail, setAvail] = useState(initial?.isAvailable ?? true)
  const [img, setImg] = useState(initial?.image || '')
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([
    // Pre-fill example for demo
    ...(initial ? [] : []),
  ])
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const valid = name.trim() && price.trim()

  const addGroup = () => {
    const g: OptionGroup = { id: `og-${Date.now()}`, name: '', required: false, minSelect: 0, maxSelect: 3, options: [] }
    setOptionGroups(prev => [...prev, g])
    setExpandedGroup(g.id)
  }
  const updateGroup = (id: string, patch: Partial<OptionGroup>) => {
    setOptionGroups(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g))
  }
  const removeGroup = (id: string) => setOptionGroups(prev => prev.filter(g => g.id !== id))
  const addOption = (gId: string) => {
    setOptionGroups(prev => prev.map(g => g.id === gId ? { ...g, options: [...g.options, { id: `opt-${Date.now()}`, name: '', extraPrice: 0 }] } : g))
  }
  const updateOption = (gId: string, oId: string, patch: Partial<OptionItem>) => {
    setOptionGroups(prev => prev.map(g => g.id === gId ? { ...g, options: g.options.map(o => o.id === oId ? { ...o, ...patch } : o) } : g))
  }
  const removeOption = (gId: string, oId: string) => {
    setOptionGroups(prev => prev.map(g => g.id === gId ? { ...g, options: g.options.filter(o => o.id !== oId) } : g))
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{initial ? 'Sửa món' : 'Thêm món mới'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex' }}><X style={{ width: '20px', height: '20px' }} /></button>
        </div>

        {/* Image preview */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Ảnh món ăn</label>
          <label style={{ width: '100%', height: '140px', borderRadius: '14px', border: '2px dashed #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
            {img ? (
              <>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Upload style={{ width: '16px', height: '16px' }} /> Đổi ảnh</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                <Upload style={{ width: '24px', height: '24px', marginBottom: '6px' }} />
                <p style={{ fontSize: '12px', fontWeight: 500, margin: 0 }}>Nhấn để tải ảnh lên</p>
              </div>
            )}
            <input type="file" accept="image/*" hidden onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const result = await uploadToCloudinary(file, 'quickbite/menu-items')
                setImg(result.secure_url)
              } catch (err) {
                console.error('Upload failed:', err)
              }
            }} />
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Tên món <span style={{ color: '#DC2626' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Bún bò Huế đặc biệt" style={{ ...inputBase, padding: '12px 14px', fontSize: '14px' }} />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Mô tả</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Mô tả ngắn..." rows={2}
              style={{ ...inputBase, padding: '12px 14px', fontSize: '14px', resize: 'vertical' } as React.CSSProperties} />
          </div>

          {/* Price + Available */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Giá (VNĐ) <span style={{ color: '#DC2626' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <DollarSign style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input value={price} onChange={e => setPrice(e.target.value.replace(/\D/g, ''))} placeholder="55000"
                  style={{ ...inputBase, padding: '12px 14px 12px 36px', fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
              <button onClick={() => setAvail(!avail)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, color: avail ? '#10B981' : '#94A3B8', padding: '10px 0' }}>
                {avail ? <ToggleRight style={{ width: '28px', height: '28px' }} /> : <ToggleLeft style={{ width: '28px', height: '28px' }} />}
                {avail ? 'Đang bán' : 'Tạm ngưng'}
              </button>
            </div>
          </div>
        </div>

        {/* ══ OPTION GROUPS ══ */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Tuỳ chọn & Size</h4>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>VD: Chọn size (S/M/L), Topping thêm...</p>
            </div>
            <button onClick={addGroup} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #DC2626', background: '#fff', color: '#DC2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus style={{ width: '14px', height: '14px' }} /> Thêm nhóm
            </button>
          </div>

          {optionGroups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', fontSize: '13px' }}>
              Chưa có nhóm tuỳ chọn nào. Bấm "Thêm nhóm" để tạo Size, Topping...
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {optionGroups.map(group => {
              const isOpen = expandedGroup === group.id
              return (
                <div key={group.id} style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {/* Group header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: isOpen ? '#F8FAFC' : '#fff', cursor: 'pointer' }}
                    onClick={() => setExpandedGroup(isOpen ? null : group.id)}>
                    <div style={{ flex: 1 }}>
                      <input value={group.name} onClick={e => e.stopPropagation()} onChange={e => updateGroup(group.id, { name: e.target.value })}
                        placeholder="Tên nhóm (VD: Chọn size)" style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#0F172A', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>{group.options.length} lựa chọn</span>
                        <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', fontWeight: 600, background: group.required ? '#FEF2F2' : '#F1F5F9', color: group.required ? '#DC2626' : '#64748B' }}>
                          {group.required ? 'Bắt buộc' : 'Tuỳ chọn'}
                        </span>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeGroup(group.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px', display: 'flex' }}>
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                    {isOpen ? <ChevronUp style={{ width: '16px', height: '16px', color: '#94A3B8' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: '#94A3B8' }} />}
                  </div>

                  {/* Group body */}
                  {isOpen && (
                    <div style={{ padding: '14px', borderTop: '1px solid #F1F5F9' }}>
                      {/* Required + Min/Max */}
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button onClick={() => updateGroup(group.id, { required: !group.required })} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600,
                          background: group.required ? '#FEF2F2' : '#F1F5F9', color: group.required ? '#DC2626' : '#64748B',
                        }}>
                          {group.required ? <ToggleRight style={{ width: '18px', height: '18px' }} /> : <ToggleLeft style={{ width: '18px', height: '18px' }} />}
                          {group.required ? 'Bắt buộc chọn' : 'Không bắt buộc'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                          <span>Chọn từ</span>
                          <input type="number" min={0} max={10} value={group.minSelect} onChange={e => updateGroup(group.id, { minSelect: +e.target.value })}
                            style={{ width: '48px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', textAlign: 'center', fontFamily: 'inherit', outline: 'none' }} />
                          <span>đến</span>
                          <input type="number" min={1} max={10} value={group.maxSelect} onChange={e => updateGroup(group.id, { maxSelect: +e.target.value })}
                            style={{ width: '48px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', textAlign: 'center', fontFamily: 'inherit', outline: 'none' }} />
                        </div>
                      </div>

                      {/* Options list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {group.options.map(opt => (
                          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input value={opt.name} onChange={e => updateOption(group.id, opt.id, { name: e.target.value })} placeholder="Tên (VD: Size lớn)"
                              style={{ ...inputBase, flex: 1 }} />
                            <div style={{ position: 'relative', width: '110px', flexShrink: 0 }}>
                              <input value={opt.extraPrice} onChange={e => updateOption(group.id, opt.id, { extraPrice: +e.target.value.replace(/\D/g, '') })} placeholder="0"
                                style={{ ...inputBase, paddingRight: '28px', textAlign: 'right' }} />
                              <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>đ</span>
                            </div>
                            <button onClick={() => removeOption(group.id, opt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px', display: 'flex', flexShrink: 0 }}>
                              <X style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => addOption(group.id)} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1.5px dashed #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', justifyContent: 'center' }}>
                        <Plus style={{ width: '14px', height: '14px' }} /> Thêm lựa chọn
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={onClose} style={{ padding: '12px 22px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Huỷ</button>
          <button onClick={() => { if (valid) onSave({ name, description: desc, price: Number(price), image: img || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop', isAvailable: avail, categoryId }) }}
            style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#DC2626,#EA580C)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(220,38,38,0.3)', opacity: valid ? 1 : 0.5 }}>
            {initial ? 'Cập nhật' : 'Thêm món'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══ Main Page ═══ */
export default function RestaurantMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<DashboardMenuItem[]>([])
  const [activeCat, setActiveCat] = useState('')
  const [restaurantId, setRestaurantId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [showCatModal, setShowCatModal] = useState(false)
  const [editCat, setEditCat] = useState<MenuCategory | undefined>()
  const [showItemModal, setShowItemModal] = useState(false)
  const [editItem, setEditItem] = useState<DashboardMenuItem | undefined>()

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const restaurants = await restaurantOwnerApi.getMyRestaurants()
        if (restaurants.length > 0) {
          const restId = restaurants[0].id
          setRestaurantId(restId)
          const menu = await restaurantOwnerApi.getMenu(restId)
          const cats: MenuCategory[] = []
          const menuItems: DashboardMenuItem[] = []
          menu.forEach((cat: any, i: number) => {
            const catId = cat._id || cat.id || `cat-${i}`
            cats.push({ id: catId, name: cat.name, sortOrder: cat.sortOrder || i, itemCount: (cat.items || []).length })
            ;(cat.items || []).forEach((item: any) => {
              menuItems.push({
                id: item._id || item.id,
                categoryId: catId,
                name: item.name,
                description: item.description || '',
                price: item.basePrice || 0,
                image: item.image || '',
                isAvailable: item.isAvailable ?? true,
                totalSold: item.totalSold || 0,
              })
            })
          })
          setCategories(cats)
          setItems(menuItems)
          if (cats.length > 0) setActiveCat(cats[0].id)
        }
      } catch {}
      finally { setIsLoading(false) }
    }
    load()
  }, [])

  const filtered = items.filter(i => i.categoryId === activeCat)

  const toggleAvailable = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
  }

  const handleSaveCat = (name: string) => {
    if (editCat) {
      setCategories(prev => prev.map(c => c.id === editCat.id ? { ...c, name } : c))
    } else {
      const newCat: MenuCategory = { id: `cat-${Date.now()}`, name, sortOrder: categories.length + 1, itemCount: 0 }
      setCategories(prev => [...prev, newCat])
      setActiveCat(newCat.id)
    }
    setShowCatModal(false); setEditCat(undefined)
  }

  const handleDeleteCat = (id: string) => {
    if (!confirm('Xoá danh mục này? Các món trong danh mục cũng sẽ bị xoá.')) return
    setCategories(prev => prev.filter(c => c.id !== id))
    setItems(prev => prev.filter(i => i.categoryId !== id))
    if (activeCat === id) setActiveCat(categories.find(c => c.id !== id)?.id || '')
  }

  const handleSaveItem = (data: Omit<DashboardMenuItem, 'id' | 'totalSold'>) => {
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...data } : i))
    } else {
      setItems(prev => [...prev, { ...data, id: `mi-${Date.now()}`, totalSold: 0 }])
    }
    setShowItemModal(false); setEditItem(undefined)
  }

  const handleDeleteItem = (id: string) => {
    if (!confirm('Xoá món này?')) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ══ LEFT: Categories ══ */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Danh mục</h3>
              <button onClick={() => { setEditCat(undefined); setShowCatModal(true) }} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {categories.map(cat => {
                const isActive = activeCat === cat.id
                return (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                    <button onClick={() => setActiveCat(cat.id)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 8px 12px 14px', borderRadius: '10px 0 0 10px', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left', background: isActive ? '#FEF2F2' : 'transparent',
                    }}>
                      <GripVertical style={{ width: '14px', height: '14px', color: '#CBD5E1', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '14px', fontWeight: isActive ? 700 : 500, color: isActive ? '#DC2626' : '#0F172A' }}>{cat.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: '8px' }}>
                        {items.filter(i => i.categoryId === cat.id).length}
                      </span>
                    </button>
                    {/* Edit/Delete */}
                    <div style={{ display: 'flex', opacity: isActive ? 1 : 0, transition: 'opacity 0.15s' }}>
                      <button onClick={() => { setEditCat(cat); setShowCatModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '6px 4px', display: 'flex' }}>
                        <Edit3 style={{ width: '13px', height: '13px' }} />
                      </button>
                      <button onClick={() => handleDeleteCat(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '6px 4px', display: 'flex' }}>
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Items ══ */}
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {categories.find(c => c.id === activeCat)?.name || 'Menu'}
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B', marginLeft: '8px' }}>({filtered.length} món)</span>
            </h3>
            <button onClick={() => { setEditItem(undefined); setShowItemModal(true) }} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
            }}>
              <Plus style={{ width: '16px', height: '16px' }} /> Thêm món mới
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#94A3B8', background: '#fff', borderRadius: '16px' }}>
                <p style={{ fontSize: '15px', fontWeight: 500 }}>Chưa có món nào trong danh mục này</p>
                <button onClick={() => { setEditItem(undefined); setShowItemModal(true) }} style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #DC2626', background: '#fff', color: '#DC2626', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  + Thêm món đầu tiên
                </button>
              </div>
            )}
            {filtered.map(item => (
              <div key={item.id} style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)',
                display: 'flex', alignItems: 'center', gap: '16px',
                opacity: item.isAvailable ? 1 : 0.6, transition: 'opacity 0.2s',
              }}>
                <div style={{ width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, padding: '14px 0', minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description || '—'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>{formatVND(item.price)}</span>
                    <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>• {item.totalSold} đã bán</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 18px 0 0', flexShrink: 0 }}>
                  <button onClick={() => toggleAvailable(item.id)} title={item.isAvailable ? 'Tắt món' : 'Bật món'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isAvailable ? '#10B981' : '#94A3B8', display: 'flex', padding: '4px' }}>
                    {item.isAvailable ? <ToggleRight style={{ width: '28px', height: '28px' }} /> : <ToggleLeft style={{ width: '28px', height: '28px' }} />}
                  </button>
                  <button onClick={() => { setEditItem(item); setShowItemModal(true) }} title="Sửa" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit3 style={{ width: '15px', height: '15px' }} />
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} title="Xoá" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 style={{ width: '15px', height: '15px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      {showCatModal && <CategoryModal initial={editCat} onClose={() => { setShowCatModal(false); setEditCat(undefined) }} onSave={handleSaveCat} />}
      {showItemModal && <ItemModal initial={editItem} categoryId={activeCat} onClose={() => { setShowItemModal(false); setEditItem(undefined) }} onSave={handleSaveItem} />}
    </>
  )
}
