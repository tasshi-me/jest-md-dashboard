import * as fs from "fs/promises";
import path from "path";

// @ts-ignore
import { runJest } from "../../helpers/command";

const jestConfig = path.resolve(__dirname, "jest.config.cjs");
const expected = path.resolve(__dirname, "expected.md");

describe("jest-md-dashboard", () => {
  it("can print dashboard to stdout without options", async () => {
    const result = runJest(jestConfig, {
      GITHUB_REPOSITORY: "mshrtsr/jest-md-dashboard",
      GITHUB_SHA: "main",
    });

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
      console.log(stderr);
    }
    expect(result.error).toBeUndefined();
    expect(result.stdout.toString()).toBe(await fs.readFile(expected, "utf-8"));
  });
});
