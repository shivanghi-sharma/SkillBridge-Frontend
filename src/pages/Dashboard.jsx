import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const paymentColors = {
  PENDING: 'text-gray-400 bg-gray-400/10',
  PAID: 'text-blue-400 bg-blue-400/10',
  HELD: 'text-yellow-400 bg-yellow-400/10',
  RELEASED: 'text-green-400 bg-green-400/10',
  REFUNDED: 'text-purple-400 bg-purple-400/10',
  FAILED: 'text-red-400 bg-red-400/10',
  DISPUTED: 'text-orange-400 bg-orange-400/10'
}

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10'
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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-400">
            {user?.role === 'seller' ? 'Manage your incoming bookings' : 'Track your booked sessions'}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-lg">No bookings yet</p>
            <p className="text-gray-600 text-sm mt-1">
              {user?.role === 'buyer' ? 'Browse sellers and book a session' : 'Add availability slots to start receiving bookings'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                <div className="flex items-start justify-between mb-4">
                  {/* Person Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {user?.role === 'buyer'
                        ? booking.seller?.name?.charAt(0).toUpperCase()
                        : booking.buyer?.name?.charAt(0).toUpperCase()
                      }
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user?.role === 'buyer' ? booking.seller?.name : booking.buyer?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {user?.role === 'buyer' ? booking.seller?.email : booking.buyer?.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                {/* Slot Info */}
                {booking.slot && (
                  <div className="bg-gray-800 rounded-lg px-4 py-3 mb-4">
                    <p className="text-gray-400 text-xs mb-1">Session Slot</p>
                    <p className="text-white text-sm font-medium">
                      {booking.slot.day} · {booking.slot.startTime} - {booking.slot.endTime}
                    </p>
                  </div>
                )}


                {/* Payment Status */}
                {payments[booking._id] && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs">Payment:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[payments[booking._id]?.status]}`}>
                      {payments[booking._id]?.status}
                    </span>
                  </div>
                )}

                {/* Seller — mark complete (replaces old button) */}
                {user?.role === 'seller' && booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleMarkComplete(booking._id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    Mark as Completed
                  </button>
                )}

                {/* Buyer — approve or dispute after completion */}
                {user?.role === 'buyer' &&
                  booking.status === 'completed' &&
                  payments[booking._id]?.status === 'HELD' && (
                    <div className="space-y-3 mt-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRelease(booking._id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                          Approve & Release Payment
                        </button>
                        <button
                          onClick={() => setShowDispute(booking._id)}
                          className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm px-4 py-2 rounded-lg transition"
                        >
                           Raise Dispute
                        </button>
                      </div>

                      {showDispute === booking._id && (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Describe the issue..."
                            value={disputeReason[booking._id] || ''}
                            onChange={(e) => setDisputeReason({
                              ...disputeReason,
                              [booking._id]: e.target.value
                            })}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDispute(booking._id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition"
                            >
                              Submit Dispute
                            </button>
                            <button
                              onClick={() => setShowDispute(null)}
                              className="bg-gray-800 text-gray-400 text-sm px-4 py-2 rounded-lg transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <button onClick={() => navigate(`/chat/${booking._id}`)} className="mt-3 bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition" >
                    💬 Open Chat
                  </button>
                )}

                {/* Message */}
                {booking.message && (
                  <p className="text-gray-400 text-sm mb-4 italic">"{booking.message}"</p>
                )}

                {/* Seller Actions */}
                {user?.role === 'seller' && booking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(booking._id, 'confirmed')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, 'cancelled')}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {user?.role === 'seller' && booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(booking._id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    Mark as Completed
                  </button>
                )}

                {/* Buyer Actions */}
                {user?.role === 'buyer' && booking.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(booking._id, 'cancelled')}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg transition"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Leave Review */}
                {user?.role === 'buyer' && booking.status === 'completed' && !booking.reviewed && (
                  <div className="mt-4">
                    {activeReview === booking._id ? (
                      <div className="space-y-3">
                        {/* Star Rating */}
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setReviewData({
                                ...reviewData,
                                [booking._id]: { ...reviewData[booking._id], rating: star }
                              })}
                              className={`text-2xl transition ${(reviewData[booking._id]?.rating || 0) >= star
                                  ? 'text-yellow-400'
                                  : 'text-gray-600'
                                }`}
                            >
                              ★
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
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => submitReview(booking._id, booking.seller?._id)}
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button
                            onClick={() => setActiveReview(null)}
                            className="bg-gray-800 text-gray-400 text-sm px-4 py-2 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReview(booking._id)}
                        className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm px-4 py-2 rounded-lg transition"
                      >
                        ★ Leave a Review
                      </button>
                    )}
                  </div>
                )}

                {booking.reviewed && (
                  <p className="text-green-400 text-sm mt-4">✓ Review submitted</p>
                )}

              </div>
            ))}
          </div>
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