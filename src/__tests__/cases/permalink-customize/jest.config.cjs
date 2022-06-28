const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: path.resolve(__dirname, "..", "..", "..", ".."),
  roots: ["<rootDir>/src/__tests__/fixtures"],
  reporters: [
    [
      "jest-md-dashboard",
      {
        permalink: {
          hostname: "github.example.com",
          repository: "mshrtsr/jest-md-dashboard",
          commit: "master",
          pattern:
            // eslint-disable-next-line no-template-curly-in-string
            "https://${hostname}/${repository}/files/${commit}/${filePath}",
        },
      },
    ],
  ],
};
module.exports = config;
