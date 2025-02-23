import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// import App from './App.jsx'
import { App } from './app'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
