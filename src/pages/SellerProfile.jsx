import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const SellerProfile = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [seller, setSeller] = useState(null)
  const [slots, setSlots] = useState([])
  const [reviews, setReviews] = useState([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bookingMessage, setBookingMessage] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')


//   URL has seller ID (e.g. /seller/abc123)
//         ↓
// useEffect runs → 3 API calls fire at the SAME TIME (Promise.all)
//         ↓
// GET /users/:id       → seller's name, bio, skills, rate
// GET /availability/:id → seller's open time slots
// GET /reviews/:id     → reviews + average rating

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sellerRes, slotsRes, reviewsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/availability/${id}`),
          api.get(`/reviews/${id}`)
        ])
        setSeller(sellerRes.data)
        setSlots(slotsRes.data)
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
    if (!selectedSlot) return setError('Please select a slot first')
    setBookingLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/bookings', {
        sellerId: id,
        slotId: selectedSlot,
        message: bookingMessage
      })
      setSuccess('Session booked successfully!')
      // Remove booked slot from UI
      setSlots(slots.filter(s => s._id !== selectedSlot))
      setSelectedSlot(null)
      setBookingMessage('')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!seller) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Seller not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Seller Info Card */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {seller.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{seller.name}</h1>
              <p className="text-gray-400 text-sm">{seller.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 text-sm">★ {average}</span>
                <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{seller.bio || 'No bio yet'}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {seller.skills.map((skill, i) => (
              <span key={i} className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>

          <p className="text-white font-semibold">
            {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate not set'}
          </p>
        </div>

        {/* Booking Section — only show to buyers */}
        {user?.role === 'buyer' && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-white text-xl font-semibold mb-4">Book a Session</h2>

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

            {slots.length === 0 ? (
              <p className="text-gray-400">No available slots right now</p>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-3">Select an available slot:</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {slots.map(slot => (
                    <div
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot._id)}
                      className={`p-3 rounded-lg border cursor-pointer transition text-sm
                        ${selectedSlot === slot._id
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                    >
                      <p className="font-medium">{slot.day}</p>
                      <p>{slot.startTime} - {slot.endTime}</p>
                    </div>
                  ))}
                </div>

                <textarea
                  rows={3}
                  placeholder="Add a message to the seller (optional)"
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                />

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || !selectedSlot}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white text-xl font-semibold mb-4">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="border-b border-gray-800 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {review.reviewer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">{review.reviewer.name}</span>
                    <span className="text-yellow-400 text-sm ml-auto">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SellerProfile