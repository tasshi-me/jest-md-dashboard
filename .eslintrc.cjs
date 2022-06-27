/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  rules: {
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    // Workaround for https://github.com/mysticatea/eslint-plugin-node/issues/248
    "node/no-missing-import": "off",
    "import/no-unresolved": "error",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".cts", ".mts"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
};
module.exports = config;
