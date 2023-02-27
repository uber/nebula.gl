module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'import', '@typescript-eslint', 'react', 'react-hooks', 'tree-shaking'],
  extends: [
    'eslint-config-uber-jsx',
    'eslint-config-uber-es2015',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'callback-return': 'off',
    complexity: 'off',
    'max-statements': 'off',
    'no-return-assign': 'off',
    'func-style': 'error',
    'prettier/prettier': ['error', { usePrettierrc: true }],
    'react/no-multi-comp': 'off',
    'react/sort-comp': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/no-unescaped-entities': 'warn',
    'sort-imports': 'off',
    'max-depth': ['warn', 4],

    /* This is needed for class property function declarations */
    'no-invalid-this': 'off',

    /* Style guide */
    'spaced-comment': 0,
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': 'error',
    'import/order': 'error',
    'import/newline-after-import': 'error',

    // Those are rules for typescript migration
    // TODO: run --fix for all modules
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-inline-comments': 0,
    // TODO: Please remove these rules and fix eslint error when possible
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: false,
      },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 'warn',

    // produces too much noise ATM
    '@typescript-eslint/no-explicit-any': 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn', { hoist: 'never', ignoreOnInitialization: true }],

    /* Use the 'query-string' module instead */
    'no-restricted-imports': ['error', 'querystring'],

    // try to improve tree shaking
    'tree-shaking/no-side-effects-in-initialization': [
      'off',
      {
        noSideEffectsWhenCalled: [
          { function: 'Object.freeze' },
          {
            module: 'react',
            functions: ['createContext', 'createRef'],
          },
        ],
      },
    ],
  },
  globals: {
    vi: true,
    Buffer: true,
    window: true,
  },
  env: {
    // Support global Jest variables (test, expect, etc.)
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
