import { defineConfig, UserConfig } from 'vite';
import { builtinModules } from 'module';
import { makeLocalDevConfig } from '../vite.config.local';
const { alias } = makeLocalDevConfig(__dirname);

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteBuildConfig: UserConfig = {
    // use local development overrides in mode == 'localdev'
    resolve: env.mode == 'localdev' ? { alias } : {},
    root: 'src',
    server: { open: true },
    build: {
      emptyOutDir: true,
      outDir: '../dist',
      sourcemap: true,
      rollupOptions: {
        external: builtinModules,
      },
    },
    define: {
      'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken),
      requireFromFile: null,
      readdir: null,
      fstat: null,
      'process.platform': null,
      'process.version': null,
    },
  };
  return viteBuildConfig;
});
