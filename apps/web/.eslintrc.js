// @ts-check
/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'react-app',
    // 'prettier', // uncomment if using prettier eslint integration
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    // __dirname pins the project path to this file's directory (web/),
    // so ESLint always finds tsconfig.json regardless of where it is launched from.
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['react', '@tanstack/query'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@tanstack/query/exhaustive-deps': 'error',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'warn',
    'no-empty': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-nested-ternary': 'off',
    'no-multiple-empty-lines': 'off',
    'no-irregular-whitespace': 'off',
    'react/no-children-prop': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
