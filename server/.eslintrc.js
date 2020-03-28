module.exports = {
  extends: [
    "@moritzruth",
    "@moritzruth/eslint-config/typescript"
  ],
  env: {
    node: true,
    browser: false
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-extra-parens": "off", // doesn't work with no-mixed-operators
    "max-len": ["warn", { code: 180 }],
    "unicorn/prevent-abbreviations": ["warn", {
      whitelist: {
        args: true,
        Args: true
      }
    }]
  },
  overrides: [
    {
      files: ["src/data/resolvers/*"],
      rules: {
        "class-methods-use-this": "off",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-parameter-properties": "off"
      }
    }
  ]
};
