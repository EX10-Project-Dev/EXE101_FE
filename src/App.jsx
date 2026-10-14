import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

function LandingLayout() {
  return <><LandingPage /><Outlet /></>
}

function AuthDialog({ pendingFlow, isSignup = false }) {
  const navigate = useNavigate()
  const close = () => navigate('/', { replace: true })

  return (
    <Dialog
      open
      onClose={close}
      aria-labelledby="auth-title"
      maxWidth={false}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(30, 24, 20, 0.3)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)' } },
        paper: { className: 'auth-dialog', sx: { width: '1100px', maxWidth: 'calc(100% - 48px)', maxHeight: 'calc(100dvh - 48px)', margin: '24px', borderRadius: '16px', backgroundImage: 'none', boxShadow: '0 24px 90px rgba(30, 24, 20, 0.22)', '@media (max-width: 768px)': { maxWidth: 'calc(100% - 24px)', maxHeight: 'calc(100dvh - 24px)', margin: '12px', borderRadius: '12px' } } },
      }}
    >
      <LoginPage pendingFlow={pendingFlow} isSignup={isSignup} onClose={close} />
    </Dialog>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={null} />
          <Route path="/login" element={<AuthDialog />} />
          <Route path="/forgot-password" element={<AuthDialog pendingFlow="recovery" />} />
          <Route path="/register" element={<AuthDialog isSignup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
