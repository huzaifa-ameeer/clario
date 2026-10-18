import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import ToastNotification from './components/ToastNotification.jsx'

function App() {
  const location = useLocation()
  const hideNavbar = ['/login', '/signup', '/forgot-password', '/verify-otp'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastNotification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
