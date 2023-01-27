import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import cp from 'vite-plugin-cp';
import nodeExternals from 'rollup-plugin-node-externals';
import { visualizer } from 'rollup-plugin-visualizer';

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
    },
    plugins: [
      // do not bundle npm dependencies, peerDependencies and optionalDependencies
      {
        ...nodeExternals({
          peerDeps: true,
          include: /^@nebula\.gl/,
        }),
        enforce: 'pre',
      },
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

  // Visualize and analyze your Rollup bundle to see which modules are taking up space
  // set ROLLUP_VISUALIZER=1 env var to enable generating rollup_stats.html
  if (process.env['ROLLUP_VISUALIZER']) {
    viteBuildConfig.plugins.push(
      visualizer({
        filename: 'rollup_stats.html',
        // template: 'list',
        gzipSize: true,
        sourcemap: true,
      })
    );
  }

  return viteBuildConfig;
});
