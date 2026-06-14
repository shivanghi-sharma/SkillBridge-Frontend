import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Profile = () => {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',  //convert array into string
    hourlyRate: user?.hourlyRate || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Convert skills string "React, Node, CSS" → ["React", "Node", "CSS"] bcz backend expects array and input gives string
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      }

      const res = await api.put('/users/profile', updatedData) //axios send request using URL /users/profile , method PUT(update)
      setUser(res.data.user) //update global user
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-2xl font-bold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-2xl p-6">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Success / Error messages */}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* View Mode */}
          {!editing ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Bio</p>
                <p className="text-white mt-1">{user?.bio || 'No bio yet'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                    <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  )) : <p className="text-white">No skills added yet</p>}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hourly Rate</p>
                <p className="text-white mt-1">
                  {user?.hourlyRate ? `₹${user.hourlyRate}/hr` : 'Not set'}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition"
              >
                Edit Profile
              </button>
            </div>

          ) : (

            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell people about yourself..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Skills <span className="text-gray-500">(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Design"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Hourly Rate (₹)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile