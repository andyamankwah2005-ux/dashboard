import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/style.css';
import './styles/admin.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

