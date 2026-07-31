import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Star, ArrowRight, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Filter, DollarSign, Award, User } from 'lucide-react'
import {
  StaggerContainer,
  StaggerItem,
  FadeInSection,
  motion,
} from '../components/motion'

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
  const { user } = useAuth()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(false)

  // Profile completion calculation
  const getProfileCompletion = () => {
    if (!user) return 0;
    let fields = 0;
    let completed = 0;
    
    // Core fields
    fields += 4;
    if (user.name) completed++;
    if (user.email) completed++;
    if (user.avatar) completed++;
    if (user.bio) completed++;
    
    if (user.role === 'seller') {
      fields += 2;
      if (user.skills && user.skills.length > 0) completed++;
      if (user.hourlyRate) completed++;
    }
    
    return Math.round((completed / fields) * 100);
  }
  const completionPercentage = getProfileCompletion();

  // Filter states
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Debounce search input — waits 500ms after user stops typing
  const debouncedSearch = useDebounce(search, 500)

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, minPrice, maxPrice, minRating, sortBy])

  // Fetch sellers whenever filters or page change
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (debouncedSearch) params.append('skills', debouncedSearch)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        if (minRating) params.append('minRating', minRating)
        if (sortBy) params.append('sortBy', sortBy)
        params.append('page', page)

        const res = await api.get(`/users/search?${params.toString()}`)
        setSellers(res.data.sellers || [])
        setTotalPages(res.data.totalPages || 1)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSellers()
  }, [debouncedSearch, minPrice, maxPrice, minRating, sortBy, page])

  const clearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
    setSortBy('')
    setPage(1)
  }

  const hasFilters = search || minPrice || maxPrice || minRating || sortBy

  return (
    <div className="page">
      <div className="page-container">

        {/* Header */}
        <FadeInSection>
          <div style={{ 
            marginBottom: '3rem', 
            padding: '2.5rem', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-accent-soft) 0%, rgba(15, 118, 110, 0.08) 100%)',
            border: '1px solid var(--color-accent-muted)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '2rem' 
          }}>
            <div>
              <h1 className="heading-xl" style={{ marginBottom: '0.5rem' }}>
                Browse Skills
              </h1>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                Find the right person for your next session
              </p>
            </div>
            
            {/* Header Search Bar */}
            <div style={{ flex: '1', minWidth: '320px', maxWidth: '600px', position: 'relative' }}>
              <Search
                size={22}
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-accent)',
                }}
              />
              <input
                type="text"
                placeholder="Search by skill (e.g. React, Design)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: '3.75rem',
                  paddingTop: '1.25rem',
                  paddingBottom: '1.25rem',
                  fontSize: '1.0625rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '2px solid transparent',
                  width: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-secondary)';
                  e.target.style.boxShadow = '0 0 0 4px var(--color-secondary-soft), 0 4px 20px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              />
            </div>
          </div>
        </FadeInSection>

        <div
          style={{ display: 'flex', gap: '2.5rem' }}
          className="browse-layout"
        >

          {/* Filter Sidebar */}
          <div className="browse-sidebar" style={{ width: 280, flexShrink: 0 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'sticky',
                top: '6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Welcome & Profile Completion Widget */}
              {user && (
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-border-subtle)' }}>
                    <div style={{ height: '100%', width: `${completionPercentage}%`, backgroundColor: completionPercentage === 100 ? 'var(--color-success)' : 'var(--color-accent)', transition: 'width 1s ease-in-out' }} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                    <div className="avatar avatar--md" style={{ width: 40, height: 40 }}>
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Welcome back,
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {user.name.split(' ')[0]}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Profile Setup</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>{completionPercentage}%</span>
                  </div>
                  
                  {completionPercentage < 100 && (
                    <button 
                      onClick={() => navigate('/profile')}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-accent)';
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = 'var(--color-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--color-surface-raised)';
                        e.target.style.color = 'var(--color-text-primary)';
                        e.target.style.borderColor = 'var(--color-border-subtle)';
                      }}
                    >
                      Complete your profile
                    </button>
                  )}
                </div>
              )}

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-accent-muted)',
                    color: 'var(--color-accent)'
                  }}>
                    <SlidersHorizontal size={16} />
                  </div>
                  <span className="heading-sm" style={{ margin: 0 }}>Filters</span>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-accent)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-accent-muted)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Skill Search */}
              <div className="input-group" style={{ marginBottom: '1.75rem' }}>
                <label className="input-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={14} style={{ color: 'var(--color-accent)' }} /> Search by skill
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. React, Design"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field"
                    style={{ 
                      backgroundColor: 'var(--color-surface-raised)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                      borderRadius: '12px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-accent)';
                      e.target.style.backgroundColor = 'var(--color-surface)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.backgroundColor = 'var(--color-surface-raised)';
                    }}
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="input-group" style={{ marginBottom: '1.75rem' }}>
                <label className="input-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={14} style={{ color: 'var(--color-secondary)' }} /> Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid transparent',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    width: '100%',
                    color: 'var(--color-text-primary)',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-secondary)';
                    e.target.style.backgroundColor = 'var(--color-surface)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.backgroundColor = 'var(--color-surface-raised)';
                  }}
                >
                  <option value="">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="input-group" style={{ marginBottom: '1.75rem' }}>
                <label className="input-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={14} style={{ color: 'var(--color-accent)' }} /> Price range (per hr)
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="input-field"
                      style={{ 
                        paddingLeft: '1.75rem',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid transparent',
                        borderRadius: '12px',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                  <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="input-field"
                      style={{ 
                        paddingLeft: '1.75rem',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid transparent',
                        borderRadius: '12px',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>
              </div>

              {/* Min Rating */}
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={14} style={{ color: 'var(--color-secondary)' }} /> Minimum rating
                </label>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  padding: '1rem',
                  backgroundColor: 'var(--color-surface-raised)',
                  borderRadius: '12px',
                  justifyContent: 'center'
                }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      onClick={() => setMinRating(minRating == star ? '' : star)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: minRating >= star ? 'var(--color-secondary)' : 'var(--color-border)',
                        transition: 'color 0.2s ease',
                        padding: 0
                      }}
                    >
                      <Star size={24} fill={minRating >= star ? 'var(--color-secondary)' : 'none'} />
                    </motion.button>
                  ))}
                </div>
                {minRating && (
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                    Showing {minRating} stars and above
                  </p>
                )}
              </div>
              </div>
            </motion.div>
          </div>

          {/* Sellers Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  backgroundColor: 'var(--color-border-subtle)',
                }}
                className="sellers-grid"
              >
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--color-base)',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                      <div>
                        <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 6 }} />
                        <div className="skeleton" style={{ width: 80, height: 10 }} />
                      </div>
                    </div>
                    <div className="skeleton" style={{ width: '100%', height: 12, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: '70%', height: 12 }} />
                  </div>
                ))}
              </div>
            ) : sellers.length === 0 ? (
              <div className="empty-state">
                <Search size={40} className="empty-state__icon" />
                <p className="empty-state__title">No sellers found</p>
                <p className="empty-state__text">Try adjusting your filters</p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost"
                    style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--color-accent)' }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <StaggerContainer
                key={`${debouncedSearch}-${minPrice}-${maxPrice}-${minRating}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem',
                }}
                className="sellers-grid"
              >
                {sellers.map((seller, index) => {
                  const isTeal = index % 2 === 0;
                  const accentColor = isTeal ? 'var(--color-secondary)' : 'var(--color-accent)';
                  const accentMuted = isTeal ? 'var(--color-secondary-muted)' : 'var(--color-accent-muted)';

                  return (
                    <StaggerItem key={seller._id}>
                      <motion.div
                        onClick={() => navigate(`/sellers/${seller._id}`)}
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderRadius: '16px',
                          padding: '1.75rem',
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: 'var(--shadow-sm)',
                          border: '1px solid var(--color-border-subtle)',
                          borderTop: `4px solid ${accentColor}`,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{
                          y: -6,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          borderColor: 'var(--color-border)',
                          transition: { duration: 0.2, ease: 'easeOut' },
                        }}
                      >
                        {/* Avatar + Name */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
                          <div 
                            className="avatar avatar--lg" 
                            style={{ 
                              width: 64, 
                              height: 64, 
                              flexShrink: 0,
                              background: `linear-gradient(135deg, ${accentColor}, var(--color-surface))`,
                              border: `2px solid ${accentColor}`,
                              color: 'var(--color-text-primary)'
                            }}
                          >
                            {seller.avatar ? (
                              <img src={seller.avatar} alt={seller.name} />
                            ) : (
                              seller.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h3
                                  style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '0.25rem',
                                  }}
                                >
                                  {seller.name}
                                </h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                  Professional Seller
                                </p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: accentColor, color: '#fff', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>
                                <Star size={12} fill="#fff" color="#fff" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{seller.avgRating ? seller.avgRating.toFixed(1) : 'New'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '1.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.6,
                          }}
                        >
                          {seller.bio || 'No bio provided. This seller prefers to let their skills speak for themselves.'}
                        </p>

                        {/* Skills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                          {seller.skills.slice(0, 3).map((skill, i) => (
                            <span 
                              key={i} 
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '0.375rem 0.875rem',
                                borderRadius: '9999px',
                                backgroundColor: accentMuted,
                                color: accentColor,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {seller.skills.length > 3 && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-muted)',
                                alignSelf: 'center',
                                fontWeight: 500,
                                marginLeft: '0.25rem'
                              }}
                            >
                              +{seller.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Rate + Arrow */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: '1.25rem',
                            borderTop: '1px solid var(--color-border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting at</span>
                            <span
                              style={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate not set'}
                            </span>
                          </div>
                          <motion.button
                            className="btn"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              backgroundColor: accentColor, 
                              color: '#fff', 
                              fontWeight: 600, 
                              fontSize: '0.875rem',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              border: 'none'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Profile <ArrowRight size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}

            {/* Pagination Controls */}
            {!loading && sellers.length > 0 && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3rem', gap: '1rem' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', borderRadius: '8px', minWidth: '40px' }}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={p === page ? "btn btn-primary" : "btn btn-secondary"}
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '8px',
                        minWidth: '40px',
                        fontWeight: p === page ? 700 : 500
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', borderRadius: '8px', minWidth: '40px' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .browse-layout {
            flex-direction: column !important;
          }
          .browse-sidebar {
            width: 100% !important;
          }
          .sellers-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Browse