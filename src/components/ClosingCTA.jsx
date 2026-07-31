import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeInSection, motion } from './motion';
import { useAuth } from '../context/AuthContext';

const ClosingCTA = () => {
  const { user } = useAuth();

  return (
    <section style={{ 
      padding: 'clamp(5rem, 12vh, 10rem) 1.5rem', 
      backgroundColor: 'var(--color-surface-overlay)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center'
    }}>
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.5 }}>
        <div className="hero-orb hero-orb--1" style={{ top: '-20%', left: '-10%' }} />
        <div className="hero-orb hero-orb--2" style={{ bottom: '-20%', right: '-10%' }} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeInSection>
          <h2 className="font-display" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
            marginBottom: '1.5rem'
          }}>
            Ready to Build Your <span className="text-glow" style={{ color: 'var(--color-accent)' }}>Future</span>?
          </h2>
        </FadeInSection>
        
        <FadeInSection delay={0.1}>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            Join the revolution today and connect with top talent or find your next big opportunity.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-block' }}
          >
            <Link
              to={user ? '/browse' : '/register'}
              className="btn-futuristic"
              style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
            >
              Get Started Now
              <motion.span
                style={{ display: 'inline-flex' }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </Link>
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default ClosingCTA;
