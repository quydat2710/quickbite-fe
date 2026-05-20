// Mock data — menu items, reviews

export interface MenuItemOption {
  id: string
  name: string
  extraPrice: number
}

export interface MenuItemOptionGroup {
  id: string
  name: string
  required: boolean
  maxSelect: number
  options: MenuItemOption[]
}

export interface MenuItem {
  id: string
  categoryName: string
  name: string
  description: string
  basePrice: number
  image: string
  isAvailable: boolean
  optionGroups: MenuItemOptionGroup[]
  totalSold: number
}

export const mockMenuItems: Record<string, MenuItem[]> = {
  '1': [
    {
      id: 'm1',
      categoryName: 'Bún bò',
      name: 'Bún Bò Huế Đặc Biệt',
      description: 'Bún bò với đầy đủ thịt bò, giò heo, huyết, chả cua',
      basePrice: 65000,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 520,
      optionGroups: [
        {
          id: 'og1', name: 'Chọn size', required: true, maxSelect: 1,
          options: [
            { id: 'o1', name: 'Nhỏ', extraPrice: 0 },
            { id: 'o2', name: 'Vừa', extraPrice: 10000 },
            { id: 'o3', name: 'Lớn', extraPrice: 20000 },
          ],
        },
        {
          id: 'og2', name: 'Topping thêm', required: false, maxSelect: 3,
          options: [
            { id: 'o4', name: 'Thêm huyết', extraPrice: 5000 },
            { id: 'o5', name: 'Thêm chả cua', extraPrice: 10000 },
            { id: 'o6', name: 'Thêm giò heo', extraPrice: 15000 },
          ],
        },
      ],
    },
    {
      id: 'm2',
      categoryName: 'Bún bò',
      name: 'Bún Bò Giò Heo',
      description: 'Bún bò với giò heo hầm mềm',
      basePrice: 55000,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 340,
      optionGroups: [
        {
          id: 'og1', name: 'Chọn size', required: true, maxSelect: 1,
          options: [
            { id: 'o1', name: 'Nhỏ', extraPrice: 0 },
            { id: 'o2', name: 'Lớn', extraPrice: 15000 },
          ],
        },
      ],
    },
    {
      id: 'm3',
      categoryName: 'Đồ uống',
      name: 'Trà Đá',
      description: 'Trà đá mát lạnh',
      basePrice: 5000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 890,
      optionGroups: [],
    },
    {
      id: 'm4',
      categoryName: 'Đồ uống',
      name: 'Nước Mía',
      description: 'Nước mía tươi nguyên chất',
      basePrice: 15000,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 230,
      optionGroups: [],
    },
    {
      id: 'm5',
      categoryName: 'Món thêm',
      name: 'Chả Cua Chiên',
      description: 'Chả cua giòn rụm, ăn kèm rau sống',
      basePrice: 25000,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=300&fit=crop',
      isAvailable: false,
      totalSold: 120,
      optionGroups: [],
    },
  ],
  '2': [
    {
      id: 'm6',
      categoryName: 'Cơm tấm',
      name: 'Cơm Tấm Sườn Bì Chả',
      description: 'Cơm tấm đầy đủ sườn nướng, bì, chả trứng',
      basePrice: 50000,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 680,
      optionGroups: [
        {
          id: 'og3', name: 'Thêm topping', required: false, maxSelect: 2,
          options: [
            { id: 'o7', name: 'Thêm sườn', extraPrice: 20000 },
            { id: 'o8', name: 'Thêm trứng ốp la', extraPrice: 8000 },
          ],
        },
      ],
    },
    {
      id: 'm7',
      categoryName: 'Cơm tấm',
      name: 'Cơm Tấm Sườn Nướng',
      description: 'Cơm tấm với sườn nướng mềm thơm',
      basePrice: 40000,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 450,
      optionGroups: [],
    },
  ],
  '5': [
    {
      id: 'm8',
      categoryName: 'Trà',
      name: 'Trà Sen Vàng',
      description: 'Trà ô long thanh mát kết hợp hạt sen thơm bùi và lớp kem mềm mịn',
      basePrice: 55000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 1200,
      optionGroups: [
        {
          id: 'og4', name: 'Chọn size', required: true, maxSelect: 1,
          options: [
            { id: 'o9', name: 'Size S', extraPrice: 0 },
            { id: 'o10', name: 'Size L', extraPrice: 10000 },
          ],
        },
      ],
    },
    {
      id: 'm9',
      categoryName: 'Trà',
      name: 'Trà Thạch Đào',
      description: 'Trà thanh mát với những miếng đào giòn ngọt và thạch đào dai dai',
      basePrice: 55000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 980,
      optionGroups: [],
    },
    {
      id: 'm10',
      categoryName: 'Cà phê Phin',
      name: 'Phin Sữa Đá',
      description: 'Cà phê rang xay mộc kết hợp sữa đặc ngọt ngào',
      basePrice: 35000,
      image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 2500,
      optionGroups: [],
    },
    {
      id: 'm11',
      categoryName: 'Bánh ngọt',
      name: 'Bánh Mì Chà Bông Phô Mai',
      description: 'Bánh mì mềm kẹp phô mai béo ngậy và chà bông mặn mà',
      basePrice: 25000,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
      isAvailable: false,
      totalSold: 400,
      optionGroups: [],
    },
  ],
}

// ── Reviews ──
export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
  reply?: string
}

export const mockReviews: Record<string, Review[]> = {
  '1': [
    { id: 'r1', customerName: 'Minh Anh', rating: 5, comment: 'Bún bò rất ngon, nước dùng đậm đà. Sẽ quay lại!', createdAt: '2026-05-14' },
    { id: 'r2', customerName: 'Hoàng Việt', rating: 4, comment: 'Giao hàng nhanh, đồ ăn còn nóng hổi.', createdAt: '2026-05-13', reply: 'Cảm ơn bạn đã ủng hộ!' },
    { id: 'r3', customerName: 'Thu Hà', rating: 5, comment: 'Chả cua ngon lắm ạ, phần ăn nhiều.', createdAt: '2026-05-12' },
  ],
  '2': [
    { id: 'r4', customerName: 'Văn Đức', rating: 4, comment: 'Cơm tấm ngon, sườn nướng thơm.', createdAt: '2026-05-15' },
  ],
}
