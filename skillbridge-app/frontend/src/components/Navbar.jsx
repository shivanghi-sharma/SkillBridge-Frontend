/* ============================================================
   Navbar – sticky, glassmorphism navigation bar
   Includes: logo, nav links, mobile hamburger, CTA button,
   auth-aware links, user dropdown, and scroll progress.
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiLogOut, FiGrid, FiMessageSquare,
  FiChevronDown,
} from 'react-icons/fi';
import { navLinks } from '../data/mockData';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);          // Mobile menu toggle
  const [scrolled, setScrolled] = useState(false);       // Has user scrolled?
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollProgress = useScrollProgress();
  const dropdownRef = useRef(null);

  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  // Detect scroll to apply background blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : 'U';

  /* Links that show when logged in */
  const authLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Chat', path: '/chat', icon: FiMessageSquare },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-purple-900/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-9 h-9 rounded-lg animated-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30"
            >
              SB
            </motion.div>
            <span className="text-xl font-bold font-[var(--font-heading)]">
              <span className="gradient-text">Skill</span>
              <span className="text-white">Bridge</span>
            </span>
          </Link>

          {/* ── Desktop links ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-purple-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                {/* Active indicator dot */}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Auth-aware links */}
            {isLoggedIn &&
              authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 flex items-center gap-1.5 ${
                    location.pathname === link.path
                      ? 'text-purple-300'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
          </div>

          {/* ── CTA + hamburger ──────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-3 items-center">
              {isLoggedIn ? (
                /* User dropdown */
                <div ref={dropdownRef} className="relative">
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full glass cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full animated-gradient flex items-center justify-center text-white text-xs font-bold">
                      {userInitials}
                    </div>
                    <FiChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 glass rounded-xl py-2 shadow-2xl border border-purple-500/10 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
                        >
                          <FiGrid className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
                        >
                          <FiUser className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/chat"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
                        >
                          <FiMessageSquare className="w-4 h-4" />
                          Messages
                        </Link>
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                          >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-sm font-semibold rounded-full animated-gradient text-white shadow-lg shadow-purple-500/25 cursor-pointer"
                  >
                    Get Started
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-purple-300 rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-purple-300 rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-purple-300 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll progress bar ──────────────────────────── */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
        <motion.div
          className="h-full animated-gradient"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      {/* ── Mobile menu ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-purple-500/15 text-purple-300'
                        : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {isLoggedIn ? (
                <div className="mt-2 space-y-2">
                  {authLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + i) * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === link.path
                            ? 'bg-purple-500/15 text-purple-300'
                            : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                        }`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  <Link to="/profile" className="block w-full">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-full border border-purple-500/30 text-purple-300 cursor-pointer"
                    >
                      <FiUser className="w-4 h-4" />
                      Profile
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-5 py-3 text-sm font-semibold rounded-full animated-gradient text-white cursor-pointer"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <Link to="/login" className="block w-full">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 w-full px-5 py-3 text-sm font-semibold rounded-full animated-gradient text-white cursor-pointer"
                  >
                    Get Started
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;