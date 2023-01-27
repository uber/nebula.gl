import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      include: ['modules/*/src/**/*.{ts,tsx}', '!**/node_modules/**'],
    },
    exclude: [...configDefaults.exclude, 'website'],
    environment: 'jsdom',
    globals: true,
  },
});
