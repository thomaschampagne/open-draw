import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
   target: ['chrome111', 'edge111', 'firefox114', 'safari16.4']
  }
});
