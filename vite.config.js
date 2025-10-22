import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

codex/create-bilingual-rsvp-page-for-kln-party-h46k7u
export default defineConfig(({ command }) => {
  const isProdBuild = command === 'build';

  return {
    // GitHub Pages hosts the site from a subfolder, so production builds need
    // relative asset URLs. Local development keeps Vite's default root base.
    base: isProdBuild ? './' : '/',
    plugins: [react()],
    server: {
      port: 5173,
    },
  };

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
main
});
