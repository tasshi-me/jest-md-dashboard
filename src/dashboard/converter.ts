import path from "path";

import {
  AggregatedResult,
  AssertionResult,
  Status,
  TestResult,
} from "@jest/test-result";

import { Dashboard, Summary, Describe, Test, TestFile } from "./types.js";

export const convertResultsToDashboard = (
  results: AggregatedResult,
  options: {
    title: string;
    jestRootDir: string;
    permalinkBaseUrl?: string;
  }
): Dashboard => {
  const summary = convertSummary(results);
  results.testResults.sort((a, b) =>
    b.testFilePath.localeCompare(a.testFilePath)
  );
  const testFiles: TestFile[] = results.testResults.map((resultByFile) =>
    convertTestFile(resultByFile, {
      jestRootDir: options.jestRootDir,
      permalinkBaseUrl: options.permalinkBaseUrl,
    })
  );
  return {
    title: options.title,
    summary: summary,
    testFiles: testFiles,
  };
};

const convertSummary = (results: AggregatedResult): Summary => {
  const totalRunTime = (Date.now() - results.startTime) / 1000;
  return {
    numFailedTests: results.numFailedTests,
    numFailedTestSuites: results.numFailedTestSuites,
    numPassedTests: results.numPassedTests,
    numPassedTestSuites: results.numPassedTestSuites,
    numPendingTests: results.numPendingTests,
    numTodoTests: results.numTodoTests,
    numPendingTestSuites: results.numPendingTestSuites,
    numRuntimeErrorTestSuites: results.numRuntimeErrorTestSuites,
    numTotalTests: results.numTotalTests,
    numTotalTestSuites: results.numTotalTestSuites,
    startTime: results.startTime,
    totalRunTime,
  };
};

const convertTestFile = (
  result: TestResult,
  options: {
    jestRootDir: string;
    permalinkBaseUrl?: string;
  }
): TestFile => {
  const filePath = path.relative(options.jestRootDir, result.testFilePath);
  const permalink: string | undefined = options.permalinkBaseUrl
    ? options.permalinkBaseUrl + filePath
    : undefined;
  const duration = result.perfStats.runtime / 1000;
  const numPassingTests = result.numPassingTests;
  const numFailingTests = result.numFailingTests;
  const numTodoTests = result.numTodoTests;

  const children = convertChildren(result.testResults);
  return {
    filePath,
    permalink,
    numPassingTests,
    numFailingTests,
    numTodoTests,
    duration,
    children,
  };
};

const convertChildren = (
  results: AssertionResult[],
  currentLevel: number = 0
): Array<Describe | Test> => {
  const children: Array<Describe | Test> = [];
  for (let index = 0; index < results.length; index++) {
    const result = results[index];

    // If this is the test on this describe
    if (result.ancestorTitles.length === currentLevel) {
      children.push({
        type: "test",
        title: result.title,
        status: result.status,
      });
      continue;
    }

    // If the result is the test inside child describe
    // slice tests which are in same child describe
    const childAncestorTitle: string = result.ancestorTitles[currentLevel];
    const lastIndex = results
      .slice(index)
      .findIndex((r) => r.ancestorTitles[currentLevel] !== childAncestorTitle);
    const testsInThisDescribe =
      lastIndex > 0
        ? results.slice(index, index + lastIndex)
        : results.slice(index);
    const _children = convertChildren(testsInThisDescribe, currentLevel + 1);
    let status: Status = "passed";
    if (_children.some((child) => child.status === "failed")) {
      status = "failed";
    } else if (_children.some((child) => child.status === "pending")) {
      status = "pending";
    } else if (_children.every((child) => child.status === "skipped")) {
      status = "skipped";
    } else if (_children.every((child) => child.status === "todo")) {
      status = "todo";
    } else if (_children.every((child) => child.status === "disabled")) {
      status = "disabled";
    }

    children.push({
      type: "describe",
      describe: result.ancestorTitles[currentLevel],
      // TODO: need a recursion limit
      status,
      children: _children,
    });
    index = lastIndex > 0 ? index + lastIndex - 1 : results.length;
  }
  return children;
};
