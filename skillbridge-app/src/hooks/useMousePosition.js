/* ============================================================
   useMousePosition – returns normalised mouse coordinates
   Values range from -1 to 1 with (0,0) at viewport centre.
   Used for the parallax effect on the 3D background.
   ============================================================ */
import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalise to -1…1 range relative to viewport centre
      setPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};
