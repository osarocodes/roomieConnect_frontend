import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerSW({
  onNeedRefresh() {
    console.log('New content available, refreshing...');
  },
  onOfflineReady() {
    // You can replace this with a custom UI notification as needed
    alert('App is ready to work offline');
    // Alternatively, implement a custom notification component here
  },
});