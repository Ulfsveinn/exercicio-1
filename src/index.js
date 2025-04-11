import React from 'react';
import ReactDOM from 'react-dom/client'; // <- ALTERADO AQUI
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root')); // <- Mantido para React 18
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver o App com BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Medir performance do app (opcional)
reportWebVitals();
