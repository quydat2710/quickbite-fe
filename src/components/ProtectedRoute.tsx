import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/stores/authStore'

interface Props {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

/**
 * Route guard component.
 * - requireAuth=true → must be logged in
 * - allowedRoles → must have one of these roles
 * - Redirects to login if not authenticated
 * - Redirects to correct dashboard if wrong role
 */
export default function ProtectedRoute({ children, allowedRoles, requireAuth = true }: Props) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // Not logged in → redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but wrong role
  if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their correct dashboard
    const roleRedirect: Record<UserRole, string> = {
      CUSTOMER: '/',
      RESTAURANT_OWNER: '/restaurant',
      DRIVER: '/driver',
      ADMIN: '/admin',
    }
    return <Navigate to={roleRedirect[user.role] || '/'} replace />
  }

  return <>{children}</>
}
