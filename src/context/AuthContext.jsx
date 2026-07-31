//stores user, token , login , logout
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — check if user is already logged in
  useEffect(() => {
    // Clear legacy localStorage token if it exists
    localStorage.removeItem('accessToken')
    
    const token = sessionStorage.getItem('accessToken')
    if (token) {
      // Fetch their profile to restore session
      api.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => sessionStorage.removeItem('accessToken'))
        .finally(() => setLoading(false))
    } else {
      setTimeout(() => setLoading(false), 0)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    sessionStorage.setItem('accessToken', res.data.accessToken)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout API failed, but clearing local state anyway', error)
    } finally {
      sessionStorage.removeItem('accessToken')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — so we don't have to import useContext everywhere
export const useAuth = () => useContext(AuthContext)