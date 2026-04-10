/* ============================================================
   Footer – site-wide footer with animated registration form
   Includes: newsletter-style sign-up with glowing inputs,
   floating labels, validation, animated submit button,
   footer link columns, and social icons.
   ============================================================ */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { footerLinks, skillInterests } from '../data/mockData';
import { validateEmail, validateRequired, fadeInUp, staggerContainer } from '../utils/helpers';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

/* ── Floating-label text input ──────────────────────────────── */
const FloatingInput = ({ label, type = 'text', value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      {/* The label floats up when the input is focused or filled */}
      <motion.label
        className={`absolute w-full text-center left-0 pointer-events-none transition-all duration-300 ${
          isActive
            ? 'top-1 text-[10px] text-purple-400'
            : 'top-3.5 text-sm text-gray-400'
        }`}
        animate={isActive ? { y: 0, scale: 1 } : { y: 0, scale: 1 }}
      >
        {label}
      </motion.label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full pt-5 pb-2 px-4 text-center rounded-xl bg-white/5 border text-sm text-white placeholder-transparent outline-none input-glow transition-all duration-300 ${
          error
            ? 'border-red-500/60'
            : focused
            ? 'border-purple-500/60'
            : 'border-white/10'
        }`}
      />

      {/* Inline error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-xs mt-1 text-center w-full"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Floating-label select ──────────────────────────────────── */
const FloatingSelect = ({ label, value, onChange, options, error }) => {
  const isActive = value.length > 0;

  return (
    <div className="relative">
      <motion.label
        className={`absolute w-full text-center left-0 pointer-events-none transition-all duration-300 z-10 ${
          isActive
            ? 'top-1 text-[10px] text-purple-400'
            : 'top-3.5 text-sm text-gray-400'
        }`}
      >
        {label}
      </motion.label>

      <select
        value={value}
        onChange={onChange}
        className={`w-full pt-5 pb-2 px-4 text-center rounded-xl bg-white/5 border text-sm text-white outline-none input-glow transition-all duration-300 appearance-none cursor-pointer ${
          error ? 'border-red-500/60' : 'border-white/10 focus:border-purple-500/60'
        }`}
        style={{ textAlignLast: 'center' }}
      >
        <option value="" disabled className="bg-gray-900" />
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900">
            {opt}
          </option>
        ))}
      </select>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-xs mt-1 text-center w-full"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Footer Component ──────────────────────────────────── */
const Footer = () => {
  // Form state
  const [form, setForm] = useState({ name: '', email: '', skill: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate and "submit" the form
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateRequired(form.name)) newErrors.name = 'Name is required';
    if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email';
    if (!validateRequired(form.skill)) newErrors.skill = 'Choose a skill interest';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate network request
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', skill: '' });
      // Reset success banner after a few seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const socialLinks = [
    { icon: <FaGithub />, href: '#', label: 'GitHub' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative mt-20">
      {/* Decorative top gradient line */}
      <div className="neon-line w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* ── Registration Form Section ──────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto glass rounded-2xl p-6 md:p-10 mb-24 glow-border"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-2">
              <span className="gradient-text">Join the Community</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Sign up to start exchanging skills and building your future today.
            </p>
          </div>

          {/* Success message */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center text-sm"
              >
                🎉 Welcome aboard! Check your email to get started.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingInput
              label="Your Name"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
            <FloatingInput
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <FloatingSelect
              label="Skill Interest"
              value={form.skill}
              onChange={handleChange('skill')}
              options={skillInterests}
              error={errors.skill}
            />

            {/* Animated submit button */}
            <div className="md:col-span-3 flex justify-center mt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(168,85,247,0.45)' }}
                whileTap={{ scale: 0.96 }}
                className="relative px-10 py-3 rounded-full animated-gradient text-white font-semibold text-sm overflow-hidden cursor-pointer disabled:opacity-60"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      {/* Spinner */}
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Joining…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Join SkillBridge 🚀
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-center"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1 flex flex-col items-center">
            <Link to="/" className="flex items-center gap-2 mb-4 justify-center">
              <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold font-[var(--font-heading)]">
                <span className="gradient-text">Skill</span>
                <span className="text-white">Bridge</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-[200px]">
              Exchange Skills. Build Futures. The world's first real-time skill exchange platform.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 justify-center w-full">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ scale: 1.2, color: '#a855f7' }}
                  className="text-gray-500 hover:text-purple-400 text-lg transition-colors"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={fadeInUp}>
              <h4 className="text-sm font-semibold text-white capitalize mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.name}>
                    <Link
                      to={l.href}
                      className="text-xs text-gray-500 hover:text-purple-300 transition-colors duration-300"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <div className="neon-line w-full mb-6 opacity-40" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <p>
            Designed with 💜 for the{' '}
            <span className="gradient-text font-medium">future of learning</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;