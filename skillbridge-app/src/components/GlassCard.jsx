/* ============================================================
   GlassCard – reusable glassmorphism card with hover glow
   and optional icon display. Used for skill cards, features,
   and all card-based layouts.
   ============================================================ */
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/helpers';

const GlassCard = ({ children, className = '', hoverGlow = true, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay },
      },
    }}
    whileHover={
      hoverGlow
        ? {
            y: -6,
            boxShadow: '0 0 30px rgba(168,85,247,0.2), 0 0 60px rgba(168,85,247,0.07)',
            borderColor: 'rgba(168,85,247,0.3)',
          }
        : {}
    }
    transition={{ duration: 0.3 }}
    className={`glass rounded-2xl p-6 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;
