import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
// import './index.css'; // Import Tailwind CSS
import './components/style.css'; // Import custom CSS

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain="your-auth0-domain"
    clientId="your-auth0-client-id"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);