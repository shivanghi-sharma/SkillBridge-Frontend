/* ============================================================
   SectionTitle – reusable heading component with gradient
   text, subtitle and decorative neon underline.
   ============================================================ */
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/helpers';

const SectionTitle = ({ title, subtitle, className = '' }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={fadeInUp}
    className={`text-center mb-12 md:mb-16 ${className}`}
  >
    {/* Subtitle / label */}
    {subtitle && (
      <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">
        {subtitle}
      </p>
    )}
    {/* Main heading with gradient */}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[var(--font-heading)] gradient-text mb-4">
      {title}
    </h2>
    {/* Decorative neon line */}
    <div className="neon-line w-24 mx-auto" />
  </motion.div>
);

export default SectionTitle;