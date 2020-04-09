module.exports = {
  env: {
    es5: {
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs'
          }
        ],
        '@babel/react',
        '@babel/preset-typescript'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    es6: {
      presets: ['@babel/env', '@babel/react', '@babel/preset-typescript'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    test: {
      presets: [['@babel/env'], '@babel/react', '@babel/preset-typescript'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    }
  }
};
