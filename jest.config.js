module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverageFrom: ['modules/*/src/**/*.js', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/website/']
};
