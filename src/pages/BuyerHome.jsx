import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// ─── Category chip colours ────────────────────────────────────────────────────
const TAG_COLORS = [
  'hsl(220,80%,65%)', 'hsl(270,70%,65%)', 'hsl(160,60%,50%)',
  'hsl(330,70%,65%)', 'hsl(35,90%,60%)',  'hsl(190,70%,55%)',
]
const tagColor = (i) => TAG_COLORS[i % TAG_COLORS.length]

// ─── Static category filters ─────────────────────────────────────────────────
const CATEGORIES = ['All', 'Design', 'Development', 'Marketing', 'Writing', 'Video', 'Finance']

// ─── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="sb-card sb-skeleton-card">
    <div className="sb-sk-avatar" />
    <div className="sb-sk-line sb-sk-name" />
    <div className="sb-sk-line sb-sk-bio" />
    <div className="sb-sk-line sb-sk-bio" style={{ width: '60%' }} />
    <div className="sb-sk-tags">
      <div className="sb-sk-tag" />
      <div className="sb-sk-tag" />
      <div className="sb-sk-tag" />
    </div>
  </div>
)

// ─── Single seller card ───────────────────────────────────────────────────────
const SellerCard = ({ seller, index }) => {
  const initials = seller.name?.slice(0, 2).toUpperCase() || '??'
  const hue = (index * 47 + 200) % 360

  return (
    <div className="sb-card" style={{ '--card-delay': `${index * 60}ms` }}>
      {/* Avatar */}
      <div
        className="sb-avatar"
        style={{ background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${hue + 40},80%,45%))` }}
      >
        {seller.avatar
          ? <img src={seller.avatar} alt={seller.name} className="sb-avatar-img" />
          : <span>{initials}</span>}
      </div>

      {/* Info */}
      <h3 className="sb-card-name">{seller.name}</h3>
      <p className="sb-card-bio">{seller.bio?.[0] || seller.bio || 'Available for hire'}</p>

      {/* Skills */}
      {seller.skills?.length > 0 && (
        <div className="sb-tags">
          {seller.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="sb-tag" style={{ '--tag-color': tagColor(i) }}>
              {skill}
            </span>
          ))}
          {seller.skills.length > 4 && (
            <span className="sb-tag sb-tag-more">+{seller.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Rate + CTA */}
      <div className="sb-card-footer">
        <span className="sb-rate">
          {seller.hourlyRate ? `₹${seller.hourlyRate}/hr` : 'Rate on request'}
        </span>
        <button className="sb-btn-hire">View Profile</button>
      </div>
    </div>
  )
}

// ─── Main BuyerHome page ──────────────────────────────────────────────────────
const BuyerHome = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Fetch sellers
  useEffect(() => {
    api.get('/users/sellers')
      .then(res => setSellers(res.data))
      .catch(() => setError('Failed to load sellers. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Filter sellers by search + category
  const filtered = sellers.filter(s => {
    const q = search.toLowerCase()
    const matchSearch =
      s.name?.toLowerCase().includes(q) ||
      s.bio?.toString().toLowerCase().includes(q) ||
      s.skills?.some(sk => sk.toLowerCase().includes(q))

    const matchCategory =
      activeCategory === 'All' ||
      s.skills?.some(sk => sk.toLowerCase().includes(activeCategory.toLowerCase()))

    return matchSearch && matchCategory
  })

  const initials = user?.name?.slice(0, 2).toUpperCase() || '?'

  return (
    <>
      <style>{`
        /* ── Reset & Base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: hsl(225,25%,7%); }

        /* ── Page wrapper ── */
        .sb-page {
          min-height: 100vh;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, hsl(230,70%,20%), hsl(225,25%,7%));
          font-family: 'Inter', system-ui, sans-serif;
          color: #e2e8f0;
        }

        /* ── Navbar ── */
        .sb-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: rgba(15,17,27,0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .sb-nav-logo {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(90deg, hsl(220,90%,65%), hsl(270,80%,70%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .sb-nav-right { display: flex; align-items: center; gap: 1rem; }

        /* ── Profile dropdown ── */
        .sb-profile-wrap { position: relative; }
        .sb-profile-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          background: linear-gradient(135deg, hsl(220,80%,55%), hsl(270,70%,55%));
          color: #fff;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, transform 0.15s;
        }
        .sb-profile-btn:hover { border-color: hsl(220,80%,65%); transform: scale(1.05); }
        .sb-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 200px;
          background: hsl(225,25%,12%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
        .sb-dropdown-header {
          padding: 0.6rem 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 0.4rem;
        }
        .sb-dropdown-name { font-size: 0.85rem; font-weight: 600; color: #f1f5f9; }
        .sb-dropdown-email { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; word-break: break-all; }
        .sb-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.55rem 0.75rem;
          border-radius: 9px;
          border: none;
          background: none;
          color: #cbd5e1;
          font-size: 0.83rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .sb-dropdown-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sb-dropdown-item.danger { color: #f87171; }
        .sb-dropdown-item.danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

        /* ── Hero ── */
        .sb-hero {
          text-align: center;
          padding: 4rem 1.5rem 2.5rem;
        }
        .sb-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 999px;
          padding: 0.3rem 0.9rem;
          font-size: 0.75rem;
          color: hsl(235,80%,75%);
          font-weight: 500;
          margin-bottom: 1.25rem;
        }
        .sb-hero h1 {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 0.9rem;
          color: #f8fafc;
        }
        .sb-hero h1 span {
          background: linear-gradient(90deg, hsl(220,90%,65%), hsl(290,80%,70%), hsl(330,80%,65%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sb-hero p {
          color: #94a3b8;
          font-size: 1rem;
          max-width: 480px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        /* ── Search bar ── */
        .sb-search-wrap {
          position: relative;
          max-width: 560px;
          margin: 0 auto;
        }
        .sb-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
          font-size: 1.1rem;
        }
        .sb-search {
          width: 100%;
          padding: 0.9rem 1.2rem 0.9rem 3rem;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .sb-search::placeholder { color: #64748b; }
        .sb-search:focus {
          border-color: hsl(220,80%,60%);
          background: rgba(255,255,255,0.09);
          box-shadow: 0 0 0 4px hsl(220,80%,60%,0.12);
        }

        /* ── Categories ── */
        .sb-cats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          padding: 1.5rem 1.5rem 0;
          max-width: 860px;
          margin: 0 auto;
        }
        .sb-cat {
          padding: 0.4rem 1rem;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
        }
        .sb-cat:hover { border-color: rgba(255,255,255,0.25); color: #e2e8f0; }
        .sb-cat.active {
          background: hsl(220,80%,55%);
          border-color: hsl(220,80%,55%);
          color: #fff;
          box-shadow: 0 0 16px hsl(220,80%,55%,0.4);
        }

        /* ── Section header ── */
        .sb-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .sb-section-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; }
        .sb-count { font-size: 0.8rem; color: #64748b; }

        /* ── Grid ── */
        .sb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          padding: 0 2rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Cards ── */
        .sb-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          animation: cardIn 0.4s ease both;
          animation-delay: var(--card-delay, 0ms);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sb-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
          border-color: rgba(255,255,255,0.15);
        }

        /* ── Card avatar ── */
        .sb-avatar {
          width: 56px; height: 56px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem;
          color: #fff;
          margin-bottom: 0.4rem;
          flex-shrink: 0;
        }
        .sb-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        /* ── Card text ── */
        .sb-card-name { font-size: 1rem; font-weight: 700; color: #f1f5f9; }
        .sb-card-bio {
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Tags ── */
        .sb-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem; }
        .sb-tag {
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          background: color-mix(in srgb, var(--tag-color) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--tag-color) 35%, transparent);
          color: var(--tag-color);
          font-size: 0.72rem;
          font-weight: 500;
        }
        .sb-tag-more { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #94a3b8; }

        /* ── Card footer ── */
        .sb-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sb-rate { font-size: 0.9rem; font-weight: 700; color: hsl(145,60%,55%); }
        .sb-btn-hire {
          padding: 0.4rem 1rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, hsl(220,80%,55%), hsl(260,75%,60%));
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .sb-btn-hire:hover { opacity: 0.88; transform: scale(1.04); }

        /* ── Skeleton ── */
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .sb-skeleton-card { pointer-events: none; }
        .sb-sk-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
        }
        .sb-sk-line {
          height: 12px; border-radius: 6px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
        }
        .sb-sk-name { width: 55%; height: 14px; }
        .sb-sk-bio { width: 85%; }
        .sb-sk-tags { display: flex; gap: 0.5rem; margin-top: 0.4rem; }
        .sb-sk-tag {
          width: 60px; height: 22px; border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
        }

        /* ── Empty / Error states ── */
        .sb-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: #64748b;
        }
        .sb-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .sb-empty h3 { font-size: 1.1rem; color: #94a3b8; margin-bottom: 0.5rem; }
        .sb-error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
          border-radius: 12px;
          padding: 0.9rem 1.25rem;
          font-size: 0.85rem;
          max-width: 480px;
          margin: 1.5rem auto;
          text-align: center;
        }
      `}</style>

      <div className="sb-page">

        {/* ── Navbar ── */}
        <nav className="sb-nav">
          <span className="sb-nav-logo">⚡ SkillBridge</span>

          <div className="sb-nav-right">
            <div className="sb-profile-wrap" ref={profileRef}>
              <button
                id="profile-menu-btn"
                className="sb-profile-btn"
                onClick={() => setProfileOpen(o => !o)}
                aria-label="Profile menu"
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="sb-dropdown" id="profile-dropdown">
                  <div className="sb-dropdown-header">
                    <div className="sb-dropdown-name">{user?.name}</div>
                    <div className="sb-dropdown-email">{user?.email}</div>
                  </div>
                  <Link to="/profile" className="sb-dropdown-item" onClick={() => setProfileOpen(false)}>
                    👤 My Profile
                  </Link>
                  <button className="sb-dropdown-item danger" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="sb-hero">
          <div className="sb-hero-badge">✨ Find top freelance talent</div>
          <h1>Hire skilled <span>professionals</span><br />for any project</h1>
          <p>Browse hundreds of expert sellers across design, development, writing and more.</p>

          {/* Search */}
          <div className="sb-search-wrap">
            <span className="sb-search-icon">🔍</span>
            <input
              id="seller-search"
              className="sb-search"
              type="text"
              placeholder="Search by name, skill or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </section>

        {/* ── Category filters ── */}
        <div className="sb-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`sb-cat${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Error banner ── */}
        {error && <div className="sb-error-banner">{error}</div>}

        {/* ── Section header ── */}
        {!error && (
          <div className="sb-section-header">
            <span className="sb-section-title">
              {search || activeCategory !== 'All' ? 'Search Results' : 'Available Sellers'}
            </span>
            <span className="sb-count">
              {loading ? 'Loading…' : `${filtered.length} seller${filtered.length !== 1 ? 's' : ''} found`}
            </span>
          </div>
        )}

        {/* ── Cards grid ── */}
        <div className="sb-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
              ? filtered.map((seller, i) => <SellerCard key={seller._id} seller={seller} index={i} />)
              : !error && (
                <div className="sb-empty">
                  <div className="sb-empty-icon">🔭</div>
                  <h3>No sellers found</h3>
                  <p>Try a different search term or category</p>
                </div>
              )
          }
        </div>
      </div>
    </>
  )
}

export default BuyerHome
