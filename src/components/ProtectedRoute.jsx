//Blocks Pages if not logged in

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Still checking if user is logged in — don't redirect yet
  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner spinner--lg" />
    </div>
  )

  // Not logged in — send to login page
  if (!user) return <Navigate to="/login" />

  // Logged in — show the page
  return children
}

export default ProtectedRoute