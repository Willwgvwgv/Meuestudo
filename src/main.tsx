import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Initialize Sentry with strict privacy safeguards
Sentry.init({
  dsn: 'https://792652943def96db0db1b2f11e2ebb0c@o4511831445536768.ingest.de.sentry.io/4512059281375312',
  sendDefaultPii: false,
  // Desativa envio de dados pessoais e corpos de requisição para proteger a privacidade dos usuários
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
  beforeSend(event) {
    // Remove any user emails or identities if accidentally attached
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.ip_address;
    }
    return event;
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
