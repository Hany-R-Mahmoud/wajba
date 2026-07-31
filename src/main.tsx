import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import {PwaProvider} from './pwa/PwaContext';
import {restoreHashFromLocation} from './pwa/pwa';

restoreHashFromLocation();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <PwaProvider>
        <App />
      </PwaProvider>
      <Analytics />
    </>
  </StrictMode>,
);
