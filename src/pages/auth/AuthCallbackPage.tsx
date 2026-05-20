import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'

/**
 * Handles OAuth callback: receives tokens from URL params,
 * stores them, fetches user profile, then redirects.
 * Route: /auth/callback?accessToken=xxx&refreshToken=xxx
 */
export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)
  const [error, setError] = useState('')

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const errParam = searchParams.get('error')

    if (errParam) {
      setError('Đăng nhập bằng mạng xã hội thất bại. Vui lòng thử lại.')
      return
    }

    if (!accessToken) {
      setError('Không nhận được token xác thực.')
      return
    }

    // Store tokens
    localStorage.setItem('qb_access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('qb_refresh_token', refreshToken)
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me')
        const user = data.data || data
        localStorage.setItem('qb_user', JSON.stringify(user))
        setUser(user)

        // Check if profile is incomplete (social login without phone/role)
        if (!user.phone || user.status === 'INCOMPLETE') {
          navigate('/complete-profile', { replace: true })
          return
        }

        // Redirect based on role
        const redirectMap: Record<string, string> = {
          CUSTOMER: '/',
          RESTAURANT_OWNER: '/restaurant',
          DRIVER: '/driver',
          ADMIN: '/admin',
        }
        navigate(redirectMap[user.role] || '/', { replace: true })
      } catch {
        setError('Không thể tải thông tin tài khoản.')
      }
    }

    fetchProfile()
  }, [searchParams, navigate, setUser])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif', background: '#F5F5F7',
      }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>😕</p>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>Đã xảy ra lỗi</h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>{error}</p>
          <button onClick={() => navigate('/login')} style={{
            padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
            fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
          }}>
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', background: '#F5F5F7',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', border: '4px solid #F1F5F9', borderTopColor: '#DC2626',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: '15px', color: '#64748B', fontWeight: 500 }}>Đang xác thực tài khoản...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
