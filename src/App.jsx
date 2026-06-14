import {Routes , Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Landing from './pages/Landing'
import BuyerHome from './pages/BuyerHome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={
         <ProtectedRoute>
          <Profile/>
         </ProtectedRoute>
      }/>
      <Route path="/home" element={
         <ProtectedRoute>
          <BuyerHome/>
         </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App