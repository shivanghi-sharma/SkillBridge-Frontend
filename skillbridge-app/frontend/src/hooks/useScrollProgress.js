/* ============================================================
   useScrollProgress – tracks the page scroll percentage
   Used by the scroll progress indicator in the Navbar.
   ============================================================ */
import { useState, useEffect } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Total scrollable height
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Current position as a percentage (0–100)
      const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};