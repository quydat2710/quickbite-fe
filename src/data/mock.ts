// ── Mock data barrel export ──
// All mock data is organized by domain for maintainability.

export { mockRestaurants } from './restaurants.mock'
export { mockCategories } from './categories.mock'
export type { CategoryId } from './categories.mock'
export { mockFeaturedBrands } from './brands.mock'
export { mockMenuItems, mockReviews } from './menu.mock'
export type { MenuItem, MenuItemOption, MenuItemOptionGroup, Review } from './menu.mock'
export { mockOrders, mockNotifications } from './orders.mock'
export type { MockOrder, OrderStatus, NotifType, MockNotification } from './orders.mock'
