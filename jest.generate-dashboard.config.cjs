const baseConfig = require("./jest.config.cjs");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...baseConfig,
  collectCoverage: false,
  reporters: ["jest-md-dashboard"],
};
module.exports = config;
