/* ============================================================
   Login / Register Page
   Uses AuthContext for state management, navigates to
   /dashboard after success, and shows proper error feedback.
   ============================================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    role: '',
  });

  // If already logged in, redirect to dashboard
  if (isLoggedIn) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // ── Login handler ───────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.message || 'Login failed. Please try again.', type: 'error' });
      } else {
        // Use AuthContext login — updates global state + localStorage
        login(data.token, data.user);
        setToast({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Network error. Is the server running?', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ── Register handler ────────────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.message || 'Registration failed.', type: 'error' });
      } else {
        // Use AuthContext login — updates global state + localStorage
        login(data.token, data.user);
        setToast({ message: 'Account created! Welcome to SkillBridge 🎉', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Network error. Is the server running?', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input styles ─────────────────────────────
  const inputClass =
    'w-full pl-11 pr-4 py-3.5 bg-white/5 border border-purple-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all';

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center section-padding pt-24 relative">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-pink-600/6 blur-[100px]" />
        </div>

        <AnimatePresence mode="wait">
          {isLoginMode ? (
            /* ════════════════ LOGIN FORM ════════════════ */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="glass w-full max-w-md p-8 md:p-10 rounded-2xl glow-border relative z-10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2 font-[var(--font-heading)]">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign in to your SkillBridge account
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email */}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.3)' } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full py-3.5 rounded-xl animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-400">
                Not registered?{' '}
                <button
                  onClick={() => setIsLoginMode(false)}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                >
                  Create account
                </button>
              </p>
            </motion.div>
          ) : (
            /* ════════════════ REGISTER FORM ════════════════ */
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="glass w-full max-w-md p-8 md:p-10 rounded-2xl glow-border relative z-10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2 font-[var(--font-heading)]">
                  Join SkillBridge
                </h2>
                <p className="text-gray-400 text-sm">
                  Create your account and start exchanging skills
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Email */}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 6 characters)"
                    required
                    minLength={6}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Role */}
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <select
                    required
                    value={registerData.role}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, role: e.target.value })
                    }
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select Role</option>
                    <option value="buyer">Buyer (I want to learn)</option>
                    <option value="seller">Seller (I want to teach)</option>
                  </select>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.3)' } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full py-3.5 rounded-xl animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setIsLoginMode(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Login;