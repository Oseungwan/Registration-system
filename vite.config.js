import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Use relative asset URLs when building for GitHub Pages so files load from the
  // repository subdirectory, but keep the default base during local development.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
