import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import {PwaProvider} from './pwa/PwaContext';
import {restoreHashFromLocation} from './pwa/pwa';
import {SessionProvider} from './auth/SessionProvider';
import {ErrorBoundary} from './components/AsyncState';

restoreHashFromLocation();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <PwaProvider>
        <ErrorBoundary>
          <SessionProvider>
            <App />
          </SessionProvider>
        </ErrorBoundary>
      </PwaProvider>
      <Analytics />
    </>
  </StrictMode>,
);
