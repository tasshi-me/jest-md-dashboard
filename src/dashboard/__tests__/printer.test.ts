import fs from "fs";
import path from "path";

import { printDashBoard } from "../printer.js";

import { dashboard } from "./fixtures/printer/default/input-dashboard.js";
import { dashboard as noPermalinkDashboard } from "./fixtures/printer/no-permalink/input-dashboard.js";

const expected = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/printer/default/expected-dashboard.md"),
  "utf-8",
);
const noPermalinkExpected = fs.readFileSync(
  path.resolve(
    __dirname,
    "./fixtures/printer/no-permalink/expected-dashboard.md",
  ),
  "utf-8",
);

describe("printDashBoard", () => {
  it("should print dashboard correctly", () => {
    const actual = printDashBoard(dashboard);
    expect(actual).toBe(expected);
  });

  it("should print dashboard without permalink", () => {
    const actual = printDashBoard(noPermalinkDashboard);
    expect(actual).toBe(noPermalinkExpected);
  });
});
