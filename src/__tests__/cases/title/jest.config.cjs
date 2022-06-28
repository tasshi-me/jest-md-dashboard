const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: path.resolve(__dirname, "..", "..", "..", ".."),
  roots: ["<rootDir>/src/__tests__/fixtures"],
  reporters: [["jest-md-dashboard", { title: "Custom Title!!" }]],
};
module.exports = config;
