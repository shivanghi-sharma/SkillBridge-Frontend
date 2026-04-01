/* ============================================================
   Utility helpers for SkillBridge
   ============================================================ */

/**
 * Validate an email address with a basic regex.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate that a string is not empty (after trimming).
 * @param {string} value
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Format a number with commas for display (e.g. 2340 → "2,340")
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Standard Framer Motion variants used across the app.
 * Import these to keep animations consistent.
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
