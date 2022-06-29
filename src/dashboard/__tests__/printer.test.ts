// @ts-ignore
import fs from "fs";
import path from "path";

// @ts-ignore
import { printDashBoard } from "../printer";

// @ts-ignore
import { dashboard } from "./fixtures/printer/input-dashboard";

const expected = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/printer/expected-dashboard.md"),
  "utf-8"
);

describe("printDashBoard", () => {
  it("should print dashboard correctly", function () {
    const actual = printDashBoard(dashboard);
    expect(actual).toBe(expected);
  });
});
