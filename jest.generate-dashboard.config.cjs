const baseConfig = require("./jest.config.cjs");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...baseConfig,
  reporters: ["default", ["jest-md-dashboard", { outputPath: "dashboard.md" }]],
};
module.exports = config;
