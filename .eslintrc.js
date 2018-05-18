// @flow
module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype', 'prettier', 'babel', 'import'],
  extends: [
    'eslint-config-uber-jsx',
    'eslint-config-uber-es2015',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype'
  ],
  rules: {
    'callback-return': 'off',
    complexity: 'off',
    'max-statements': 'off',
    'no-return-assign': 'off',
    'flowtype/semi': ['error', 'always'],
    'func-style': 'error',
    'prettier/prettier': 'error',
    'react/no-multi-comp': 'off',
    'react/sort-comp': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'sort-imports': 'off',

    /* This is needed for class property function declarations */
    'no-invalid-this': 'off',
    'babel/no-invalid-this': 'error',

    /* Style guide */
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': 'error',
    'import/order': 'error',
    'import/newline-after-import': 'error',

    /* Ignore rules conflicting with prettier */
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-indent': 'off',
    'func-style': 'off',

    /* Use the 'query-string' module instead */
    'no-restricted-imports': ['error', 'querystring']
  },
  globals: {
    Buffer: true
  },
  env: {
    // Support global Jest variables (test, expect, etc.)
    jest: true
  }
};
