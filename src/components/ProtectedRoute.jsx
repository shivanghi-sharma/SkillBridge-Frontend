//Bocks Pages if not logged in

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Still checking if user is logged in — don't redirect yet
  if (loading) return <div className="text-center mt-20">Loading...</div>

  // Not logged in — send to login page
  if (!user) return <Navigate to="/login" />

  // Logged in — show the page
  return children
}

export default ProtectedRoute