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

// Recupera automaticamente de "Failed to fetch dynamically imported module":
// acontece quando um novo deploy troca os hashes dos arquivos JS enquanto o
// usuário ainda está com a página aberta em uma versão antiga. O Vite
// dispara este evento nesse cenário; recarregamos a página uma única vez
// (guardado via sessionStorage para nunca entrar em loop) em vez de deixar
// a tela travada com o erro. Não altera nenhuma lógica de negócio.
window.addEventListener('vite:preloadError', () => {
  const RELOAD_FLAG = 'meu_estudo_chunk_reload';
  if (!sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, '1');
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Depois que a página carrega estável, libera a trava de reload: se um novo
// deploy quebrar os chunks de novo mais tarde nesta mesma aba, a
// recuperação automática acima continua funcionando (não fica presa após
// o primeiro incidente).
window.setTimeout(() => {
  sessionStorage.removeItem('meu_estudo_chunk_reload');
}, 10000);
