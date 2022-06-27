import * as fs from "fs/promises";
import path from "path";

// @ts-ignore
import { runJest } from "../../helpers/command";

const jestConfig = path.resolve(__dirname, "jest.config.cjs");
const expected = path.resolve(__dirname, "expected.md");
const outputPath = path.resolve(__dirname, "dist", "dashboard.md");

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
    expect(await fs.readFile(outputPath, "utf-8")).toBe(
      await fs.readFile(expected, "utf-8")
    );
  });
});
