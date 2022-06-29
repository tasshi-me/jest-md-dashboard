import * as fs from "fs/promises";
import path from "path";

// @ts-ignore
import { runJest } from "./helpers/command";

const jestConfig = path.resolve(__dirname, "fixtures", "jest.config.cjs");
const expectedPath = path.resolve(__dirname, "fixtures", "expected.md");
const outputPath = path.resolve(__dirname, "fixtures", "dist", "dashboard.md");

describe("jest-md-dashboard", () => {
  beforeAll(async () => {
    await fs.rm(path.dirname(outputPath), { recursive: true, force: true });
  });
  it("can print dashboard to a file", async () => {
    const result = runJest(jestConfig);

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
      console.log(stderr);
    }
    expect(result.error).toBeUndefined();

    const rawOutput = await fs.readFile(outputPath, "utf-8");
    const output = rawOutput.replace(/\|.+\|\d(\.\d+)? s\|/, "|0|0 s|");
    expect(output).toBe(await fs.readFile(expectedPath, "utf-8"));
  });
});
