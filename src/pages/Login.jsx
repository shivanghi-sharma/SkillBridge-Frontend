import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { motion, MotionButton } from '../components/motion'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return
    setLoading(true)

    try {
      const loggedInUser = await login(formData.email, formData.password)
      toast.success('Login successful!')
      if (loggedInUser.role === 'buyer') {
        navigate('/browse')
      } else {
        navigate('/profile')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-split-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
      
      {/* Left Panel - Hidden on Mobile */}
      <div className="login-left-panel" style={{ width: '45%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
        <img 
          src="/signin.png" 
          alt="Sign in background" 
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

      {/* Right Panel - Form */}
      <div className="login-right-panel" style={{ width: '55%', display: 'flex', flexDirection: 'column', padding: '2.5rem 4rem', position: 'relative', overflowY: 'auto' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem', marginBottom: 'auto' }}>
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div style={{ maxWidth: 440, width: '100%', margin: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Continue with your email or username
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
              Enter your details below to sign in to your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Email or Username</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input-field input-field--boxed"
                  style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem' }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '0.5rem' }}>
                <label className="input-label" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="input-field input-field--boxed"
                    style={{ backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)', padding: '0.875rem 1rem', paddingRight: '2.5rem' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <Link to="#" style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              <MotionButton
                type="submit"
                disabled={!isFormValid || loading}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontSize: '1rem', 
                  borderRadius: '0.75rem',
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
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </MotionButton>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                Create one
              </Link>
            </p>
          </motion.div>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            By joining, you agree to the{' '}
            <Link to="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Terms of Service</Link>{' '}
            and{' '}
            <Link to="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-split-page {
            flex-direction: column !important;
          }
          .login-left-panel {
            display: none !important;
          }
          .login-right-panel {
            width: 100% !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Login