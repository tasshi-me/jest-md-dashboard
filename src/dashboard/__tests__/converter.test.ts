// @ts-ignore
import { buildPermalink } from "../../options";
// @ts-ignore
import { convertResultsToDashboard } from "../converter";

// @ts-ignore
import { dashboard as expected } from "./fixtures/converter/expected-dashboard";
// @ts-ignore
import { results } from "./fixtures/converter/input-results";
// @ts-ignore
import { testDuration, testStartTime } from "./helpers/datetime";

delete process.env.GITHUB_REPOSITORY;
delete process.env.GITHUB_SHA;

const baseOptions = {
  title: "My Dashboard",
  rootPath: "/path/to/rootDir/",
  permalink: buildPermalink({
    repository: "mshrtsr/jest-md-dashboard",
    commit: "main",
  }),
};

describe("convertResultsToDashboard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(testStartTime);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should convert results to dashboard", function () {
    const actual = convertResultsToDashboard(results, { ...baseOptions });
    actual.summary.totalRunTime = testDuration;
    expect(actual).toStrictEqual(expected);
  });
});
