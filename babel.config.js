module.exports = {
  env: {
    es5: {
      presets: ['@babel/preset-typescript', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    es6: {
      presets: ['@babel/preset-typescript', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    test: {
      presets: ['@babel/preset-typescript', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    }
  }
};
