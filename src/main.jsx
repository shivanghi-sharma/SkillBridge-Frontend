import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-sans)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                },
                success: {
                  iconTheme: {
                    primary: '#3ecf8e',
                    secondary: '#1c1c1f',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#1c1c1f',
                  },
                },
              }}
            />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)