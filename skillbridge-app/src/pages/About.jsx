/* ============================================================
   About Page – platform story, mission, values, and team
   Sections: Mission Hero, Core Values, Platform Features,
   Team grid, and a Call to Action.
   ============================================================ */
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import { coreValues, teamMembers, stats } from '../data/mockData';
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  slideInLeft,
  slideInRight,
} from '../utils/helpers';

/* ── Mission Hero ───────────────────────────────────────────── */
const MissionHero = () => (
  <section className="relative section-padding pt-32 pb-16">
    {/* Background glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
    </div>

    <div className="relative max-w-4xl mx-auto text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-purple-300 mb-6"
      >
        🌍 Our Story
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[var(--font-heading)] mb-6"
      >
        <span className="gradient-text-hero">Bridging Talent,</span>
        <br />
        <span className="text-white">One Skill at a Time</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
      >
        SkillBridge was born from a simple idea: everyone has something valuable
        to teach and something exciting to learn. We created a platform where
        knowledge flows freely, empowering people across 90+ countries to grow
        together — without financial barriers.
      </motion.p>
    </div>
  </section>
);

/* ── Our Mission ────────────────────────────────────────────── */
const MissionSection = () => (
  <section className="section-padding py-16">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Left – text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInLeft}
      >
        <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Our Mission
        </p>
        <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-white mb-5">
          Democratising{' '}
          <span className="gradient-text">Education</span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Traditional education is expensive and siloed. We believe the best
          learning happens peer-to-peer — when a designer teaches a developer
          about typography, or a marketer learns Python from a data scientist.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          SkillBridge makes this effortless with AI-powered matching, real-time
          video sessions, project-based collaboration, and a gamified
          reputation system that rewards quality teaching.
        </p>

        {/* Mini stat boxes */}
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(0, 2).map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <h4 className="text-xl font-bold gradient-text">{s.value}</h4>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right – decorative card stack */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInRight}
        className="relative h-80 md:h-96"
      >
        {/* Layered glassmorphism cards */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-4/5 glass rounded-2xl p-6 glow-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white text-lg">
              🎯
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Smart Matching</h4>
              <p className="text-gray-500 text-xs">AI pairs you perfectly</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '87%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full animated-gradient rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute bottom-8 left-0 w-4/5 glass rounded-2xl p-6 glow-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center text-white text-lg">
              ⚡
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Real-Time Sessions</h4>
              <p className="text-gray-500 text-xs">Learn and teach live</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[85, 92, 78, 95, 88].map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${v}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                className="flex-1 rounded-t animated-gradient"
                style={{ maxHeight: '40px' }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ── Core Values ────────────────────────────────────────────── */
const CoreValuesSection = () => (
  <section className="section-padding">
    <SectionTitle title="Our Core Values" subtitle="What We Stand For" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {coreValues.map((v, i) => (
        <GlassCard key={v.title} delay={i * 0.12}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{v.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 font-[var(--font-heading)]">
                {v.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {v.description}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </motion.div>
  </section>
);

/* ── Platform Features ──────────────────────────────────────── */
const FeaturesSection = () => {
  const features = [
    {
      title: 'AI-Powered Matching',
      description:
        'Our proprietary algorithm analyses your skills, goals, and learning style to find the perfect exchange partner.',
      icon: '🧠',
    },
    {
      title: 'Real-Time Collaboration',
      description:
        'HD video calls, shared code editors, design canvases, and interactive whiteboards — all built in.',
      icon: '📡',
    },
    {
      title: 'Gamified Progress',
      description:
        'Earn XP, unlock badges, climb leaderboards and build a public reputation that speaks for itself.',
      icon: '🎮',
    },
    {
      title: 'Portfolio Builder',
      description:
        'Automatically showcase completed exchanges, projects, and peer endorsements in a stunning portfolio.',
      icon: '💼',
    },
    {
      title: 'Micro-Freelancing',
      description:
        'Take quick gigs, offer your expertise, and earn credits — all within the same ecosystem.',
      icon: '💸',
    },
    {
      title: 'Global Community',
      description:
        'Connect with 50,000+ curious minds across 90+ countries. Your next collaboration is a click away.',
      icon: '🌐',
    },
  ];

  return (
    <section className="section-padding">
      <SectionTitle title="Platform Features" subtitle="Why SkillBridge" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <GlassCard key={f.title} delay={i * 0.1}>
            <span className="text-3xl block mb-3">{f.icon}</span>
            <h3 className="text-lg font-bold text-white mb-2 font-[var(--font-heading)]">
              {f.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
};

/* ── Team ───────────────────────────────────────────────────── */
const TeamSection = () => (
  <section className="section-padding">
    <SectionTitle title="Meet the Team" subtitle="The People Behind" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {teamMembers.map((m, i) => (
        <motion.div key={m.name} variants={fadeInUp} className="text-center">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="w-20 h-20 mx-auto rounded-2xl animated-gradient flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg shadow-purple-500/20"
          >
            {m.avatar}
          </motion.div>
          <h4 className="text-white font-semibold text-sm">{m.name}</h4>
          <p className="text-gray-500 text-xs">{m.role}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

/* ── Page Export ─────────────────────────────────────────────── */
const About = () => (
  <PageTransition>
    <MissionHero />
    <MissionSection />
    <CoreValuesSection />
    <FeaturesSection />
    <TeamSection />
  </PageTransition>
);

export default About;
