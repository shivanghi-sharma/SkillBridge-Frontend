import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  Users,
  ShoppingBag,
  UserCheck,
  CheckCircle,
  BookOpen,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  motion,
} from '../components/motion'

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

  // Skeleton loading state
  if (loading) return (
    <div className="page">
      <div className="page-container">
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: 240, height: 32, marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ width: 300, height: 16 }} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1px',
            backgroundColor: 'var(--color-border-subtle)',
          }}
          className="admin-stats-grid"
        >
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--color-surface)',
                padding: '1.5rem',
              }}
            >
              <div className="skeleton" style={{ width: 16, height: 16, marginBottom: '0.75rem' }} />
              <div className="skeleton" style={{ width: 80, height: 10, marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ width: 50, height: 28 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users },
    { label: 'Sellers', value: stats?.totalSellers, icon: ShoppingBag },
    { label: 'Buyers', value: stats?.totalBuyers, icon: UserCheck },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: BookOpen },
    { label: 'Completed', value: stats?.completedBookings, icon: CheckCircle },
  ]

  return (
    <div className="page">
      <div className="page-container">

        <FadeInSection>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h1 className="heading-xl">Admin Dashboard</h1>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to="/admin/disputes"
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem' }}
              >
                <AlertTriangle size={14} />
                Disputes
              </Link>
            </motion.div>
          </div>
          <p className="text-body" style={{ marginBottom: '2rem' }}>Platform overview and management</p>
        </FadeInSection>

        {/* Tabs */}
        <div className="tabs">
          {['stats', 'users'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab ${tab === t ? 'tab--active' : ''}`}
            >
              {t === 'stats' ? 'Overview' : 'Manage Users'}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && stats && (
          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1px',
              backgroundColor: 'var(--color-border-subtle)',
            }}
            className="admin-stats-grid"
          >
            {statCards.map((s, i) => {
              const Icon = s.icon
              return (
                <StaggerItem key={i}>
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      padding: '1.5rem',
                      height: '100%',
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: 'var(--color-accent)',
                        marginBottom: '0.75rem',
                      }}
                    />
                    <p
                      className="input-label"
                      style={{ marginBottom: '0.375rem' }}
                    >
                      {s.label}
                    </p>
                    <p
                      style={{
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      <AnimatedCounter value={s.value ?? 0} duration={0.8} />
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <FadeInSection>
            <div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                          {u.name}
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)' }}>
                          {u.email}
                        </td>
                        <td>
                          <span className="badge badge--accent">{u.role}</span>
                        </td>
                        <td>
                          <span className={`badge ${u.suspended ? 'badge--error' : 'badge--success'}`}>
                            {u.suspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <motion.button
                            onClick={() => handleSuspend(u._id)}
                            className="btn btn-ghost"
                            style={{
                              fontSize: '0.75rem',
                              color: u.suspended ? 'var(--color-success)' : 'var(--color-error)',
                              padding: '0.25rem 0.5rem',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {u.suspended ? 'Unsuspend' : 'Suspend'}
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '1.5rem',
                }}
              >
                <motion.button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ChevronLeft size={14} />
                  Prev
                </motion.button>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Page {page} of {totalPages}
                </span>
                <motion.button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Next
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
          </FadeInSection>
        )}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard