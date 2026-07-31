import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PopularServices from '../components/PopularServices'
import FeatureHighlights from '../components/FeatureHighlights'
import ClosingCTA from '../components/ClosingCTA'
import {
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Scale,
  ArrowRight,
  Search,
  Star,
  Zap,
  Rocket,
  Target,
  Users,
  Heart,
  ChevronDown,
  Mail,
  MapPin,
  Send,
} from 'lucide-react'
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  motion,
} from '../components/motion'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Skills',
    description: 'Professionals with real portfolios and peer reviews.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Escrow-backed transactions. Pay only when satisfied.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Communicate directly with sellers before and during sessions.',
  },
  {
    icon: Scale,
    title: 'Fair Disputes',
    description: 'Admin-mediated resolution for every transaction.',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Filter by skill, price, and rating to find the right fit.',
  },
  {
    icon: Star,
    title: 'Honest Reviews',
    description: 'Community-driven ratings you can trust.',
  },
]

const missionPillars = [
  {
    icon: Rocket,
    title: 'Empower',
    statement: 'Every freelancer deserves a launchpad, not a ladder.',
    description:
      'We tear down barriers between talent and opportunity. No gatekeeping. No algorithms burying your work. Just your skills, front and center.',
  },
  {
    icon: Users,
    title: 'Connect',
    statement: 'Real people. Real skills. Real collaboration.',
    description:
      'We built a marketplace where trust isn\'t a luxury — it\'s the foundation. Verified profiles, honest reviews, and direct communication.',
  },
  {
    icon: Heart,
    title: 'Protect',
    statement: 'Your work matters. Your payment is guaranteed.',
    description:
      'Escrow-backed payments, fair dispute resolution, and a platform that stands with both buyers and sellers. Always.',
  },
]

