module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'semi': 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'keyword-spacing': 0,
    'object-curly-spacing': 0
  }
}
