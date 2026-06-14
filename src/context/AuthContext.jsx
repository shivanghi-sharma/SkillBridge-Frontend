//stores user, token , login , logout
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      // Fetch their profile to restore session
      api.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', res.data.accessToken)
    setUser(res.data.user)
  }

  const logout = async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — so we don't have to import useContext everywhere
export const useAuth = () => useContext(AuthContext)