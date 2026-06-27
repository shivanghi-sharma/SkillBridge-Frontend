import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          Skill<span className="text-blue-500">Bridge</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/browse" className="text-gray-400 hover:text-white text-sm transition">
            Browse
          </Link>
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
            Dashboard
          </Link>
          <Link to="/profile" className="text-gray-400 hover:text-white text-sm transition">
            Profile
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar