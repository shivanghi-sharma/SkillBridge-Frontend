import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('stats')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/')
      return
    }
  }, [user])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (tab !== 'users') return
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/admin/users?page=${page}&limit=10`)
        setUsers(res.data.users)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [tab, page])

  const handleSuspend = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/suspend`)
      toast.success(res.data.message)
      setUsers(users.map(u => u._id === userId ? { ...u, suspended: res.data.user.suspended } : u))
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading admin dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-white text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Platform overview and management</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {['stats', 'users'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-2 text-sm font-medium transition ${
                tab === t
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'stats' ? 'Overview' : 'Manage Users'}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Sellers', value: stats.totalSellers },
              { label: 'Buyers', value: stats.totalBuyers },
              { label: 'Total Bookings', value: stats.totalBookings },
              { label: 'Completed', value: stats.completedBookings }
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                <p className="text-white text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t border-gray-800">
                      <td className="px-5 py-3 text-white">{u.name}</td>
                      <td className="px-5 py-3 text-gray-400">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.suspended
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {u.suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleSuspend(u._id)}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          {u.suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-gray-400 text-sm disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-gray-400 text-sm disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard