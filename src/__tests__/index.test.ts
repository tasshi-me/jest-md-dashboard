import * as fs from "fs/promises";
import path from "path";

import { runJest } from "./helpers/command.js";

const jestConfig = path.resolve(__dirname, "fixtures", "jest.config.cjs");
const expectedPath = path.resolve(__dirname, "fixtures", "expected.md");
const outputPath = path.resolve(__dirname, "fixtures", "dist", "dashboard.md");
const rootDir = path.resolve(__dirname, "..", "..");

const env = {
  GITHUB_ACTIONS: "true",
  GITHUB_SERVER_URL: "https://github.com",
  GITHUB_REPOSITORY: "tasshi-me:jest-md-dashboard",
  GITHUB_SHA: "main",
  GITHUB_WORKSPACE: rootDir,
};

describe("jest-md-dashboard", () => {
  beforeAll(async () => {
    await fs.rm(path.dirname(outputPath), { recursive: true, force: true });
  });
  it("can print dashboard to a file", async () => {
    const result = runJest(jestConfig, env);

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
      console.log(stderr);
    }
    expect(result.error).toBeUndefined();

    const rawOutput = await fs.readFile(outputPath, "utf-8");
    const output = rawOutput
      .replace(/\|.+\|\d(\.\d+)? s\|/, "|0|0 s|")
      .replace(
        /\d+ passed, \d+ failed, \d+ todo, done in \d(\.\d+)? s/g,
        "0 passed, 0 failed, 0 todo, done in 0 s",
      );
    expect(output).toBe(await fs.readFile(expectedPath, "utf-8"));
  });
});
