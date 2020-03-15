const path = require("path");

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  extends: "@moritzruth",
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve(__dirname, "./webpack.resolve.js")
      }
    }
  },
  rules: {
    "unicorn/filename-case": "off",
    "nuxt/no-cjs-in-config": "off"
  },
  overrides: [
    {
      files: ["webpack.resolve.js", "nuxt.config.js", "ormconfig.js"],
      env: {
        node: true,
        es6: true,
        browser: false
      },
      extends: "@moritzruth",
      settings: {
        "import/resolver": {
          node: {}
        }
      },
      rules: {
        "unicorn/prevent-abbreviations": ["warn", {
          whitelist: {
            ctx: true
          }
        }]
      }
    },
    {
      files: "*.vue",
      extends: [
        "plugin:nuxt/recommended",
        "@moritzruth",
        "@moritzruth/eslint-config/vue"
      ],
      rules: {
        "vue/no-unused-components": "warn",
        "no-extra-parens": "off" // This does'nt work with some other rules
      },
      parserOptions: {
        parser: "babel-eslint"
      }
    }
  ]
};
