import React from 'react';
import { Users, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { FadeInSection, motion } from './motion';

const features = [
  { icon: Users, text: "Access a pool of top talent" },
  { icon: Zap, text: "Simple, easy matching" },
  { icon: ShieldCheck, text: "Fast quality work" },
  { icon: CreditCard, text: "Pay only when you're happy" }
];

const FeatureHighlights = () => {
  return (
    <section style={{ padding: '4rem 1.5rem', backgroundColor: 'var(--color-surface)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2rem',
          textAlign: 'center'
        }}>
          {features.map((feature, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '2rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border-subtle)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)'
                }}>
                  <feature.icon size={32} />
                </div>
                <h4 className="font-display" style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}>
                  {feature.text}
                </h4>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
