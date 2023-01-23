import { defineConfig } from 'vite';
import { makeLocalDevConfig } from '../vite.config.local';
const { alias } = makeLocalDevConfig(__dirname);

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return {
    // use local development overrides in mode == 'localdev'
    resolve: env.mode == 'localdev' ? { alias } : {},
    root: 'src',
    server: { open: true },
    define: {
      'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken),
      requireFromFile: null,
      readdir: null,
      fstat: null,
      'process.platform': null,
      'process.version': null,
    },
  };
});
