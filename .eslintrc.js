// http://eslint.org/docs/user-guide/configuring
/**
 * Note: package.json > eslintConfig exists for @vue/cli-plugin-eslint,
 *       enabling $ yarn lint
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/prettier',
    'plugin:lodash-fp/recommended',
  ],
  plugins: ['lodash', 'lodash-fp', 'vue'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['**/.*', 'pipeline.js', 'NewRecipeHint.js'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'warn',
    'lodash-fp/use-fp': 'warn',
    'lodash-fp/no-unused-result': 'warn',
    'vue/no-v-html': 'off',
  },
};
