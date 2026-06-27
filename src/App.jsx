import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Browse from './pages/Browse'
import SellerProfile from './pages/SellerProfile'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/browse" element={
        <ProtectedRoute>
          <Browse/>
        </ProtectedRoute>
      }/>
      <Route path="/sellers/:id" element={
        <ProtectedRoute>
          <SellerProfile/>
        </ProtectedRoute>
      }/>
      <Route path ="/dashboard" element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
    </Routes>
    </>
  )
}

export default App