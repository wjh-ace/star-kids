import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Root element not found. Ensure index.html contains <div id="root"></div>.'
  )
}

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
