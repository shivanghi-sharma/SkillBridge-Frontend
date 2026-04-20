/* ============================================================
   SellerProfile Page – detailed seller view + booking
   Route: /seller/:id
   Shows bio, stats, skills, reviews, and a booking panel
   with time slot picker.
   ============================================================ */
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiStar, FiUsers, FiClock,
  FiDollarSign, FiRefreshCw, FiCalendar, FiCheckCircle,
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import GlassCard from '../components/GlassCard';
import Toast from '../components/Toast';
import { sellers, timeSlots } from '../data/mockData';
import { fadeInUp, staggerContainer } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

/* Deterministic avatar colour */
const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-violet-500 to-purple-500',
  'from-fuchsia-500 to-pink-500',
  'from-indigo-500 to-violet-500',
];

/* Mock reviews */
const mockReviews = [
  { id: 1, name: 'Aarav Gupta', avatar: 'AG', rating: 5, text: 'Absolutely brilliant session! Explained complex concepts so clearly. Will definitely book again.', date: '2 weeks ago' },
  { id: 2, name: 'Diya Sharma', avatar: 'DS', rating: 5, text: 'Very patient and knowledgeable. Helped me crack my interview prep in just two sessions!', date: '1 month ago' },
  { id: 3, name: 'Kabir Singh', avatar: 'KS', rating: 4, text: 'Great mentor. Slightly rushed towards the end but the insights were gold. Highly recommended.', date: '1 month ago' },
];

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [toast, setToast] = useState(null);

  const seller = sellers.find((s) => s.id === parseInt(id));

  if (!seller) {
    return (
      <PageTransition>
        <section className="min-h-screen flex items-center justify-center section-padding pt-28">
          <div className="text-center">
            <div className="text-7xl mb-6">😕</div>
            <h1 className="text-3xl font-bold text-white mb-3 font-[var(--font-heading)]">
              Seller Not Found
            </h1>
            <p className="text-gray-400 mb-8">
              The profile you're looking for doesn't exist.
            </p>
            <Link
              to="/explore"
              className="px-6 py-3 rounded-full animated-gradient text-white font-semibold text-sm inline-block"
            >
              ← Back to Explore
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  const colorIndex = seller.id % avatarColors.length;
  const gradient = avatarColors[colorIndex];

  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!selectedSlot) {
      setToast({ message: 'Please select a time slot first.', type: 'error' });
      return;
    }
    setToast({ message: `Session booked with ${seller.name} at ${selectedSlot}! 🎉`, type: 'success' });
    setSelectedSlot(null);
  };

  const sellerProfileStats = [
    { label: 'Sessions', value: seller.sessions, icon: FiUsers },
    { label: 'Rating', value: `${seller.rating}★`, icon: FiStar },
    { label: 'Price/hr', value: `₹${seller.price}`, icon: FiDollarSign },
    { label: 'Repeat Clients', value: Math.floor(seller.sessions * 0.3), icon: FiRefreshCw },
  ];

  return (
    <PageTransition>
      <section className="section-padding pt-28">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <motion.button
            onClick={() => navigate('/explore')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors mb-8 cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Explore</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main content (2 cols) ─────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero card */}
              <GlassCard className="relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-start gap-6">
                  {/* Large avatar */}
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-3xl shadow-2xl flex-shrink-0`}>
                    {seller.avatar}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-white font-[var(--font-heading)]">
                        {seller.name}
                      </h1>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          seller.available
                            ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                            : 'bg-red-500/15 text-red-400 border border-red-500/25'
                        }`}
                      >
                        {seller.available ? '🟢 Available Now' : '🔴 Currently Busy'}
                      </span>
                    </div>

                    <p className="text-purple-300 text-lg mb-3">{seller.skill}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <FiStar className="w-4 h-4 fill-yellow-400" />
                        {seller.rating} rating
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <FiUsers className="w-4 h-4" />
                        {seller.sessions} sessions
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <FiClock className="w-4 h-4" />
                        60 min/session
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Stats */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {sellerProfileStats.map((stat) => (
                  <motion.div key={stat.label} variants={fadeInUp}>
                    <GlassCard className="text-center py-5">
                      <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* About */}
              <GlassCard>
                <h2 className="text-lg font-bold text-white mb-3 font-[var(--font-heading)]">
                  About Me
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {seller.bio}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  With a passion for teaching and years of hands-on experience, I help students and professionals master new skills efficiently. My sessions are practical, project-driven, and tailored to your specific learning goals. Whether you're a complete beginner or looking to level up, I've got you covered.
                </p>
              </GlassCard>

              {/* Skills */}
              <GlassCard>
                <h2 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)]">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {seller.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/15 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-300 text-sm border border-pink-500/15 font-medium">
                    1-on-1 Mentoring
                  </span>
                  <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/15 font-medium">
                    Project Guidance
                  </span>
                </div>
              </GlassCard>

              {/* Reviews */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)]">
                  Reviews ({mockReviews.length})
                </h2>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  {mockReviews.map((review) => (
                    <motion.div key={review.id} variants={fadeInUp}>
                      <GlassCard>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-semibold text-sm">
                                {review.name}
                              </h4>
                              <span className="text-gray-500 text-xs">{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ── Booking sidebar ───────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <GlassCard className="glow-border">
                  <h3 className="text-lg font-bold text-white mb-1 font-[var(--font-heading)]">
                    Book a Session
                  </h3>
                  <p className="text-gray-400 text-xs mb-5">60-minute 1-on-1 session</p>

                  {/* Price display */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold gradient-text">₹{seller.price}</span>
                    <span className="text-gray-500 text-sm">/session</span>
                  </div>

                  {/* Date picker */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-2 block font-medium">
                      <FiCalendar className="w-3 h-3 inline mr-1" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    />
                  </div>

                  {/* Time slots */}
                  <div className="mb-6">
                    <label className="text-xs text-gray-400 mb-2 block font-medium">
                      <FiClock className="w-3 h-3 inline mr-1" />
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? 'animated-gradient text-white shadow-lg shadow-purple-500/20'
                              : 'bg-white/5 text-gray-300 hover:bg-purple-500/10 hover:text-purple-300 border border-white/5'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Book button */}
                  <motion.button
                    onClick={handleBookNow}
                    disabled={!seller.available}
                    whileHover={seller.available ? { scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.3)' } : {}}
                    whileTap={seller.available ? { scale: 0.98 } : {}}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      seller.available
                        ? 'animated-gradient text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {seller.available ? (
                      <span className="flex items-center justify-center gap-2">
                        <FiCheckCircle className="w-4 h-4" />
                        Book Now
                      </span>
                    ) : (
                      'Currently Unavailable'
                    )}
                  </motion.button>

                  {/* Info */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Instant confirmation
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Secure escrow payment
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      Free cancellation 24h before
                    </div>
                  </div>
                </GlassCard>
              </div>
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

export default SellerProfile;
