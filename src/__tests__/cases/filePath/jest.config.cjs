const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: [path.resolve(__dirname, "..", "..", "fixtures")],
  reporters: [
    [
      "jest-md-dashboard",
      { outputPath: path.resolve(__dirname, "dist", "dashboard.md") },
    ],
  ],
};
module.exports = config;
