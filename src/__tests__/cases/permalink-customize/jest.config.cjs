const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: [path.resolve(__dirname, "..", "..", "fixtures")],
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
