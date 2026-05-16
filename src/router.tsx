import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import HomePage from '@/pages/customer/HomePage'
import SearchPage from '@/pages/customer/SearchPage'
import OrdersPage from '@/pages/customer/OrdersPage'
import ProfilePage from '@/pages/customer/ProfilePage'
import CartPage from '@/pages/customer/CartPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage'
import RestaurantDetailPage from '@/pages/customer/RestaurantDetailPage'
import NotificationsPage from '@/pages/customer/NotificationsPage'
import FavoritesPage from '@/pages/customer/FavoritesPage'
import PromotionsPage from '@/pages/customer/PromotionsPage'
import AddressesPage from '@/pages/customer/AddressesPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderTrackingPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/addresses', element: <AddressesPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'restaurant/:id', element: <RestaurantDetailPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'promotions', element: <PromotionsPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
])
