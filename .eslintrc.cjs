require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-standard-with-typescript"
  ],
  rules: {
    quotes: ["warn", "double"],
    "@typescript-eslint/quotes": ["warn", "double"],
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/space-before-function-paren": ["error", {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }]
  },
  overrides: [
    {
      files: "./src/pages/**/*.vue",
      rules: {
        "vue/multi-word-component-names": "off"
      }
    }
  ]
}
