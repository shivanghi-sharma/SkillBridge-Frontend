import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Check,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Inbox,
} from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  motion,
} from '../components/motion'

const paymentColors = {
  PENDING: 'badge--neutral',
  PAID: 'badge--info',
  HELD: 'badge--warning',
  RELEASED: 'badge--success',
  REFUNDED: 'badge--accent',
  FAILED: 'badge--error',
  DISPUTED: 'badge--warning'
}

const statusConfig = {
  pending: { className: 'badge--warning', label: 'Pending' },
  confirmed: { className: 'badge--info', label: 'Confirmed' },
  completed: { className: 'badge--success', label: 'Completed' },
  cancelled: { className: 'badge--error', label: 'Cancelled' },
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewData, setReviewData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [activeReview, setActiveReview] = useState(null)
  const [payments, setPayments] = useState({})
  const [disputeReason, setDisputeReason] = useState({})
  const [showDispute, setShowDispute] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my')
        setBookings(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  useEffect(() => {
    const fetchPayments = async () => {
      const paymentMap = {}
      for (const booking of bookings) {
        try {
          const res = await api.get(`/payments/booking/${booking._id}`)
          paymentMap[booking._id] = res.data
        } catch (err) {
          // no payment yet for this booking
        }
      }
      setPayments(paymentMap)
    }
    if (bookings.length > 0) fetchPayments()
  }, [bookings])

  //Calls PUT /bookings/:id with a new status
  //Updates that one booking in state without reloading the page

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await api.put(`/bookings/${bookingId}`, { status })
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: res.data.booking.status } : b))
    } catch (err) {
      console.error(err)
    }
  }

  const handleRelease = async (bookingId) => {
    try {
      await api.post('/payments/release', { bookingId })
      setPayments({
        ...payments,
        [bookingId]: { ...payments[bookingId], status: 'RELEASED' }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDispute = async (bookingId) => {
    try {
      await api.post('/payments/dispute', {
        bookingId,
        reason: disputeReason[bookingId]
      })
      setPayments({
        ...payments,
        [bookingId]: { ...payments[bookingId], status: 'DISPUTED' }
      })
      setShowDispute(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkComplete = async (bookingId) => {
    try {
      await api.post('/payments/complete', { bookingId })
      updateStatus(bookingId, 'completed')
    } catch (err) {
      console.error(err)
    }
  }


  //Calls POST /reviews with bookingId, rating, comment
  //On success → closes the form, marks booking as reviewed: true locally

  const submitReview = async (bookingId, sellerId) => {
    setSubmitting(true)
    try {
      await api.post('/reviews', {
        bookingId,
        rating: reviewData[bookingId]?.rating || 5,
        comment: reviewData[bookingId]?.comment || ''
      })
      setActiveReview(null)
      // Mark locally so button disappears
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, reviewed: true } : b))
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Skeleton loading state
  if (loading) return (
    <div className="page">
      <div className="page-container page-container--mid">
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="skeleton" style={{ width: 200, height: 32, marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ width: 300, height: 16 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                <div>
                  <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: 100, height: 10 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '60%', height: 32, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: 120, height: 28 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-container page-container--mid">

        {/* Header */}
        <FadeInSection>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="heading-xl" style={{ marginBottom: '0.5rem' }}>
              Dashboard
            </h1>
            <p className="text-body">
              {user?.role === 'seller' ? 'Manage your incoming bookings' : 'Track your booked sessions'}
            </p>
          </div>
        </FadeInSection>

        {bookings.length === 0 ? (
          <FadeInSection>
            <div className="card">
              <div className="empty-state">
                <Inbox size={40} className="empty-state__icon" />
                <p className="empty-state__title">No bookings yet</p>
                <p className="empty-state__text">
                  {user?.role === 'buyer' ? 'Browse sellers and book a session' : 'Update your profile to start receiving bookings'}
                </p>
              </div>
            </div>
          </FadeInSection>
        ) : (
          <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map(booking => {
              const status = statusConfig[booking.status] || statusConfig.pending
              return (
                <StaggerItem key={booking._id}>
                  <div className="card">

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                      }}
                    >
                      {/* Person Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar avatar--md">
                          {user?.role === 'buyer'
                            ? booking.seller?.name?.charAt(0).toUpperCase()
                            : booking.buyer?.name?.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                              marginBottom: '0.125rem',
                            }}
                          >
                            {user?.role === 'buyer' ? booking.seller?.name : booking.buyer?.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {user?.role === 'buyer' ? booking.seller?.email : booking.buyer?.email}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`badge ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Booking Date & Time Info */}
                    {(booking.bookingDate || booking.bookingTime) && (
                      <div
                        style={{
                          backgroundColor: 'var(--color-surface-raised)',
                          padding: '0.75rem 1rem',
                          marginBottom: '1rem',
                          borderLeft: '3px solid var(--color-border)',
                        }}
                      >
                        <p className="input-label" style={{ marginBottom: '0.25rem' }}>Session Scheduled</p>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {booking.bookingDate} &middot; {booking.bookingTime} ({booking.duration || 60} mins)
                        </p>
                      </div>
                    )}


                    {/* Payment Status */}
                    {payments[booking._id] && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                          Payment
                        </span>
                        <span className={`badge ${paymentColors[payments[booking._id]?.status] || 'badge--neutral'}`}>
                          {payments[booking._id]?.status}
                        </span>
                      </div>
                    )}

                    {/* Seller — mark complete (replaces old button) */}
                    {user?.role === 'seller' && booking.status === 'confirmed' && (
                      <motion.button
                        onClick={() => handleMarkComplete(booking._id)}
                        className="btn btn-success"
                        style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <CheckCircle size={14} />
                        Mark as Completed
                      </motion.button>
                    )}

                    {/* Buyer — approve or dispute after completion */}
                    {user?.role === 'buyer' &&
                      booking.status === 'completed' &&
                      payments[booking._id]?.status === 'HELD' && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <motion.button
                              onClick={() => handleRelease(booking._id)}
                              className="btn btn-success"
                              style={{ fontSize: '0.8125rem' }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                              <Check size={14} />
                              Approve and Release
                            </motion.button>
                            <motion.button
                              onClick={() => setShowDispute(booking._id)}
                              className="btn btn-danger"
                              style={{ fontSize: '0.8125rem' }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                              <AlertTriangle size={14} />
                              Raise Dispute
                            </motion.button>
                          </div>

                          {showDispute === booking._id && (
                            <div>
                              <textarea
                                rows={2}
                                placeholder="Describe the issue..."
                                value={disputeReason[booking._id] || ''}
                                onChange={(e) => setDisputeReason({
                                  ...disputeReason,
                                  [booking._id]: e.target.value
                                })}
                                className="input-field input-field--boxed"
                                style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}
                              />
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <motion.button
                                  onClick={() => handleDispute(booking._id)}
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.8125rem' }}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  Submit Dispute
                                </motion.button>
                                <motion.button
                                  onClick={() => setShowDispute(null)}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '0.8125rem' }}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  Cancel
                                </motion.button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                    {(booking.status === 'confirmed' || booking.status === 'completed') && (
                      <motion.button
                        onClick={() => navigate(`/chat/${booking._id}`)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <MessageSquare size={14} />
                        Open Chat
                      </motion.button>
                    )}

                    {/* Message */}
                    {booking.message && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-muted)',
                          fontStyle: 'italic',
                          marginBottom: '0.75rem',
                          paddingLeft: '0.75rem',
                          borderLeft: '2px solid var(--color-border)',
                        }}
                      >
                        "{booking.message}"
                      </p>
                    )}

                    {/* Seller Actions */}
                    {user?.role === 'seller' && booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          onClick={() => updateStatus(booking._id, 'confirmed')}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8125rem' }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <Check size={14} />
                          Confirm
                        </motion.button>
                        <motion.button
                          onClick={() => updateStatus(booking._id, 'cancelled')}
                          className="btn btn-danger"
                          style={{ fontSize: '0.8125rem' }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <XCircle size={14} />
                          Cancel
                        </motion.button>
                      </div>
                    )}

                    {user?.role === 'seller' && booking.status === 'confirmed' && (
                      <motion.button
                        onClick={() => updateStatus(booking._id, 'completed')}
                        className="btn btn-success"
                        style={{ fontSize: '0.8125rem' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <CheckCircle size={14} />
                        Mark as Completed
                      </motion.button>
                    )}

                    {/* Buyer Actions */}
                    {user?.role === 'buyer' && booking.status === 'pending' && (
                      <motion.button
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8125rem' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <XCircle size={14} />
                        Cancel Booking
                      </motion.button>
                    )}

                    {/* Leave Review */}
                    {user?.role === 'buyer' && booking.status === 'completed' && !booking.reviewed && (
                      <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                        {activeReview === booking._id ? (
                          <div>
                            {/* Star Rating */}
                            <div className="star-rating" style={{ marginBottom: '0.75rem' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => setReviewData({
                                    ...reviewData,
                                    [booking._id]: { ...reviewData[booking._id], rating: star }
                                  })}
                                  className={`star-rating__star ${
                                    (reviewData[booking._id]?.rating || 0) >= star
                                      ? 'star-rating__star--filled'
                                      : ''
                                  }`}
                                >
                                  <Star
                                    size={20}
                                    fill={(reviewData[booking._id]?.rating || 0) >= star ? 'currentColor' : 'none'}
                                  />
                                </button>
                              ))}
                            </div>
                            <textarea
                              rows={2}
                              placeholder="Write a review..."
                              value={reviewData[booking._id]?.comment || ''}
                              onChange={(e) => setReviewData({
                                ...reviewData,
                                [booking._id]: { ...reviewData[booking._id], comment: e.target.value }
                              })}
                              className="input-field input-field--boxed"
                              style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <motion.button
                                onClick={() => submitReview(booking._id, booking.seller?._id)}
                                disabled={submitting}
                                className="btn btn-primary"
                                style={{ fontSize: '0.8125rem' }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                              </motion.button>
                              <motion.button
                                onClick={() => setActiveReview(null)}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.8125rem' }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                Cancel
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <motion.button
                            onClick={() => setActiveReview(booking._id)}
                            className="btn btn-ghost"
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--color-warning)',
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Star size={14} />
                            Leave a Review
                          </motion.button>
                        )}
                      </div>
                    )}

                    {booking.reviewed && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-success)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginTop: '0.75rem',
                        }}
                      >
                        <Check size={14} />
                        Review submitted
                      </p>
                    )}

                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  )
}

export default Dashboard

//EACH BOOKING Card SHOWS -

// [ Avatar initial ]  Seller/Buyer Name        [ Status Badge ]
//                     email

// [ Session Slot box ]  Monday · 10:00 - 11:00

// "Optional message from buyer"

// [ Action Buttons based on role + status ]




//REVIEW FLOW STEP BY STEP  -

// Booking is "completed" + not yet reviewed
//          ↓
// Buyer sees ★ "Leave a Review" button
//          ↓
// Clicks it → activeReview = booking._id (opens THIS booking's form)
//          ↓
// Buyer picks stars + writes a comment
// (saved in reviewData[booking._id])
//          ↓
// Clicks "Submit Review"
//          ↓
// POST /reviews is called
//          ↓
// Form closes, booking.reviewed = true
// "✓ Review submitted" text appears