import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { openRazorpayCheckout } from '../utils/razorpay'
import api from '../api/axios'
import { Star, Calendar, Send, Loader2, FileText } from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  MotionButton,
} from '../components/motion'

const SellerProfile = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [seller, setSeller] = useState(null)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [reviews, setReviews] = useState([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState('')
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sellerRes, reviewsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/reviews/${id}`)
        ])
        setSeller(sellerRes.data)
        setReviews(reviewsRes.data.reviews)
        setAverage(reviewsRes.data.average)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) return setError('Please select a date and time')
    setBookingLoading(true)
    setError('')
    setSuccess('')

    try {
      const bookingRes = await api.post('/bookings', {
        sellerId: id,
        bookingDate,
        bookingTime,
        message: bookingMessage
      })

      const bookingId = bookingRes.data.booking._id
      const orderRes = await api.post('/payments/create-order', { bookingId })
      const { orderId, amount, currency } = orderRes.data

      setBookingLoading(false)

      openRazorpayCheckout({
        orderId,
        amount,
        currency,
        name: user?.name,
        description: `Session with ${seller.name}`,
        onSuccess: async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
          try {
            setPaymentLoading(true)
            await api.post('/payments/verify', {
              razorpayOrderId,
              razorpayPaymentId,
              razorpaySignature,
              bookingId
            })
            setPaymentSuccess('Payment successful! Your session is confirmed.')
            setBookingDate('')
            setBookingTime('')
            setBookingMessage('')
          } catch (err) {
            setPaymentError('Payment verification failed. Contact support.')
          } finally {
            setPaymentLoading(false)
          }
        },
        onFailure: (msg) => {
          setError(msg || 'Payment failed')
        }
      })

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setBookingLoading(false)
    }
  }

  // ─── Skeleton Loading State ───
  if (loading) return (
    <div className="page">
      <div className="page-container page-container--mid">
        {/* Hero skeleton */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border-subtle)',
            padding: '2.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: 200, height: 24, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: 100, height: 14 }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ width: 70, height: 24 }} />
            ))}
          </div>
        </div>
        {/* Cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="seller-detail-grid">
          <div className="card">
            <div className="skeleton" style={{ width: 160, height: 20, marginBottom: '1.25rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 60 }} />
              ))}
            </div>
          </div>
          <div className="card">
            <div className="skeleton" style={{ width: 120, height: 20, marginBottom: '1.25rem' }} />
            {[1, 2].map(i => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '60%', height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .seller-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )

  if (!seller) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>Seller not found</p>
    </div>
  )

  const totalAmount = seller ? Math.max(1, Math.round((seller.hourlyRate || 0) * ((seller.sessionDuration || 60) / 60))) : 0;

  return (
    <div className="page">
      <div className="page-container page-container--mid">

        {/* Seller Hero */}
        <FadeInSection>
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border-subtle)',
              padding: '2.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div
                className="avatar avatar--lg"
                style={{ border: '2px solid var(--color-accent)' }}
              >
                {seller.avatar ? (
                  <img src={seller.avatar} alt={seller.name} />
                ) : (
                  seller.name.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.375rem',
                  }}
                >
                  {seller.name}
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  {seller.email}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Star size={14} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      <AnimatedCounter value={average} duration={0.8} />
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      (<AnimatedCounter value={reviews.length} duration={0.6} /> reviews)
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-accent)',
                    }}
                  >
                    {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate not set'}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {seller.bio || 'No bio yet'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: seller.portfolio ? '1rem' : '0' }}>
              {seller.skills.map((skill, i) => (
                <span key={i} className="tag">{skill}</span>
              ))}
            </div>
            
            {seller.portfolio && (
              <a
                href={seller.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none'
                }}
              >
                <FileText size={14} style={{ color: 'var(--color-accent)' }} />
                View Portfolio / Resume
              </a>
            )}
          </div>
        </FadeInSection>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
          }}
          className="seller-detail-grid"
        >

          {/* Booking Section — only show to buyers */}
          {user?.role === 'buyer' && (
            <FadeInSection delay={0.1}>
              <div className="card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
                  <h2 className="heading-md">Book a Session</h2>
                </div>

                {success && <div className="alert alert--success">{success}</div>}
                {error && <div className="alert alert--error">{error}</div>}
                {paymentSuccess && <div className="alert alert--success">{paymentSuccess}</div>}
                {paymentError && <div className="alert alert--error">{paymentError}</div>}
                {paymentLoading && (
                  <div
                    className="alert alert--info"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Loader2 size={14} className="animate-spin-slow" />
                    Verifying payment...
                  </div>
                )}

                    <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '0.75rem', border: '1px solid var(--color-border-subtle)' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        Session Duration
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {seller?.sessionDuration || 60} minutes
                      </p>
                    </div>

                    <p className="input-label" style={{ marginBottom: '0.75rem' }}>Select Date & Time</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <input 
                        type="date" 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)} 
                        className="input-field input-field--boxed" 
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <input 
                        type="time" 
                        value={bookingTime} 
                        onChange={(e) => setBookingTime(e.target.value)} 
                        className="input-field input-field--boxed" 
                      />
                    </div>

                    <div className="input-group">
                      <textarea
                        rows={3}
                        placeholder="Add a message to the seller (optional)"
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        className="input-field input-field--boxed"
                        style={{ fontSize: '0.8125rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '0.75rem', border: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Total Amount</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>₹{totalAmount}</span>
                    </div>

                    <MotionButton
                      onClick={handleBooking}
                      disabled={bookingLoading || !bookingDate || !bookingTime}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      hoverScale={1.04}
                      tapScale={0.97}
                    >
                      {bookingLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="spinner spinner--sm" />
                          Booking...
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Send size={14} />
                          Confirm Booking
                        </span>
                      )}
                    </MotionButton>
              </div>
            </FadeInSection>
          )}

          {/* Reviews Section */}
          <FadeInSection delay={0.15} style={{ gridColumn: user?.role !== 'buyer' ? 'span 2' : undefined }}>
            <div className="card" style={{ gridColumn: user?.role !== 'buyer' ? 'span 2' : undefined }}>
              <h2 className="heading-md" style={{ marginBottom: '1.25rem' }}>
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {reviews.length === 0 ? (
                <p className="text-caption">No reviews yet</p>
              ) : (
                <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map(review => (
                    <StaggerItem key={review._id}>
                      <div
                        style={{
                          borderBottom: '1px solid var(--color-border-subtle)',
                          paddingBottom: '1rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <div className="avatar avatar--sm">
                            {review.reviewer.name.charAt(0).toUpperCase()}
                          </div>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {review.reviewer.name}
                          </span>
                          <div
                            style={{
                              marginLeft: 'auto',
                              display: 'flex',
                              gap: '0.125rem',
                            }}
                          >
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill="var(--color-warning)"
                                style={{ color: 'var(--color-warning)' }}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                          {review.comment}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </FadeInSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .seller-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .seller-detail-grid > .card {
            grid-column: span 1 !important;
          }
          .slot-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default SellerProfile