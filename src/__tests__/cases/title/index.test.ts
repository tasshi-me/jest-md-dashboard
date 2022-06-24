import * as child_process from "child_process";
import * as fs from "fs/promises";
import path from "path";

const jestConfig = path.resolve(__dirname, "jest.config.cjs");
const expected = path.resolve(__dirname, "expected.md");

describe("jest-md-dashboard", () => {
  it("can print dashboard with custom title", async () => {
    const result = child_process.spawnSync("jest", [`--config=${jestConfig}`]);

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
      console.log(stderr);
    }
    expect(result.error).toBeUndefined();
    expect(result.stdout.toString()).toBe(await fs.readFile(expected, "utf-8"));
  });
});
