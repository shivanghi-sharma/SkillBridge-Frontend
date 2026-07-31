import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle, Upload } from 'lucide-react'
import { motion, MotionButton, AnimatePresence } from '../components/motion'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    skills: '',
    bio: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Basic validation for enabling submit button
  const isBaseValid = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.password.trim() !== '' && 
                      formData.password === formData.confirmPassword
                      
  const isSellerValid = formData.role === 'buyer' || 
                        (formData.skills.trim() !== '' && formData.bio.trim() !== '' && resume !== null)
                        
  const isFormValid = isBaseValid && isSellerValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return
    setLoading(true)

    try {
      if (formData.role === 'seller') {
        const form = new FormData()
        form.append('name', formData.name)
        form.append('email', formData.email)
        form.append('password', formData.password)
        form.append('role', formData.role)
        form.append('skills', formData.skills)
        form.append('bio', formData.bio)
        if (resume) {
          form.append('resume', resume)
        }
        await api.post('/auth/register', form)
      } else {
        await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      }
      toast.success('Account created successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-split-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      
      {/* Left Panel - Hidden on Mobile */}
      <div className="register-left-panel" style={{ width: '45%', position: 'fixed', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
        <img 
          src="/signin.png" 
          alt="Register background" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        {/* Dark brand overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,11,0.85) 0%, rgba(212,118,78,0.6) 100%)', zIndex: 1 }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '2rem' }}>
            Success starts here.
          </h1>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {['Connect with top-tier professionals', 'Secure, escrow-backed payments', 'Build your career on your terms'].map((text, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', fontSize: '1.125rem', fontWeight: 500 }}
              >
                <CheckCircle size={24} style={{ color: 'var(--color-accent)' }} />
                {text}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer for fixed left panel */}
      <div className="register-left-panel-spacer" style={{ width: '45%', flexShrink: 0 }}></div>

      {/* Right Panel - Form (Scrollable) */}
      <div className="register-right-panel" style={{ width: '55%', display: 'flex', flexDirection: 'column', padding: '2.5rem 4rem', minHeight: '100vh' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
              Join a marketplace built for real skills. Whether you hire or get hired, it starts here.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="input-field input-field--boxed"
                  style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input-field input-field--boxed"
                  style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Min 6 characters"
                      className="input-field input-field--boxed"
                      style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem', paddingRight: '2.5rem' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Confirm</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Repeat password"
                      className="input-field input-field--boxed"
                      style={{ 
                        backgroundColor: 'var(--color-surface-raised)', 
                        border: '1px solid',
                        borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : 'var(--color-border-subtle)', 
                        padding: '0.875rem 1rem', 
                        paddingRight: '2.5rem' 
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>I want to</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    style={{
                      cursor: 'pointer', textAlign: 'center', padding: '0.875rem', borderRadius: '0.75rem',
                      border: '1px solid',
                      borderColor: formData.role === 'buyer' ? 'var(--color-accent)' : 'var(--color-border-subtle)',
                      backgroundColor: formData.role === 'buyer' ? 'rgba(212,118,78,0.1)' : 'var(--color-surface-raised)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: formData.role === 'buyer' ? 'var(--color-accent)' : 'var(--color-text-secondary)', marginBottom: '0.125rem' }}>
                      Hire Skills
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Buyer</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    style={{
                      cursor: 'pointer', textAlign: 'center', padding: '0.875rem', borderRadius: '0.75rem',
                      border: '1px solid',
                      borderColor: formData.role === 'seller' ? 'var(--color-accent)' : 'var(--color-border-subtle)',
                      backgroundColor: formData.role === 'seller' ? 'rgba(212,118,78,0.1)' : 'var(--color-surface-raised)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: formData.role === 'seller' ? 'var(--color-accent)' : 'var(--color-text-secondary)', marginBottom: '0.125rem' }}>
                      Offer Skills
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Seller</p>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {formData.role === 'seller' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="input-group" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                      <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Skills (comma separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required={formData.role === 'seller'}
                        placeholder="e.g. React, Node.js, Design"
                        className="input-field input-field--boxed"
                        style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem' }}
                      />
                    </div>

                    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Short Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required={formData.role === 'seller'}
                        placeholder="Tell us about your experience..."
                        className="input-field input-field--boxed"
                        style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem', minHeight: 80, resize: 'none' }}
                      />
                    </div>

                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Resume / Certificate (PDF)</label>
                      <label
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          padding: '1rem', border: '1px dashed', borderColor: resume ? 'var(--color-accent)' : 'var(--color-border-subtle)',
                          borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-raised)', cursor: 'pointer',
                          color: resume ? 'var(--color-text-primary)' : 'var(--color-text-muted)', fontSize: '0.875rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} required={formData.role === 'seller'} style={{ display: 'none' }} />
                        <Upload size={18} style={{ color: resume ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                        {resume ? resume.name : 'Click to select a PDF file'}
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <MotionButton
                type="submit"
                disabled={!isFormValid || loading}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontSize: '1rem', 
                  borderRadius: '0.75rem',
                  marginTop: '1rem',
                  opacity: (!isFormValid || loading) ? 0.6 : 1,
                  cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer',
                  backgroundColor: (!isFormValid || loading) ? 'var(--color-border)' : 'var(--color-accent)',
                  color: (!isFormValid || loading) ? 'var(--color-text-muted)' : '#fff'
                }}
                hoverScale={(!isFormValid || loading) ? 1 : 1.02}
                tapScale={(!isFormValid || loading) ? 1 : 0.98}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="spinner spinner--sm" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </MotionButton>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            By joining, you agree to the{' '}
            <Link to="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
            and{' '}
            <Link to="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-split-page {
            flex-direction: column !important;
          }
          .register-left-panel, .register-left-panel-spacer {
            display: none !important;
          }
          .register-right-panel {
            width: 100% !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Register