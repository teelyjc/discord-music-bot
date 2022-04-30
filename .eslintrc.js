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

    'no-unused-vars': 'off',

    'no-undef': 'off',

    'no-array-constructor': 'off',

    camelcase: 'off',

    'padded-blocks': [
      'error',
      { classes: 'always' },
    ],

    // except empty line after atrribute scope variable declarations
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
};
