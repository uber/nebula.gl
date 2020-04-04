module.exports = {
  printWidth: 100,
  singleQuote: true,
  overrides: [
    // this must match codesandbox config
    {
      files: ['examples/codesandbox/**/*.js', 'examples/getting-started/*.js'],
      options: {
        printWidth: 80,
        singleQuote: false,
      },
    },
  ],
};
