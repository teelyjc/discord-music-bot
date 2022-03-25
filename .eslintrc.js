module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // allow console logging for nodejs
    'no-console': 'off',

    'class-methods-use-this': 'off',

    'import/prefer-default-export': 'off',

    'import/no-unresolved': 'off',

    'padded-blocks': [
      'error',
      { classes: 'always' },
    ],

    'object-curly-newline': 'off',

    'lines-between-class-members': 'off',

    'no-unused-vars': 'off',

    // except empty line after atrribute scope variable declarations
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
};
