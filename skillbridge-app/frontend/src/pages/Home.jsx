
/* ============================================================
   Home Page – the main landing page
   Sections: Hero, Stats, Featured Skills, How It Works,
   Testimonials. All sections use scroll-triggered animations.
   ============================================================ */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import {
  featuredSkills,
  howItWorks,
  testimonials,
  stats,
} from '../data/mockData';
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  slideInLeft,
  slideInRight,
  formatNumber,
} from '../utils/helpers';

/* ── Hero Section ───────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center section-padding pt-28">
    {/* Decorative radial glow behind the hero */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[120px]" />
    </div>

    <div className="relative max-w-5xl mx-auto text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-purple-300 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Now in Beta — Join 50,000+ early adopters
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-[var(--font-heading)] leading-tight mb-6"
      >
        <span className="gradient-text-hero">Exchange Skills.</span>
        <br />
        <span className="text-white">Build </span>
        <span className="gradient-text">Futures.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        The world's first real-time skill exchange and micro-freelance platform.
        Learn what you want, teach what you know — no money required.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 rounded-full animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/25 cursor-pointer"
        >
          Start Exchanging — It's Free
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/about"
            className="px-8 py-3.5 rounded-full border border-purple-500/30 text-purple-300 font-semibold text-sm hover:bg-purple-500/10 transition-colors duration-300 inline-block"
          >
            Learn More →
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating avatars (social proof) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-14 flex items-center justify-center gap-3"
      >
        <div className="flex -space-x-3">
          {['AR', 'SC', 'MJ', 'AP'].map((initials, i) => (
            <motion.div
              key={initials}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              className="w-9 h-9 rounded-full animated-gradient flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#050010]"
            >
              {initials}
            </motion.div>
          ))}
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium">50K+ users</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xs">★</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ── Stats Bar ──────────────────────────────────────────────── */
const StatsSection = () => (
  <section className="section-padding py-12">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={staggerContainer}
      className="max-w-6xl mx-auto glass rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={fadeInUp}
          className="text-center"
        >
          <span className="text-3xl mb-2 block">{stat.icon}</span>
          <h3 className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</h3>
          <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

/* ── Featured Skills ────────────────────────────────────────── */
const FeaturedSkillsSection = () => (
  <section className="section-padding">
    <SectionTitle title="Featured Skills" subtitle="Explore" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {featuredSkills.map((skill, i) => (
        <GlassCard key={skill.id} delay={i * 0.1}>
          {/* Icon badge */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
            style={{ background: `${skill.color}18` }}
          >
            {skill.icon}
          </div>

          <h3 className="text-lg font-bold text-white mb-2 font-[var(--font-heading)]">
            {skill.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {skill.description}
          </p>

          {/* Learner count + CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400">
              {formatNumber(skill.learners)} learners
            </span>
            <motion.span
              whileHover={{ x: 4 }}
              className="text-purple-300 text-sm cursor-pointer"
            >
              Explore →
            </motion.span>
          </div>
        </GlassCard>
      ))}
    </motion.div>
  </section>
);

/* ── How It Works ───────────────────────────────────────────── */
const HowItWorksSection = () => (
  <section className="section-padding">
    <SectionTitle title="How It Works" subtitle="Simple Process" />

    <div className="max-w-4xl mx-auto">
      {howItWorks.map((step, i) => (
        <motion.div
          key={step.step}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={i % 2 === 0 ? slideInLeft : slideInRight}
          className="flex items-start gap-6 mb-12 last:mb-0"
        >
          {/* Step number circle */}
          <div className="flex-shrink-0 w-14 h-14 rounded-full animated-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
            {step.step}
          </div>

          <div className="glass rounded-xl p-5 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{step.icon}</span>
              <h3 className="text-lg font-bold text-white font-[var(--font-heading)]">
                {step.title}
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ── Testimonials ───────────────────────────────────────────── */
const TestimonialsSection = () => (
  <section className="section-padding">
    <SectionTitle title="What Our Users Say" subtitle="Testimonials" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {testimonials.map((t, i) => (
        <GlassCard key={t.id} delay={i * 0.15}>
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(t.rating)].map((_, j) => (
              <span key={j} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
            "{t.content}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white text-xs font-bold">
              {t.avatar}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </motion.div>
  </section>
);

/* ── CTA Banner ─────────────────────────────────────────────── */
const CTASection = () => (
  <section className="section-padding">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeIn}
      className="max-w-4xl mx-auto text-center glass rounded-3xl p-10 md:p-16 glow-border relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative">
        <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] mb-4">
          Ready to{' '}
          <span className="gradient-text">Level Up</span>?
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
          Join thousands of learners and makers who are exchanging skills, building portfolios, and shaping their futures — together.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-full animated-gradient text-white font-semibold shadow-lg shadow-purple-500/25 cursor-pointer"
        >
          Get Started for Free 🚀
        </motion.button>
      </div>
    </motion.div>
  </section>
);

/* ── Page Export ─────────────────────────────────────────────── */
const Home = () => (
  <PageTransition>
    <HeroSection />
    <StatsSection />
    <FeaturedSkillsSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <CTASection />
  </PageTransition>
);

export default Home;
