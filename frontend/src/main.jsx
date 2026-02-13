// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; // Import karein

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <AuthProvider> {/* Yahan wrap karein */}
      <App />
    </AuthProvider>
  
);