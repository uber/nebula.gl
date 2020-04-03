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
        '@babel/react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    es6: {
      presets: ['@babel/env', '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    test: {
      presets: [['@babel/env', { useBuiltIns: 'usage' }], '@babel/react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    }
  }
};
