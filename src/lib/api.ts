import axios from 'axios'

// ── Axios Instance ──
const api = axios.create({
  baseURL: '/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor: attach JWT token ──
api.interceptors.request.use(config => {
  const token = localStorage.getItem('qb_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor: handle 401 + auto refresh ──
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('qb_refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post('/v1/auth/refresh', { refreshToken })
        const newAccessToken = data.data?.accessToken || data.accessToken

        localStorage.setItem('qb_access_token', newAccessToken)
        if (data.data?.refreshToken || data.refreshToken) {
          localStorage.setItem('qb_refresh_token', data.data?.refreshToken || data.refreshToken)
        }

        processQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('qb_access_token')
        localStorage.removeItem('qb_refresh_token')
        localStorage.removeItem('qb_user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api

// ── Helper to extract error message ──
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    // BE format: { success: false, error: { code, message } }
    if (data?.error?.message) return data.error.message
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.error === 'string') return data.error
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Đã xảy ra lỗi, vui lòng thử lại'
}
