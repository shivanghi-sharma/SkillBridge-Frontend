import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { AlertTriangle, CheckCircle, Inbox } from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  MotionButton,
} from '../components/motion'

const AdminDisputes = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    if (user?.role !== 'admin') return navigate('/')
    api.get('/payments/disputes')
      .then(res => setDisputes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  const handleResolve = async (disputeId) => {
    try {
      await api.post('/payments/dispute/resolve', {
        disputeId,
        resolution: form[disputeId]?.resolution || 'FULL_RELEASE',
        sellerPercent: form[disputeId]?.sellerPercent || 100,
        adminNote: form[disputeId]?.adminNote || ''
      })
      setDisputes(disputes.filter(d => d._id !== disputeId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="page-container page-container--mid">
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="skeleton" style={{ width: 120, height: 32, marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ width: 280, height: 14 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2].map(i => (
            <div key={i} className="card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div className="skeleton" style={{ width: 160, height: 16, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: 120, height: 12 }} />
                </div>
                <div className="skeleton" style={{ width: 60, height: 22 }} />
              </div>
              <div className="skeleton" style={{ width: '100%', height: 56, marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: 140, height: 36 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-container page-container--mid">
        <FadeInSection>
          <h1 className="heading-xl" style={{ marginBottom: '0.5rem' }}>Disputes</h1>
          <p className="text-body" style={{ marginBottom: '2.5rem' }}>Review and resolve open payment disputes</p>
        </FadeInSection>

        {disputes.length === 0 ? (
          <FadeInSection>
            <div className="card">
              <div className="empty-state">
                <Inbox size={40} className="empty-state__icon" />
                <p className="empty-state__title">No open disputes</p>
                <p className="empty-state__text">All clear. Nothing to resolve.</p>
              </div>
            </div>
          </FadeInSection>
        ) : (
          <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {disputes.map(dispute => (
              <StaggerItem key={dispute._id}>
              <div
                className="card"
                style={{ borderLeft: '3px solid var(--color-warning)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.125rem',
                      }}
                    >
                      Dispute by {dispute.raisedBy?.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {dispute.raisedBy?.email}
                    </p>
                  </div>
                  <span className="badge badge--warning">
                    <AlertTriangle size={10} />
                    OPEN
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderLeft: '3px solid var(--color-border)',
                  }}
                >
                  <p className="input-label" style={{ marginBottom: '0.25rem' }}>Reason</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {dispute.reason}
                  </p>
                </div>

                {/* Resolution Form */}
                <div>
                  <div className="input-group">
                    <label className="input-label">Resolution</label>
                    <select
                      value={form[dispute._id]?.resolution || 'FULL_RELEASE'}
                      onChange={(e) => setForm({
                        ...form,
                        [dispute._id]: { ...form[dispute._id], resolution: e.target.value }
                      })}
                      className="input-field input-field--boxed"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      <option value="FULL_RELEASE">Full Release to Seller</option>
                      <option value="FULL_REFUND">Full Refund to Buyer</option>
                      <option value="PARTIAL">Partial Split</option>
                    </select>
                  </div>

                  {form[dispute._id]?.resolution === 'PARTIAL' && (
                    <div className="input-group">
                      <label className="input-label">Seller gets (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form[dispute._id]?.sellerPercent || 50}
                        onChange={(e) => setForm({
                          ...form,
                          [dispute._id]: { ...form[dispute._id], sellerPercent: e.target.value }
                        })}
                        className="input-field input-field--boxed"
                        style={{ fontSize: '0.8125rem', maxWidth: 120 }}
                      />
                    </div>
                  )}

                  <div className="input-group">
                    <label className="input-label">Admin note (optional)</label>
                    <input
                      type="text"
                      placeholder="Internal note..."
                      value={form[dispute._id]?.adminNote || ''}
                      onChange={(e) => setForm({
                        ...form,
                        [dispute._id]: { ...form[dispute._id], adminNote: e.target.value }
                      })}
                      className="input-field input-field--boxed"
                      style={{ fontSize: '0.8125rem' }}
                    />
                  </div>

                  <MotionButton
                    onClick={() => handleResolve(dispute._id)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8125rem' }}
                    hoverScale={1.03}
                    tapScale={0.97}
                  >
                    <CheckCircle size={14} />
                    Resolve Dispute
                  </MotionButton>
                </div>
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  )
}

export default AdminDisputes