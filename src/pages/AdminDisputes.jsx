import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading disputes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-2">Admin — Disputes</h1>
        <p className="text-gray-400 mb-8">Review and resolve open payment disputes</p>

        {disputes.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <p className="text-gray-400">No open disputes 🎉</p>
          </div>
        ) : (
          <div className="space-y-6">
            {disputes.map(dispute => (
              <div key={dispute._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">
                      Dispute by {dispute.raisedBy?.name}
                    </p>
                    <p className="text-gray-400 text-sm">{dispute.raisedBy?.email}</p>
                  </div>
                  <span className="text-xs bg-orange-400/10 text-orange-400 px-3 py-1 rounded-full">
                    OPEN
                  </span>
                </div>

                <div className="bg-gray-800 rounded-lg px-4 py-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">Reason</p>
                  <p className="text-white text-sm">{dispute.reason}</p>
                </div>

                {/* Resolution Form */}
                <div className="space-y-3">
                  <select
                    value={form[dispute._id]?.resolution || 'FULL_RELEASE'}
                    onChange={(e) => setForm({
                      ...form,
                      [dispute._id]: { ...form[dispute._id], resolution: e.target.value }
                    })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none text-sm"
                  >
                    <option value="FULL_RELEASE">Full Release to Seller</option>
                    <option value="FULL_REFUND">Full Refund to Buyer</option>
                    <option value="PARTIAL">Partial Split</option>
                  </select>

                  {form[dispute._id]?.resolution === 'PARTIAL' && (
                    <div className="flex items-center gap-3">
                      <label className="text-gray-400 text-sm">Seller gets:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form[dispute._id]?.sellerPercent || 50}
                        onChange={(e) => setForm({
                          ...form,
                          [dispute._id]: { ...form[dispute._id], sellerPercent: e.target.value }
                        })}
                        className="w-24 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none text-sm"
                      />
                      <span className="text-gray-400 text-sm">%</span>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Admin note (optional)"
                    value={form[dispute._id]?.adminNote || ''}
                    onChange={(e) => setForm({
                      ...form,
                      [dispute._id]: { ...form[dispute._id], adminNote: e.target.value }
                    })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none text-sm"
                  />

                  <button
                    onClick={() => handleResolve(dispute._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg transition"
                  >
                    Resolve Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDisputes