/* ============================================================
   SkillCard – seller card for the Explore page
   Displays avatar, skill, rating, sessions, tags, price,
   availability badge, and a booking CTA.
   ============================================================ */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiArrowRight } from 'react-icons/fi';
import GlassCard from './GlassCard';

/* Deterministic colour from initials (keeps avatar colour consistent) */
const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-violet-500 to-purple-500',
  'from-fuchsia-500 to-pink-500',
  'from-indigo-500 to-violet-500',
];

const SkillCard = ({ seller, onBook }) => {
  const colorIndex = seller.id % avatarColors.length;
  const gradient = avatarColors[colorIndex];

  return (
    <GlassCard className="flex flex-col h-full group" delay={(seller.id - 1) * 0.08}>
      {/* ── Header: avatar + info ──────────────────────── */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar circle */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
          {seller.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/seller/${seller.id}`} className="hover:underline">
            <h3 className="text-white font-bold text-base truncate font-[var(--font-heading)]">
              {seller.name}
            </h3>
          </Link>
          <p className="text-purple-300 text-sm truncate">{seller.skill}</p>

          {/* Rating + sessions */}
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
              <FiStar className="w-3 h-3 fill-yellow-400" />
              {seller.rating}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-xs">
              <FiUsers className="w-3 h-3" />
              {seller.sessions} sessions
            </span>
          </div>
        </div>

        {/* Availability badge */}
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            seller.available
              ? 'bg-green-500/15 text-green-400 border border-green-500/25'
              : 'bg-red-500/15 text-red-400 border border-red-500/25'
          }`}
        >
          {seller.available ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* ── Bio ────────────────────────────────────────── */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {seller.bio}
      </p>

      {/* ── Tags ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {seller.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/15"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ── Footer: price + CTA ────────────────────────── */}
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <div>
          <span className="text-xl font-bold text-white">₹{seller.price}</span>
          <span className="text-xs text-gray-500 ml-1">/session</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBook(seller)}
          disabled={!seller.available}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            seller.available
              ? 'animated-gradient text-white shadow-lg shadow-purple-500/20'
              : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
          }`}
        >
          Book Session
          <FiArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default SkillCard;
