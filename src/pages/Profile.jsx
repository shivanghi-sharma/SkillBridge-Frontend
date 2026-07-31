import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { LogOut, Pencil, Plus, Trash2, Clock, X } from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  MotionButton,
  motion,
} from '../components/motion'

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
    skills: user?.skills?.join(', ') || '',
    hourlyRate: user?.hourlyRate || '',
    sessionDuration: user?.sessionDuration || 60
  })
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert skills string "React, Node, CSS" → ["React", "Node", "CSS"]
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      }

      const res = await api.put('/users/profile', updatedData)
      setUser(res.data.user)
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setUploading(true)
    try {
      const res = await api.post('/users/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUser(res.data.user)
      toast.success('Profile photo updated!')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="page">
      <div className="page-container page-container--narrow">

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
          }}
        >
          <h1 className="heading-lg">My Profile</h1>
          <MotionButton
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--color-text-muted)',
            }}
            hoverScale={1.04}
            tapScale={0.96}
          >
            <LogOut size={14} />
            Logout
          </MotionButton>
        </div>

        {/* Profile Card */}
        <FadeInSection>
        <div className="card" style={{ marginBottom: '1.5rem' }}>

          {/* Avatar + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div
                className="avatar avatar--lg"
                style={{
                  border: '2px solid var(--color-accent)',
                  width: 80,
                  height: 80,
                  fontSize: '2rem'
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {user?.name}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  {user?.email}
                </p>
                <span className="badge badge--accent">{user?.role}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <label
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer', fontSize: '0.8125rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                >
                  {uploading ? <span className="spinner spinner--sm" /> : <Pencil size={14} />}
                  {uploading ? 'Uploading...' : 'Change Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {user?.role === 'seller' && (
                  <label
                    className="btn btn-ghost"
                    style={{ cursor: 'pointer', fontSize: '0.8125rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', border: '1px dashed var(--color-border)' }}
                  >
                    <Plus size={14} /> Upload Portfolio
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        const fd = new FormData()
                        fd.append('portfolio', file)
                        try {
                          const res = await api.post('/users/upload/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' }})
                          setUser(res.data.user)
                          toast.success('Portfolio uploaded!')
                        } catch(err) {
                          toast.error('Portfolio upload failed')
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
                {user?.portfolio && (
                  <a href={user.portfolio} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none', alignSelf: 'center' }}>
                    View current portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* View Mode */}
          {!editing ? (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="input-label" style={{ marginBottom: '0.375rem' }}>Bio</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                  {user?.bio || 'No bio yet'}
                </p>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="input-label" style={{ marginBottom: '0.5rem' }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                    <span key={i} className="tag">{skill}</span>
                  )) : (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      No skills added yet
                    </p>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p className="input-label" style={{ marginBottom: '0.375rem' }}>Hourly Rate</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                  {user?.hourlyRate ? `₹${user.hourlyRate}/hr` : 'Not set'}
                </p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p className="input-label" style={{ marginBottom: '0.375rem' }}>Session Duration</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                  {user?.sessionDuration ? `${user.sessionDuration} minutes` : '60 minutes'}
                </p>
              </div>

              <MotionButton
                onClick={() => setEditing(true)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
                hoverScale={1.03}
                tapScale={0.97}
              >
                <Pencil size={14} />
                Edit Profile
              </MotionButton>
            </div>

          ) : (

            /* Edit Mode */
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell people about yourself..."
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  Skills <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', letterSpacing: 'normal' }}>(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Design"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Hourly Rate (INR)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="500"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Session Duration (minutes)</label>
                <input
                  type="number"
                  name="sessionDuration"
                  value={formData.sessionDuration || 60}
                  onChange={handleChange}
                  placeholder="60"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <MotionButton
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  hoverScale={1.03}
                  tapScale={0.97}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </MotionButton>
                <MotionButton
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-secondary"
                  hoverScale={1.03}
                  tapScale={0.97}
                >
                  Cancel
                </MotionButton>
              </div>
            </form>
          )}
        </div>
        </FadeInSection>


      </div>

      <style>{`
        .profile-avatar-wrapper:hover .profile-avatar-overlay {
          opacity: 1 !important;
        }
        @media (max-width: 640px) {
          .slot-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Profile