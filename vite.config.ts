import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { builtinModules } from 'node:module';

// https://vitejs.dev/config/
// vite config for building nebula lib modules
export default defineConfig((env) => {
  const viteBuildConfig: UserConfig = {
    build: {
      emptyOutDir: true,
      outDir: 'dist',
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: builtinModules,
      },
    },
    plugins: [
      dts({
        rollupTypes: true,
      }),
    ],
  };
  return viteBuildConfig;
});
