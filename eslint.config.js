// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactCompiler = require('eslint-plugin-react-compiler');
const reactNative = require('eslint-plugin-react-native');
const noRelativeImportPaths = require('eslint-plugin-no-relative-import-paths');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  reactCompiler.configs.recommended,
  {
    ignores: ["dist/*", "**/speedCache.ts"],
  },
  {
    plugins: {
      'react-native': reactNative,
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': ['error', { prefix: '@' }],
      'curly': ['error', 'all'],
      'react-native/no-unused-styles': 'error',
      'react-native/no-raw-text': ['error', { skip: ['AssistantText', 'MaskedText'] }],
      'react-native/no-single-element-style-arrays': 'error',
    }
  }
]);
