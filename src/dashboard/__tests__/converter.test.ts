import { buildPermalink } from "../../options.js";
import { convertResultsToDashboard } from "../converter.js";

import { dashboard as expected } from "./fixtures/converter/expected-dashboard.js";
import { results } from "./fixtures/converter/input-results.js";
import { testDuration, testStartTime } from "./helpers/datetime.js";

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
