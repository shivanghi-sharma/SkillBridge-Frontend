import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { FadeInSection, motion } from './motion';

const services = [
  { id: 1, title: 'Web Development', image: '/image1.png', color: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
  { id: 2, title: 'Graphic Design', image: '/image2.png', color: 'linear-gradient(135deg, #064e3b, #10b981)' },
  { id: 3, title: 'Digital Marketing', image: '/image3.png', color: 'linear-gradient(135deg, #701a75, #d946ef)' },
  { id: 4, title: 'Video Editing', image: '/image4.png', color: 'linear-gradient(135deg, #7f1d1d, #ef4444)' },
  { id: 5, title: 'Content Writing', image: '/image5.png', color: 'linear-gradient(135deg, #14532d, #22c55e)' },
  { id: 6, title: 'AI Services', image: '/image6.png', color: 'linear-gradient(135deg, #4c1d95, #8b5cf6)' },
];

const PopularServices = () => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: 'clamp(4rem, 10vh, 8rem) 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeInSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Popular Services
            </h2>
            <button
              onClick={scrollRight}
              className="btn-outline-futuristic"
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '2rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            }}
            className="hide-scrollbar"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -5 }}
                style={{
                  minWidth: '260px',
                  height: '340px',
                  backgroundColor: '#141416',
                  borderRadius: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  className="service-card-img"
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />
                <div style={{ position: 'relative', padding: '1.5rem', zIndex: 1 }}>
                  <h3 className="font-display" style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: '#ffffff', 
                    lineHeight: 1.2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}>
                    {service.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInSection>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .service-card-img:hover {
          transform: scale(1.05) translate(-5px, -5px);
        }
      `}</style>
    </section>
  );
};

export default PopularServices;
