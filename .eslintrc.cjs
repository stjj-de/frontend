require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-standard-with-typescript'
  ],
  rules: {
    "@typescript-eslint/quotes": ["warn", "double"],
    "@typescript-eslint/triple-slash-reference": "off"
  }
}
