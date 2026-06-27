import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Browse = () => {
  const navigate = useNavigate()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get('/users/sellers')
        setSellers(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [])

  const filtered = sellers.filter(seller =>
    seller.name.toLowerCase().includes(search.toLowerCase()) ||
    seller.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading sellers...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Browse Skills</h1>
          <p className="text-gray-400">Find the right person for your next session</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-gray-800"
          />
        </div>

        {/* Sellers Grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-400">No sellers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(seller => (
              <div
                key={seller._id}
                onClick={() => navigate(`/sellers/${seller._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    {seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{seller.name}</h3>
                    <p className="text-gray-400 text-xs">{seller.email}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {seller.bio || 'No bio yet'}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {seller.skills.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{seller.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate not set'}
                  </span>
                  <span className="text-blue-400 text-sm hover:underline">
                    View Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse