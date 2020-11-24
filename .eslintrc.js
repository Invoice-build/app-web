module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    semi: ['warn', 'never'],
    camelcase: 'off',
    curly: 'off',
    'no-console': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'import/namespace': ['error', { allowComputed: true }],
    'vue/max-attributes-per-line': ['warn', {
      singleline: 3,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    'vue/singleline-html-element-content-newline': ['warn', {
      ignores: ['nuxt-link', 'span']
    }],
    'vue/component-tags-order': ['warn', {
      order: ['template', 'script', 'style']
    }],
    'vue/no-deprecated-filter': ['off']
  }
}
