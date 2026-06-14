//Axios is used on the frontend to send HTTP requests to the backend API, and CORS is configured on the backend to allow the frontend 
// (running on a different origin/port) to access those APIs securely.

//our configured axios instance

// Login → get access token store in localstorage and refresh token stored in cookie
//    ↓    request interceptor gets triggered
// Request → attach access token - Temporary ID card
//    ↓
// Server:
//    ├── valid → success ✅
//    └── expired → 401 ❌ - Now Interceptor kicks in to send Refresh token automatically via cookie
//                      ↓
//             refresh token used 🔄 - Back Up ID 
//                      ↓
//            new access token 🆕
//                      ↓
//            retry request 🔁

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true  // sends cookies automatically (needed for refresh token)
})

// Request interceptor — attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — if token expired, get a new one and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Ask for a new access token using refresh token (sent via cookie)
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        )

        const newToken = res.data.accessToken
        localStorage.setItem('accessToken', newToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)

      } catch (err) {
        // Refresh token also expired — force logout
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api