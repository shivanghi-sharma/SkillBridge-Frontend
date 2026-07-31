import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { Sun, Moon, Menu, X, LogOut, Shield, Layers, Bell, User as UserIcon, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Close dropdowns when clicking outside
  const userMenuRef = useRef(null)
  const notifMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { to: '/browse', label: 'Browse' },
    { to: '/dashboard', label: 'Dashboard' }
  ]

  // Hover animated link component
  const NavLink = ({ children, active, onClick, to }) => (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        transition: 'color 0.3s ease',
        textDecoration: 'none',
        display: 'inline-block'
      }}
      className="nav-link-animated"
    >
      {to ? <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>{children}</Link> : children}
      {active && (
        <span
          style={{
            position: 'absolute',
            bottom: -6,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'var(--color-accent)',
            borderRadius: 2
          }}
        />
      )}
    </div>
  )

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border-subtle)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              borderRadius: '10px',
              padding: '0.4rem',
              boxShadow: '0 4px 12px rgba(212, 118, 78, 0.3)'
            }}
          >
            <Layers size={22} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.375rem',
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
              }}
            >
              Skill
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.375rem',
                letterSpacing: '-0.02em',
                color: 'var(--color-accent)',
              }}
            >
              Bridge
            </span>
          </div>
        </Link>

        {/* Desktop Centered Navigation */}
        <div
          className="nav-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <NavLink onClick={() => scrollToSection('mission')}>Our Mission</NavLink>
          <NavLink onClick={() => scrollToSection('contact')}>Contact Us</NavLink>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} active={isActive(to)}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: Theme, Notifications, User Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <button onClick={toggleTheme} className="btn-icon nav-icon-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              {/* Notifications */}
              <div style={{ position: 'relative' }} ref={notifMenuRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="btn-icon nav-icon-btn"
                  style={{ position: 'relative' }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: 'var(--color-error)',
                        color: 'white',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--color-base)'
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="dropdown-menu" style={{ right: -10 }}>
                    <div className="dropdown-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="dropdown-action-btn">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="dropdown-body">
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className="dropdown-item-notification"
                            onClick={() => {
                              if (!n.read) markAsRead(n._id)
                              setShowNotifications(false)
                              if (n.link) navigate(n.link)
                            }}
                            style={{ backgroundColor: n.read ? 'transparent' : 'var(--color-accent-muted)' }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'var(--color-accent)', marginTop: 6, flexShrink: 0 }} />
                            <div>
                              <p>{n.message}</p>
                              <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <div
                  className="avatar avatar--md user-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    border: '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="User" />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>

                {showUserMenu && (
                  <div className="dropdown-menu" style={{ right: 0 }}>
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    
                    <div className="dropdown-links">
                      <Link to="/profile" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                        <UserIcon size={16} /> My Profile
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link to="/admin" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      
                      <div className="dropdown-divider" />
                      
                      <button onClick={handleLogout} className="dropdown-link text-danger">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary nav-desktop"
              style={{ padding: '0.625rem 1.5rem', borderRadius: '8px' }}
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="btn-icon nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            padding: '1.5rem',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/browse" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontSize: '1.125rem', fontWeight: 500 }}>Browse</Link>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text-primary)', fontSize: '1.125rem', fontWeight: 500 }}>Dashboard</Link>
            <button onClick={() => { scrollToSection('mission'); setMobileOpen(false) }} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: '1.125rem', fontWeight: 500, textAlign: 'left', padding: 0 }}>Our Mission</button>
            <button onClick={() => { scrollToSection('contact'); setMobileOpen(false) }} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: '1.125rem', fontWeight: 500, textAlign: 'left', padding: 0 }}>Contact Us</button>
          </div>

          <div className="divider" style={{ margin: '1rem 0' }} />

          {!user && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        .nav-mobile-toggle {
          display: none;
        }
        @media (max-width: 900px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: inline-flex !important;
          }
        }

        .nav-link-animated::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -6px;
          left: 50%;
          background-color: var(--color-text-secondary);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .nav-link-animated:hover::after {
          width: 100%;
          background-color: var(--color-text-primary);
        }

        .nav-link-animated:hover {
          color: var(--color-text-primary) !important;
        }

        .nav-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-subtle);
          transition: all 0.2s ease;
        }

        .nav-icon-btn:hover {
          background: var(--color-surface-overlay);
          border-color: var(--color-border);
          transform: translateY(-1px);
        }

        .user-avatar-btn:hover {
          box-shadow: 0 0 0 2px var(--color-accent-soft);
          transform: translateY(-1px);
        }

        /* Dropdown Styles */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          width: 320px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          z-index: 100;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top right;
        }

        @keyframes slide-down {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-surface-raised);
        }

        .dropdown-header h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-text-primary);
        }

        .dropdown-action-btn {
          background: none;
          border: none;
          color: var(--color-accent);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        
        .dropdown-action-btn:hover {
          color: var(--color-accent-hover);
        }

        .dropdown-body {
          overflow-y: auto;
          max-height: 380px;
        }

        .dropdown-item-notification {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border-subtle);
          cursor: pointer;
          display: flex;
          gap: 0.875rem;
          align-items: flex-start;
          transition: background-color 0.2s ease;
        }

        .dropdown-item-notification:hover {
          background-color: var(--color-surface-raised) !important;
        }

        .dropdown-item-notification p {
          font-size: 0.875rem;
          color: var(--color-text-primary);
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .dropdown-item-notification span {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        /* User Dropdown Specifics */
        .dropdown-user-info {
          padding: 1.25rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
        }

        .dropdown-user-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--color-text-primary);
          margin: 0 0 0.25rem 0;
        }

        .dropdown-user-email {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .dropdown-links {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
        }

        .dropdown-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .dropdown-link:hover {
          background-color: var(--color-surface-raised);
          color: var(--color-text-primary);
        }

        .dropdown-link.text-danger:hover {
          background-color: var(--color-error-muted);
          color: var(--color-error);
        }

        .dropdown-divider {
          height: 1px;
          background-color: var(--color-border-subtle);
          margin: 0.5rem;
        }
      `}</style>
    </nav>
  )
}

export default Navbar