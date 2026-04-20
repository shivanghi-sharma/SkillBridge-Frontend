/* ============================================================
   Explore Page – browse & filter skill sellers
   Features: search bar, category chips, price/availability
   filters, responsive seller grid with SkillCard components.
   ============================================================ */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiUsers } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import SkillCard from '../components/SkillCard';
import Toast from '../components/Toast';
import { sellers } from '../data/mockData';
import { staggerContainer, fadeInUp } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const categories = ['All', 'Frontend', 'Backend', 'Design', 'DSA', 'Career'];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '< ₹300', min: 0, max: 299 },
  { label: '₹300–500', min: 300, max: 500 },
  { label: '> ₹500', min: 501, max: Infinity },
];

const Explore = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Filtering logic ──────────────────────────────── */
  const filteredSellers = useMemo(() => {
    const range = priceRanges[activePriceRange];
    return sellers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.skill.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All' ||
        s.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()));

      const matchesPrice = s.price >= range.min && s.price <= range.max;
      const matchesAvailability = !availableOnly || s.available;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  }, [search, activeCategory, activePriceRange, availableOnly]);

  /* ── Book handler ─────────────────────────────────── */
  const handleBook = (seller) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/seller/${seller.id}`);
  };

  return (
    <PageTransition>
      {/* ── Hero / Search Section ──────────────────────── */}
      <section className="section-padding pt-28 pb-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-purple-600/8 blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-purple-300 mb-6"
          >
            <FiUsers className="w-3 h-3" />
            {sellers.length} experts available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-[var(--font-heading)] mb-4"
          >
            Find Your Perfect{' '}
            <span className="gradient-text">Skill Match</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-gray-400 text-base max-w-xl mx-auto mb-10"
          >
            Browse top-rated mentors and freelancers. Book a session, learn a skill, level up your career.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="relative max-w-xl mx-auto mb-10"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, skill, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Filter Section ─────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
            <FiFilter className="w-4 h-4" />
            <span>Filters</span>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'animated-gradient text-white shadow-lg shadow-purple-500/20'
                    : 'glass text-gray-300 hover:text-white'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Price range + availability */}
          <div className="flex flex-wrap items-center gap-3">
            {priceRanges.map((range, i) => (
              <button
                key={range.label}
                onClick={() => setActivePriceRange(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activePriceRange === i
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {range.label}
              </button>
            ))}

            <div className="h-4 w-px bg-gray-700 mx-1" />

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                  availableOnly ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    availableOnly ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </div>
              <span className="text-xs text-gray-400">Available only</span>
            </label>
          </div>
        </motion.div>
      </section>

      {/* ── Seller Grid ────────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Count badge */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-sm text-gray-400 mb-6"
          >
            Showing{' '}
            <span className="text-purple-300 font-semibold">
              {filteredSellers.length}
            </span>{' '}
            expert{filteredSellers.length !== 1 ? 's' : ''}
          </motion.p>

          {filteredSellers.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSellers.map((seller) => (
                <SkillCard
                  key={seller.id}
                  seller={seller}
                  onBook={handleBook}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2 font-[var(--font-heading)]">
                No experts found
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Try adjusting your search or filters.
              </p>
              <motion.button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                  setActivePriceRange(0);
                  setAvailableOnly(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full animated-gradient text-white font-semibold text-sm cursor-pointer"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
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

export default Explore;
