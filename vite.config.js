import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isProdBuild = command === 'build';

  return {
    // GitHub Pages serves the app from a project subdirectory, so the
    // production bundle needs relative asset URLs. Local development can
    // continue using the default root base path.
    base: isProdBuild ? './' : '/',
    plugins: [react()],
  };
});