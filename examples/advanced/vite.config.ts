import { builtinModules } from 'module';
import { defineConfig, UserConfig } from 'vite';
import { makeLocalDevConfig } from '../vite.config.local';

const { alias } = makeLocalDevConfig(__dirname);

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteBuildConfig: UserConfig = {
    // use local development overrides in mode == 'localdev'
    resolve: env.mode === 'localdev' ? { alias } : {},
    root: 'src',
    server: { open: true },
    build: {
      emptyOutDir: true,
      outDir: '../dist',
      sourcemap: true,
      // TODO: Rollup warns about builins https://github.com/visgl/loaders.gl/issues/2000
      rollupOptions: {
        external: builtinModules,
      },
    },
    define: {
      'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken),
    },
  };
  return viteBuildConfig;
});
