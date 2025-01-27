// import dotevn from 'dotenv';
// dotevn.config();
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
// import './index.css'; // Import Tailwind CSS
import './components/style.css'; // Import custom CSS

const container = document.getElementById('root');
const root = createRoot(container);
// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
// const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

root.render(
  <Auth0Provider
    domain="dev-rvxcvpcihwvt4r2x.us.auth0.com"
    clientId="9UlkQtPSFyAwoXSmD2Ec5D14UiV3g6i4"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);