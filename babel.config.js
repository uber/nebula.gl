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
        '@babel/flow'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    es6: {
      presets: ['@babel/env', '@babel/react', '@babel/flow'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    test: {
      presets: ['@babel/env', '@babel/react', '@babel/flow'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline',
        'istanbul'
      ]
    }
  }
};

/*

const TARGETS = {
  chrome: '60',
  edge: '15',
  firefox: '53',
  ios: '10.3',
  safari: '10.1',
  node: '8'
};

module.exports = {
  comments: false,
  env: {
    es5: {
      presets: [
        [
          '@babel/env',
          {
            forceAllTransforms: true,
            modules: 'commonjs'
          }
        ],
        '@babel/flow',
        '@babel/react'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/transform-runtime',
        'version-inline'
      ]
    },
    esm: {
      presets: [
        [
          '@babel/env',
          {
            forceAllTransforms: true,
            modules: false
          }
        ],
        '@babel/flow',
        '@babel/react'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        ['@babel/transform-runtime', { useESModules: true }],
        'version-inline'
      ]
    },
    es6: {
      presets: [
        [
          '@babel/env',
          {
            targets: TARGETS,
            modules: false
          }
        ],
        '@babel/flow',
        '@babel/react'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        ['@babel/transform-runtime', { useESModules: true }],
        'version-inline'
      ]
    },
    test: {
      plugins: ['istanbul']
    }
  }
};

*/
