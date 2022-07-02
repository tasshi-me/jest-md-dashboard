import baseConfig from "./jest.config.js";

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...baseConfig,
  reporters: ["default", ["jest-md-dashboard", { outputPath: "dashboard.md" }]],
};
export default config;
