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
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Explore from './pages/Explore';
import SellerProfile from './pages/SellerProfile';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';


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
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Site-wide footer with registration form */}
      <Footer />
    </div>
  );
};

export default App;