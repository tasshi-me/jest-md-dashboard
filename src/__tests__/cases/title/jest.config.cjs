const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: [path.resolve(__dirname, "..", "..", "fixtures")],
  reporters: [["jest-md-dashboard", { title: "Custom Title!!" }]],
};
module.exports = config;
