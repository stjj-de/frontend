module.exports = {
  root: true,
  extends: "awzzm-vue/nuxt",
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: 2018
  },
  rules: {
    "unicorn/no-keyword-prefix": "off",
    "vue/v-on-function-call": ["warn", "never"]
  }
}
