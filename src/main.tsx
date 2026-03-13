import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App, { AuthProvider, ToastProvider } from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
