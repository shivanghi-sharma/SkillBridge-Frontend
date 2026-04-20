/* ============================================================
   NotFound (404) Page – beautiful glassmorphism error page
   with gradient text, animated elements, and a back-to-home
   button.
   ============================================================ */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';

const NotFound = () => (
  <PageTransition>
    <section className="min-h-screen flex items-center justify-center section-padding relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-pink-600/6 blur-[100px]" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-[120px] sm:text-[180px] font-extrabold gradient-text-hero leading-none font-[var(--font-heading)] select-none">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-[var(--font-heading)]">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            Oops! The page you're looking for seems to have drifted into another dimension. Let's get you back on track.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <FiHome className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>

          <Link to="/explore">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-purple-500/30 text-purple-300 font-semibold text-sm hover:bg-purple-500/10 transition-colors cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              Explore Skills
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-400/40"
              initial={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                opacity: 0,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.7,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  </PageTransition>
);

export default NotFound;
