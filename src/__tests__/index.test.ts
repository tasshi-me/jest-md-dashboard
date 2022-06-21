import * as jestCli from "jest-cli";

describe("hoge", () => {
  test("fuga", async () => {
    expect(1).toBe(1);
    // await jestCli.run([
    //   "--passWithNoTests",
    //   "--reporters",
    //   `${__dirname}/../../lib/esm/index.js`,
    // ]);
  });
});
