import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Provider store={store}>
       
       <App />
      {/* Global Toaster */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "10px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        success: {
          iconTheme: {
            primary: "#ec4899", // Tailwind pink
            secondary: "#fff",
          },
        },
      }}
    />

    </Provider>
  </StrictMode>,
)
