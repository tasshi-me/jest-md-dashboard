// @ts-ignore
import fs from "fs";
import path from "path";

// @ts-ignore
import { printDashBoard } from "../printer";

// @ts-ignore
import { dashboard } from "./fixtures/printer/default/input-dashboard";
// @ts-ignore
import { dashboard as noPermalinkDashboard } from "./fixtures/printer/no-permalink/input-dashboard";

const expected = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/printer/default/expected-dashboard.md"),
  "utf-8"
);
const noPermalinkExpected = fs.readFileSync(
  path.resolve(
    __dirname,
    "./fixtures/printer/no-permalink/expected-dashboard.md"
  ),
  "utf-8"
);

describe("printDashBoard", () => {
  it("should print dashboard correctly", function () {
    const actual = printDashBoard(dashboard);
    expect(actual).toBe(expected);
  });

  it("should print dashboard without permalink", function () {
    const actual = printDashBoard(noPermalinkDashboard);
    expect(actual).toBe(noPermalinkExpected);
  });
});
