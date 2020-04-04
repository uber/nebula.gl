
module.exports = {
  
  "parser": "@typescript-eslint/parser",
  plugins: [ 'prettier', 'babel', 'import', "@typescript-eslint", 'react'],
  extends: [
    'eslint-config-uber-jsx',
    'eslint-config-uber-es2015',
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    'prettier'
  ],
  rules: {
    'callback-return': 'off',
    complexity: 'off',
    'max-statements': 'off',
    'no-return-assign': 'off',
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
    'import/extensions': 'off',

    // Those are rules for migration
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-empty-function":0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "no-inline-comments":0,
    "spaced-comment":0,
    "@typescript-eslint/no-use-before-define":0,
    "@typescript-eslint/camelcase":0,

    /* Ignore rules conflicting with prettier */
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-indent': 'off',
    'func-style': 'off',

    /* Use the 'query-string' module instead */
    'no-restricted-imports': ['error', 'querystring']
  },
  globals: {
    Buffer: true,
    window:true
  },
  env: {
    // Support global Jest variables (test, expect, etc.)
    jest: true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
