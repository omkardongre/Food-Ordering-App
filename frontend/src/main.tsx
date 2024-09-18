import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.tsx';
import Auth0ProviderNavigate from './auth/Auth0ProviderNavigate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Auth0ProviderNavigate>
        <AppRoutes />
      </Auth0ProviderNavigate>
    </Router>
  </StrictMode>
);
