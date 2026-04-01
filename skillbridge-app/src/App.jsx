/* ============================================================
   App.jsx – root application shell
   Composes: SpaceBackground (3D), Navbar, page routes via
   React Router, Footer, and AnimatePresence for route
   transitions. Scrolls to top on every route change.
   ============================================================ */
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import SpaceBackground from './components/SpaceBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

/* ── ScrollToTop – reset scroll position on navigation ─────── */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

/* ── App ────────────────────────────────────────────────────── */
const App = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* 3D animated space background – fixed behind everything */}
      <SpaceBackground />

      {/* Sticky glassmorphism navbar */}
      <Navbar />

      {/* Scroll reset helper */}
      <ScrollToTop />

      {/* Page content with route transitions */}
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Site-wide footer with registration form */}
      <Footer />
    </div>
  );
};

export default App;