const Landing = () => {
  const { user } = useAuth()

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page" style={{ overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════
          HERO — Full viewport, animated orbs
          ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(3rem, 8vh, 6rem) 1.5rem',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Floating Orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="hero-orb hero-orb--1" />
          <div className="hero-orb hero-orb--2" />
          <div className="hero-orb hero-orb--3" />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left Column */}
          <div>
          <FadeInSection delay={0}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 1rem',
                backgroundColor: 'var(--color-accent-muted)',
                marginBottom: '2rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <Zap size={12} />
              The Future of Freelance is Here
            </motion.div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <h1
              className="font-display landing-hero-heading gradient-text-hero"
              style={{
                fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '1.75rem',
              }}
            >
              We Didn't Join the
              <br />
              Gig Economy.
              <br />
              <span className="text-glow" style={{
                WebkitTextFillColor: 'unset',
                color: 'var(--color-accent)',
              }}>
                We Rewrote It.
              </span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: 540,
                marginBottom: '2.5rem',
              }}
            >
              SkillBridge is the revolution — where every skilled professional gets a 
              fair stage, every payment is protected, and short gigs become 
              real careers. <strong style={{ color: 'var(--color-text-primary)' }}>No middlemen. No exploitation. Just talent, unleashed.</strong>
            </p>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  to={user ? '/browse' : '/register'}
                  className="btn-futuristic"
                >
                  {user ? 'Browse Skills' : 'Join the Revolution'}
                  <motion.span
                    style={{ display: 'inline-flex' }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </Link>
              </motion.div>
              {!user && (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Link
                    to="/login"
                    className="btn-outline-futuristic"
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </div>
          </FadeInSection>
        </div>

        {/* Right Column: Image */}
        <FadeInSection delay={0.4}>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img
              src="/hero-image.jpg"
              alt="Freelancer working"
              style={{
                width: '100%',
                maxWidth: 540,
                borderRadius: '1.5rem',
                objectFit: 'cover',
                boxShadow: '0 0 40px var(--color-accent-muted), 0 0 80px rgba(0,0,0,0.5)',
                border: '1px solid var(--color-border-subtle)',
              }}
            />
          </motion.div>
        </FadeInSection>
      </div>

        {/* Scroll indicator */}
        <FadeInSection delay={0.6}>
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => scrollToSection('manifesto')}
          >
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Discover More
            </span>
            <ChevronDown size={16} className="scroll-indicator" style={{ color: 'var(--color-accent)' }} />
          </div>
        </FadeInSection>
      </section>

      {/* ═══════════════════════════════════════════
          POPULAR SERVICES & FEATURES
          ═══════════════════════════════════════════ */}
      <PopularServices />
      <FeatureHighlights />

      {/* ═══════════════════════════════════════════
          MANIFESTO — Bold empowering statements
          ═══════════════════════════════════════════ */}
      <section
        id="manifesto"
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vh, 8rem) 1.5rem',
        }}
      >
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <FadeInSection>
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-accent)',
                marginBottom: '2.5rem',
              }}
            >
              Our Manifesto
            </p>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {[
              'The gig economy was broken. We fixed it.',
              'Every skill deserves a stage. Every talent deserves fair pay.',
              'We don\'t just connect freelancers with clients — we arm them with trust, security, and respect.',
            ].map((text, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <p
                  className="font-display landing-manifesto-text"
                  style={{
                    fontSize: 'clamp(1.375rem, 3vw, 2rem)',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {i === 0 && <span className="gradient-text" style={{ fontWeight: 700 }}>{text}</span>}
                  {i !== 0 && text}
                </p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUR MISSION — Glassmorphism cards
          ═══════════════════════════════════════════ */}
      <section
        id="mission"
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vh, 8rem) 1.5rem',
        }}
      >
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-accent)',
                  marginBottom: '1rem',
                }}
              >
                Our Mission
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                }}
              >
                Building the platform we wish existed.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                We started SkillBridge because freelancers deserved better — better pay, better protection, better respect. This is that platform.
              </p>
            </div>
          </FadeInSection>

          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
            className="landing-mission-grid"
          >
            {missionPillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <StaggerItem key={i}>
                  <motion.div
                    className="glass-card"
                    style={{
                      padding: '3rem 2.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(145deg, var(--color-surface-raised) 0%, var(--color-surface) 100%)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '1.5rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(212,118,78,0.15)', borderColor: 'var(--color-accent-soft)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top left, var(--color-accent-soft) 0%, transparent 70%)', opacity: 0.4 }} />
                    <div className="mission-icon-wrap" style={{
                        width: 72,
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--color-accent-muted) 0%, rgba(212, 118, 78, 0.05) 100%)',
                        border: '1px solid rgba(212, 118, 78, 0.1)',
                        borderRadius: '1.25rem',
                        marginBottom: '2rem',
                        boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.05), 0 4px 15px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                      <Icon size={34} strokeWidth={1.5} style={{ color: 'var(--color-accent)', filter: 'drop-shadow(0 2px 4px rgba(212,118,78,0.4))' }} />
                    </div>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        marginBottom: '1rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {pillar.statement}
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.65,
                        flex: 1,
                      }}
                    >
                      {pillar.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES — Redesigned with glass effect
          ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vh, 8rem) 1.5rem',
        }}
      >
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeInSection style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-accent)',
                  marginBottom: '1rem',
                }}
              >
                Why SkillBridge
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                }}
              >
                Built for the fearless.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                Every feature designed to make freelance collaboration trustworthy, fast, and fair.
              </p>
            </div>
          </FadeInSection>

          <StaggerContainer
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
            className="landing-features-grid"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <StaggerItem key={i}>
                  <motion.div
                    className="glass-card"
                    style={{
                      padding: '2.5rem 2rem',
                      height: '100%',
                      background: 'linear-gradient(145deg, var(--color-surface-raised) 0%, var(--color-surface) 100%)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '1.5rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(212,118,78,0.15)', borderColor: 'var(--color-accent-soft)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Decorative glow behind icon */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, var(--color-accent-soft) 0%, transparent 70%)', opacity: 0.5 }} />
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--color-accent-muted) 0%, rgba(212, 118, 78, 0.05) 100%)',
                        border: '1px solid rgba(212, 118, 78, 0.1)',
                        borderRadius: '1.25rem',
                        marginBottom: '1.5rem',
                        boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.05), 0 4px 15px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Icon size={34} strokeWidth={1.5} style={{ color: 'var(--color-accent)', filter: 'drop-shadow(0 2px 4px rgba(212,118,78,0.4))' }} />
                    </div>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.75rem',
                        letterSpacing: '-0.01em',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.65,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Revolution call
          ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(5rem, 12vh, 8rem) 1.5rem',
        }}
      >
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />
        
        {/* Background orbs for CTA */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div
            className="hero-orb"
            style={{
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(212, 118, 78, 0.08) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'orb-float-1 15s ease-in-out infinite',
            }}
          />
        </div>

        <FadeInSection>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              The revolution starts with{' '}
              <span className="gradient-text">you.</span>
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: 480,
                margin: '0 auto 2.5rem',
              }}
            >
              Whether you're a creator ready to monetize your skills or a business looking for exceptional talent — SkillBridge is where it happens.
            </p>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{ display: 'inline-block' }}
            >
              <Link
                to={user ? '/browse' : '/register'}
                className="btn-futuristic"
                style={{ padding: '1rem 3rem', fontSize: '1.0625rem' }}
              >
                {user ? 'Browse Skills' : 'Get Started — It\'s Free'}
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Showcase Image */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{
                marginTop: '5rem',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Optional glow behind image inside container */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
              <img 
                src="/image8.png" 
                alt="SkillBridge Platform Showcase" 
                style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }} 
              />
            </motion.div>
          </div>
        </FadeInSection>
      </section>

      {/* ═══════════════════════════════════════════
          CLOSING CTA
          ═══════════════════════════════════════════ */}
      <ClosingCTA />

      {/* ═══════════════════════════════════════════
          CONTACT US
          ═══════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          position: 'relative',
          padding: 'clamp(4rem, 10vh, 8rem) 1.5rem',
        }}
      >
        <div className="glow-divider" style={{ position: 'absolute', top: 0, left: '10%', right: '10%' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-accent)',
                  marginBottom: '1rem',
                }}
              >
                Contact Us
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                }}
              >
                Let's build something together.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                Got questions, feedback, or partnership ideas? We'd love to hear from you.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
              }}
              className="landing-contact-grid"
            >
              {/* Contact Form */}
              <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      className="input-field input-field--boxed input-glow"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      className="input-field input-field--boxed input-glow"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="input-label">Message</label>
                    <textarea
                      className="input-field input-field--boxed input-glow"
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="btn-futuristic"
                    style={{ width: '100%', justifyContent: 'center' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={16} />
                    Send Message
                  </motion.button>
                </form>
              </div>

              {/* Contact Info with Premium Background */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '2.5rem',
                  padding: '3rem 2.5rem',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Background Image */}
                <img
                  src="/image7.png?v=2"
                  alt="Contact background"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'saturate(1.2)'
                  }}
                />
                {/* Dark Glass Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(145deg, rgba(10, 10, 11, 0.95) 0%, rgba(20, 20, 22, 0.75) 100%)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1,
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(212,118,78,0.2) 0%, rgba(212,118,78,0.05) 100%)',
                    border: '1px solid rgba(212,118,78,0.3)', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}>
                    <Mail size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h4 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                      Email Us
                    </h4>
                    <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                      support@skillbridge.io
                    </p>
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(212,118,78,0.2) 0%, rgba(212,118,78,0.05) 100%)',
                    border: '1px solid rgba(212,118,78,0.3)', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}>
                    <MapPin size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h4 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                      Location
                    </h4>
                    <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                      Built remotely, for the world.
                    </p>
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 50, height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(212,118,78,0.2) 0%, rgba(212,118,78,0.05) 100%)',
                    border: '1px solid rgba(212,118,78,0.3)', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}>
                    <Target size={22} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h4 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                      Our Promise
                    </h4>
                    <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                      We respond within 24 hours — always.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 3rem',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border-subtle)',
          overflow: 'hidden'
        }}
      >
        {/* Background Image */}
        <img
          src="/image7.png?v=2"
          alt="Footer background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'saturate(1.2) brightness(0.7)'
          }}
        />
        {/* Dark Glass Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10, 10, 11, 0.98) 0%, rgba(20, 20, 22, 0.85) 100%)',
            backdropFilter: 'blur(8px)',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)', opacity: 0.5, zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '100px', background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(30px)', zIndex: 2 }} />
        
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 3 }}>
          <p
            className="font-display"
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            Skill<span style={{ color: 'var(--color-accent)', textShadow: '0 0 15px rgba(212,118,78,0.5)' }}>Bridge</span>
          </p>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
            }}
          >
            Built with purpose. Powered by revolution.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <button
              onClick={() => scrollToSection('mission')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
            >
              Our Mission
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing