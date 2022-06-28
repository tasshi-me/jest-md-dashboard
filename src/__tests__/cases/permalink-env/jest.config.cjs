const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: [path.resolve(__dirname, "..", "..", "fixtures")],
  reporters: [
    [
      "jest-md-dashboard",
      { permalink: { repository: "mshrtsr/jest-md-dashboard" } },
    ],
  ],
};
module.exports = config;
