// Mock data — categories

export type CategoryId =
  | 'com'
  | 'pho'
  | 'bun'
  | 'pizza'
  | 'coffee'
  | 'chicken'
  | 'sushi'
  | 'banhmi'
  | 'milktea'
  | 'dessert'
  | 'snack'
  | 'vegan'
  | 'burger'
  | 'seafood'
  | 'hotpot'
  | 'korean'

export const mockCategories: Array<{ id: CategoryId; name: string; keyword: string }> = [
  { id: 'com', name: 'Cơm', keyword: 'cơm' },
  { id: 'pho', name: 'Phở', keyword: 'phở' },
  { id: 'bun', name: 'Bún', keyword: 'bún' },
  { id: 'pizza', name: 'Pizza', keyword: 'pizza' },
  { id: 'coffee', name: 'Cà phê', keyword: 'cà phê' },
  { id: 'chicken', name: 'Gà rán', keyword: 'gà' },
  { id: 'sushi', name: 'Sushi', keyword: 'sushi' },
  { id: 'banhmi', name: 'Bánh mì', keyword: 'bánh mì' },
  { id: 'milktea', name: 'Trà sữa', keyword: 'trà sữa' },
  { id: 'dessert', name: 'Tráng miệng', keyword: 'tráng miệng' },
  { id: 'snack', name: 'Ăn vặt', keyword: 'ăn vặt' },
  { id: 'vegan', name: 'Món chay', keyword: 'chay' },
  { id: 'burger', name: 'Hamburger', keyword: 'burger' },
  { id: 'seafood', name: 'Hải sản', keyword: 'hải sản' },
  { id: 'hotpot', name: 'Lẩu', keyword: 'lẩu' },
  { id: 'korean', name: 'Món Hàn', keyword: 'hàn' },
]
