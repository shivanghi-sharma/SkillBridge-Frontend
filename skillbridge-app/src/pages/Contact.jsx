/* ============================================================
   Contact Page – contact form + info cards
   Clean layout with glassmorphism form, animated inputs,
   contact info cards, and a mini-map placeholder.
   ============================================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import { contactInfo } from '../data/mockData';
import {
  validateEmail,
  validateRequired,
  fadeInUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
} from '../utils/helpers';

/* ── Contact Form ───────────────────────────────────────────── */
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // Update a field and clear its error
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate and "send" the message
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!validateRequired(form.name)) errs.name = 'Name is required';
    if (!validateEmail(form.email)) errs.email = 'Enter a valid email';
    if (!validateRequired(form.subject)) errs.subject = 'Subject is required';
    if (!validateRequired(form.message)) errs.message = 'Message cannot be empty';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  // Shared input classes
  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 outline-none input-glow transition-all duration-300 ${
      errors[field] ? 'border-red-500/60' : 'border-white/10 focus:border-purple-500/60'
    }`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slideInLeft}
      className="glass rounded-2xl p-6 md:p-8 glow-border"
    >
      <h3 className="text-xl font-bold text-white mb-6 font-[var(--font-heading)]">
        Send Us a Message
      </h3>

      {/* Success banner */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center text-sm"
          >
            ✅ Message sent! We'll get back within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Name & Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange('name')}
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange('email')}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange('subject')}
            className={inputClass('subject')}
          />
          {errors.subject && (
            <p className="text-red-400 text-xs mt-1 ml-1">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <textarea
            rows={5}
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange('message')}
            className={`${inputClass('message')} resize-none`}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1 ml-1">{errors.message}</p>
          )}
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={sending}
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(168,85,247,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-xl animated-gradient text-white font-semibold text-sm cursor-pointer disabled:opacity-60"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              Sending…
            </span>
          ) : (
            'Send Message ✉️'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

/* ── Contact Info Cards ─────────────────────────────────────── */
const ContactInfoCards = () => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={slideInRight}
    className="space-y-5"
  >
    <h3 className="text-xl font-bold text-white mb-2 font-[var(--font-heading)]">
      Get in Touch
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed mb-6">
      Have a question, idea, or partnership proposal? We'd love to hear from
      you. Reach out via any channel below.
    </p>

    {contactInfo.map((c, i) => (
      <GlassCard key={c.title} delay={i * 0.15}>
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">{c.icon}</span>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">{c.title}</h4>
            <p className="text-purple-300 text-sm font-medium">{c.detail}</p>
            <p className="text-gray-500 text-xs mt-1">{c.description}</p>
          </div>
        </div>
      </GlassCard>
    ))}

    {/* Quick-response promise */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10"
    >
      <span className="text-xl">⚡</span>
      <p className="text-gray-400 text-xs leading-relaxed">
        Our average response time is <span className="text-purple-300 font-medium">under 4 hours</span> during business days.
      </p>
    </motion.div>
  </motion.div>
);

/* ── Page Export ─────────────────────────────────────────────── */
const Contact = () => (
  <PageTransition>
    <section className="relative section-padding pt-32">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <SectionTitle title="Contact Us" subtitle="Let's Talk" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ContactForm />
          <ContactInfoCards />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default Contact;
