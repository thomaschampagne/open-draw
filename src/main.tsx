import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppContext, AppContextImpl, IAppContext } from './app.context.ts';
import { IConfig } from './types';
import { StateStorage } from './state.storage.ts';
import App from './App.tsx';

const config: IConfig = {
  dbName: 'open-draw',
  saveDebounceMs: 500
};

const appContext: IAppContext = new AppContextImpl(config, new StateStorage());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContext.Provider value={appContext}>
      <App />
    </AppContext.Provider>
  </StrictMode>
);
