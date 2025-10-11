import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/normalize.css';
import './assets/global.css';
import App from './App.jsx'
import { AuthProvider } from './context/auth/auth_context.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
