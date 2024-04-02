/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    es2024: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      'typescript-bun': {
        project: true,
        alwaysTryTypes: true,
      },
    },
  },
  plugins: [
    'json-format',
    '@typescript-eslint',
    'import',
    'no-secrets',
    'simple-import-sort',
    'drizzle',
    'lodash',
    'unused-imports',
  ],
  extends: [
    // Airbnb
    'airbnb-base',
    'airbnb-typescript/base',

    // TypeScript
    'plugin:@typescript-eslint/recommended',

    // Code Quality
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',

    // Security
    'plugin:security/recommended-legacy',

    // Misc
    'plugin:promise/recommended',
    'plugin:drizzle/recommended',
    'plugin:lodash/recommended',

    // Imports
    'plugin:import/recommended',
    'plugin:import/typescript',

    // Prettier
    'plugin:prettier/recommended',
  ],
  rules: {
    // No secrets
    'no-secrets/no-secrets': 'error',

    // Simple import sort
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // Drizzle
    'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: ['db'] }],
    'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: ['db'] }],

    // The following rules are disabled due to clashing with other plugins
    'import/order': 'off',
    'sort-imports': 'off',

    // Lodash
    'lodash/import-scope': [2, 'member'],
    'lodash/prefer-lodash-method': [2, { ignoreObjects: ['^.*Collection', 'cache'] }],

    // Remove unused imports
    // Remove unused imports
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Misc
    'unicorn/filename-case': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'new-cap': 'off',
    'class-methods-use-this': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
};

module.exports = config;
