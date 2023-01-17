// require('core-js/stable');

// module.exports = {
//   verbose: true,
//   testURL: 'http://localhost/',
//   collectCoverageFrom: ['modules/*/src/**/*.{ts,tsx}', '!**/node_modules/**'],
//   testPathIgnorePatterns: ['/node_modules/', '/website/'],
//   preset: 'ts-jest',
// };

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
