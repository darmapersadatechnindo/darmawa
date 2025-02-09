import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { TitleProvider } from './components/config/TitleContext.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <TitleProvider>
      <App />
    </TitleProvider>
  </BrowserRouter>
)
