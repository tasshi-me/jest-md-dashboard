const path = require("path");

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: [path.resolve(__dirname, "..", "..", "fixtures")],
  reporters: [["jest-md-dashboard", { permalink: false }]],
};
module.exports = config;
