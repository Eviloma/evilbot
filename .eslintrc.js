module.exports = {
  extends: [
    // Airbnb
    'airbnb-base',
    'airbnb-typescript/base',

    // TypeScript
    'plugin:@typescript-eslint/recommended',

    // Extended
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',

    // Security
    'plugin:security/recommended-legacy',
    'plugin:xss/recommended',

    // Others
    'plugin:lodash/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',

    // Prettier
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['import', '@typescript-eslint', 'no-secrets', 'simple-import-sort', 'prettier', 'lodash'],
  root: true,
  rules: {
    // no-secrets plugin
    'no-secrets/no-secrets': 'error',

    // simple-import-sort plugin
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // lodash
    'lodash/import-scope': [2, 'member'],
    'lodash/prefer-lodash-method': [2, { ignoreObjects: ['router', 'window.location', 'cache', 'commands', 'channels'] }],

    // The following rules are disabled due to them being considered unduly restrictive or unhelpful.
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-number-properties': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/prevent-abbreviations': 'off',

    // The following rules are disabled due to clashing with other plugins
    'import/order': 'off',
    'sort-imports': 'off',

    'import/prefer-default-export': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/filename-case': 'off',
    'class-methods-use-this': 'off',
    'new-cap': 'off',
    'import/no-cycle': 'off',
  },
};
