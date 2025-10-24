import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </StrictMode>,
)