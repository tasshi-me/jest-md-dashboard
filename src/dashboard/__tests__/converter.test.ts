import { jest } from "@jest/globals";

import { buildPermalinkBaseUrl } from "../../options.js";
import { convertResultsToDashboard } from "../converter.js";

import { dashboard as expected } from "./fixtures/converter/expected-dashboard.js";
import { results } from "./fixtures/converter/input-results.js";
import { testDuration, testStartTime } from "./helpers/datetime.js";

delete process.env.GITHUB_REPOSITORY;
delete process.env.GITHUB_SHA;

const baseOptions = {
  title: "My Dashboard",
  jestRootDir: "/path/to/rootDir/",
  permalinkBaseUrl: "https://github.com/tasshi-me/jest-md-dashboard/blob/main/",
};

describe("convertResultsToDashboard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(testStartTime);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should convert results to dashboard", () => {
    const actual = convertResultsToDashboard(results, { ...baseOptions });
    actual.summary.totalRunTime = testDuration;
    expect(actual).toStrictEqual(expected);
  });
});
