/* ============================================================
   Dashboard Page – authenticated user's control center
   Features: buyer/seller role tabs, stats grid, sessions list,
   notifications panel, and quick action buttons.
   ============================================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLogOut, FiSearch, FiUser, FiEdit3, FiPlus,
  FiBell, FiCheck, FiMessageSquare, FiCalendar,
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import Toast from '../components/Toast';
import {
  buyerStats, sellerStats, mySessions, notifications as initialNotifications,
} from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  upcoming: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  completed: 'bg-green-500/15 text-green-400 border-green-500/25',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const notifIcons = {
  booking: FiCalendar,
  payment: FiCheck,
  review: FiEdit3,
  chat: FiMessageSquare,
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buyer');
  const [notifs, setNotifs] = useState(initialNotifications);
  const [toast, setToast] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
    setToast({ message: 'All notifications marked as read', type: 'success' });
  };

  const unreadCount = notifs.filter((n) => !n.read).length;
  const currentStats = activeTab === 'buyer' ? buyerStats : sellerStats;

  return (
    <PageTransition>
      <section className="section-padding pt-28">
        <div className="max-w-6xl mx-auto">
          {/* ── Header ──────────────────────────────────── */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white font-[var(--font-heading)]">
                Welcome back,{' '}
                <span className="gradient-text">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                ! 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Here's what's happening with your account today.
              </p>
            </motion.div>

            <motion.button
              onClick={handleLogout}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* ── Role Tabs ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-8"
          >
            {['buyer', 'seller'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'animated-gradient text-white shadow-lg shadow-purple-500/20'
                    : 'glass text-gray-300 hover:text-white'
                }`}
              >
                As {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main content (2 cols) ─────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="wait">
                  {currentStats.map((stat, i) => (
                    <motion.div
                      key={`${activeTab}-${stat.label}`}
                      variants={fadeInUp}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard className="text-center py-5">
                        <span className="text-2xl mb-2 block">{stat.icon}</span>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Recent Sessions */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)] flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-purple-400" />
                  {activeTab === 'buyer' ? 'Recent Sessions' : 'Upcoming Sessions'}
                </h2>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-3"
                >
                  {mySessions.map((session) => (
                    <motion.div key={session.id} variants={fadeInUp}>
                      <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {session.seller.split(' ').map((w) => w[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-sm">
                              {session.skill}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              with {session.seller} · {session.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            ₹{session.price}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                              statusColors[session.status]
                            }`}
                          >
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                          {session.status === 'completed' && !session.rated && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setToast({ message: 'Rating feature coming soon!', type: 'info' })
                              }
                              className="text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 cursor-pointer"
                            >
                              Rate ★
                            </motion.button>
                          )}
                          {session.rated && (
                            <span className="text-xs text-yellow-400">
                              {'★'.repeat(session.rating)}
                            </span>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => navigate('/explore')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  <FiSearch className="w-4 h-4" />
                  Browse Skills
                </motion.button>
                <motion.button
                  onClick={() => navigate('/profile')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all text-sm font-medium cursor-pointer"
                >
                  <FiUser className="w-4 h-4" />
                  View Profile
                </motion.button>
                <motion.button
                  onClick={() => navigate('/chat')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all text-sm font-medium cursor-pointer"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Messages
                </motion.button>
                {activeTab === 'seller' && (
                  <motion.button
                    onClick={() =>
                      setToast({ message: 'Add Skills feature coming soon!', type: 'info' })
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-500/30 text-pink-300 hover:bg-pink-500/10 transition-all text-sm font-medium cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Skills
                  </motion.button>
                )}
              </div>
            </div>

            {/* ── Notifications sidebar ─────────────────── */}
            <div className="lg:col-span-1">
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-[var(--font-heading)] flex items-center gap-2">
                    <FiBell className="w-4 h-4 text-purple-400" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full animated-gradient text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {notifs.map((notif) => {
                    const NotifIcon = notifIcons[notif.type] || FiBell;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          notif.read ? 'opacity-60' : 'bg-purple-500/5 border border-purple-500/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          notif.read ? 'bg-gray-700/50' : 'animated-gradient'
                        }`}>
                          <NotifIcon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-500 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-1" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageTransition>
  );
};

export default Dashboard;
