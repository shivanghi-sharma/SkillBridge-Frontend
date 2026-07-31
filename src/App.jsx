import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/motion'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Browse from './pages/Browse'
import SellerProfile from './pages/SellerProfile'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import AdminDisputes from './pages/AdminDisputes'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const location = useLocation()
  
  // Hide footer on full-height app pages
  const hideFooterRoutes = ['/chat', '/dashboard', '/admin']
  const shouldShowFooter = !hideFooterRoutes.some(route => location.pathname.startsWith(route))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition><Landing /></PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition><Login /></PageTransition>
            } />
            <Route path="/register" element={
              <PageTransition><Register /></PageTransition>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Profile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/browse" element={
              <ProtectedRoute>
                <PageTransition><Browse /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/sellers/:id" element={
              <ProtectedRoute>
                <PageTransition><SellerProfile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageTransition><Dashboard /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/chat/:bookingId" element={
              <ProtectedRoute>
                <PageTransition><Chat /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/admin/disputes" element={
              <ProtectedRoute><PageTransition><AdminDisputes /></PageTransition></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  )
}

export default App