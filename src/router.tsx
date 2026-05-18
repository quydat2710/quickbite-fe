import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'

// ── Lazy-loaded page components ──
const HomePage = lazy(() => import('@/pages/customer/HomePage'))
const SearchPage = lazy(() => import('@/pages/customer/SearchPage'))
const OrdersPage = lazy(() => import('@/pages/customer/OrdersPage'))
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'))
const CartPage = lazy(() => import('@/pages/customer/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage'))
const OrderTrackingPage = lazy(() => import('@/pages/customer/OrderTrackingPage'))
const RestaurantDetailPage = lazy(() => import('@/pages/customer/RestaurantDetailPage'))
const NotificationsPage = lazy(() => import('@/pages/customer/NotificationsPage'))
const FavoritesPage = lazy(() => import('@/pages/customer/FavoritesPage'))
const PromotionsPage = lazy(() => import('@/pages/customer/PromotionsPage'))
const AddressesPage = lazy(() => import('@/pages/customer/AddressesPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

// ── Suspense wrapper with minimal loading state ──
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// ── Helper to wrap lazy components ──
function lazyPage(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <SuspenseWrapper>
      <Component />
    </SuspenseWrapper>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: lazyPage(HomePage) },
      { path: 'search', element: lazyPage(SearchPage) },
      { path: 'orders', element: lazyPage(OrdersPage) },
      { path: 'orders/:id', element: lazyPage(OrderTrackingPage) },
      { path: 'profile', element: lazyPage(ProfilePage) },
      { path: 'profile/addresses', element: lazyPage(AddressesPage) },
      { path: 'cart', element: lazyPage(CartPage) },
      { path: 'checkout', element: lazyPage(CheckoutPage) },
      { path: 'restaurant/:id', element: lazyPage(RestaurantDetailPage) },
      { path: 'notifications', element: lazyPage(NotificationsPage) },
      { path: 'favorites', element: lazyPage(FavoritesPage) },
      { path: 'promotions', element: lazyPage(PromotionsPage) },
    ],
  },
  { path: '/login', element: lazyPage(LoginPage) },
  { path: '/register', element: lazyPage(RegisterPage) },
  { path: '/forgot-password', element: lazyPage(ForgotPasswordPage) },
])
