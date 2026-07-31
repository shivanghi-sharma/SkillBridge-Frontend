import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ─── Page Transition Wrapper ───
// Wraps each route for smooth fade on enter/exit (~250ms)
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ─── AnimatePresence wrapper for Routes ───
// Use in App.jsx to wrap <Routes> for exit animations
export const RouteTransition = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Scroll-triggered Fade In Section ───
// Fades + slides up when entering viewport
export const FadeInSection = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  style = {},
  ...props
}) => {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger Container ───
// Parent container that staggers children entrance
export const StaggerContainer = ({
  children,
  staggerDelay = 0.06,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger Item ───
// Child of StaggerContainer — fades + slides up
export const StaggerItem = ({
  children,
  className = '',
  style = {},
  hover = false,
  ...props
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: 'easeOut' },
        },
      }}
      whileHover={hover ? { scale: 1.02, y: -2, transition: { duration: 0.2 } } : undefined}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated Counter ───
// Counts up from 0 to target number on mount
export const AnimatedCounter = ({ value, duration = 0.8, className = '', style = {} }) => {
  const ref = useRef(null)
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v))

  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) {
      // Not a number — render as text
      if (ref.current) ref.current.textContent = value
      return
    }

    const controls = animate(motionVal, numValue, {
      duration,
      ease: 'easeOut',
    })

    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = v
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, duration, motionVal, rounded])

  return <span ref={ref} className={className} style={style}>0</span>
}

// ─── Motion Button ───
// Button with hover scale + tap spring
export const MotionButton = ({
  children,
  className = '',
  style = {},
  hoverScale = 1.03,
  tapScale = 0.97,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ─── Motion Link ───
// For Link components that need hover/tap animation
export const MotionLink = motion.create ? motion.create('a') : motion('a')

// ─── Motion Div (convenience re-export) ───
export const MotionDiv = motion.div

// Re-export AnimatePresence for convenience
export { AnimatePresence, motion }
