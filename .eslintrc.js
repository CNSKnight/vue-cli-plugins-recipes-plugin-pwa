// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', '@vue/prettier', 'plugin:lodash-fp/recommended'],
  plugins: ['lodash', 'lodash-fp', 'vue'],
  parserOptions: {parser: 'babel-eslint', ecmaVersion: 2017, sourceType: 'module'},
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'warn',
    'lodash-fp/use-fp': 'warn',
    'lodash-fp/no-unused-result': 'warn',
  },
};
