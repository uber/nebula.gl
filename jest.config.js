require('core-js/stable');

module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverageFrom: ['modules/*/src/**/*.{ts,tsx}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/website/'],
  preset: 'ts-jest',
};
