/* ============================================================
   Toast – animated notification component
   Shows success/error/info messages with auto-dismiss,
   slide-in animation, and glassmorphism styling.
   ============================================================ */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const toastConfig = {
  success: {
    icon: FiCheckCircle,
    borderColor: 'border-green-500/40',
    iconColor: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  error: {
    icon: FiAlertCircle,
    borderColor: 'border-red-500/40',
    iconColor: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  info: {
    icon: FiInfo,
    borderColor: 'border-blue-500/40',
    iconColor: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
};

const Toast = ({ message, type = 'success', onClose }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border ${config.borderColor} ${config.bg} backdrop-blur-xl shadow-2xl max-w-sm`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
          <p className="text-sm text-white font-medium flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
