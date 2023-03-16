const { join } = require('path');
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    project: join(__dirname, './tsconfig.json'),
    sourceType: 'module',
  },
  plugins: ['rxjs'],
  extends: [],
  rules: {
    'rxjs/no-async-subscribe': 'error',
    'rxjs/no-ignored-observable': 'error',
    'rxjs/no-ignored-subscription': 'error',
    'rxjs/no-nested-subscribe': 'error',
    'rxjs/no-unbound-methods': 'error',
    'rxjs/throw-error': 'error',
    'rxjs/finnish': 'error',
  },
};
