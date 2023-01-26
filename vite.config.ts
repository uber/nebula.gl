import { builtinModules } from 'module';
import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import cp from 'vite-plugin-cp';

// vite config for building nebula lib modules https://vitejs.dev/config/
export default defineConfig((env) => {
  const viteBuildConfig: UserConfig = {
    build: {
      // clean dist dir before build
      emptyOutDir: true,
      outDir: 'dist',
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      // TODO: Rollup warns about builins https://github.com/visgl/loaders.gl/issues/2000
      rollupOptions: {
        external: builtinModules,
      },
    },
    plugins: [
      // generate types
      dts({ rollupTypes: true }),
    ],
  };

  // copy /README.md into module dir if necessary
  const hasOwnReadme =
    process.cwd().endsWith('react-map-gl-draw') || process.cwd().endsWith('overlays');
  if (!hasOwnReadme) {
    viteBuildConfig.plugins.push(cp({ targets: [{ src: '../../README.md', dest: './' }] }));
  }

  return viteBuildConfig;
});
