import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

// Debounce hook
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const Browse = () => {
  const navigate = useNavigate()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(false)

  // Filter states
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')

  // Debounce search input — waits 500ms after user stops typing
  const debouncedSearch = useDebounce(search, 500)

  // Fetch sellers whenever filters change
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (debouncedSearch) params.append('skills', debouncedSearch)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        if (minRating) params.append('minRating', minRating)

        const res = await api.get(`/users/search?${params.toString()}`)
        setSellers(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [debouncedSearch, minPrice, maxPrice, minRating])

  const clearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Browse Skills</h1>
          <p className="text-gray-400">Find the right person for your next session</p>
        </div>

        <div className="flex gap-6">

          {/* Filter Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5 sticky top-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-blue-400 text-xs hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Skill Search */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block">
                  Search by skill
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Design"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block">
                  Price range (₹/hr)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block">
                  Minimum rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setMinRating(minRating == star ? '' : star)}
                      className={`text-xl transition ${
                        minRating >= star ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sellers Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-800" />
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-800 rounded" />
                        <div className="w-24 h-3 bg-gray-800 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded mb-2" />
                    <div className="w-3/4 h-3 bg-gray-800 rounded" />
                  </div>
                ))}
              </div>
            ) : sellers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-400 text-lg mb-2">No sellers found</p>
                <p className="text-gray-600 text-sm">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-400 text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellers.map(seller => (
                  <div
                    key={seller._id}
                    onClick={() => navigate(`/sellers/${seller._id}`)}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                        {seller.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{seller.name}</h3>
                        <p className="text-gray-400 text-xs">{seller.email}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {seller.bio || 'No bio yet'}
                    </p>

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

                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">
                        {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate not set'}
                      </span>
                      <span className="text-blue-400 text-sm">View Profile →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Browse