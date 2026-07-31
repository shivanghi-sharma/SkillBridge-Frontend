import { Link } from 'react-router-dom'
import { Layers, MessageCircle, Share2, Globe, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border-subtle)',
      padding: '4rem 1.5rem 2rem 1.5rem',
      marginTop: 'auto' // push to bottom if body is short
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        
        {/* Brand Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'var(--color-accent)', color: 'white',
              borderRadius: '8px', padding: '0.3rem'
            }}>
              <Layers size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>Skill</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-accent)' }}>Bridge</span>
            </div>
          </Link>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Connecting professionals and learners worldwide. Share your expertise or master a new skill with top-tier mentors.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/browse" className="footer-link">Browse Skills</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
            <Link to="/login" className="footer-link">Sign In</Link>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Resources</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="#mission" className="footer-link">Our Mission</a>
            <a href="#contact" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Connect with us</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="footer-icon" aria-label="Social"><MessageCircle size={18} /></a>
            <a href="#" className="footer-icon" aria-label="Share"><Share2 size={18} /></a>
            <a href="#" className="footer-icon" aria-label="Website"><Globe size={18} /></a>
            <a href="#" className="footer-icon" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>

      </div>

      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', margin: 0 }}>
          &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
          Built for a better learning experience.
        </p>
      </div>

      <style>{`
        .footer-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: var(--color-accent);
        }
        .footer-icon {
          color: var(--color-text-muted);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--color-surface-raised);
        }
        .footer-icon:hover {
          color: var(--color-text-inverse);
          background-color: var(--color-accent);
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  )
}

export default Footer
