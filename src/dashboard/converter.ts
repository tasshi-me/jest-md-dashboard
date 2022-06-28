import path from "path";

import {
  AggregatedResult,
  AssertionResult,
  TestResult,
} from "@jest/test-result";

import { Dashboard, Summary, Describe, Test, TestFile } from "./types.js";

export type PermalinkOption = {
  hostname: string;
  repository: string;
  commit: string;
  pattern: string;
};

export const convertResultsToDashboard = (
  results: AggregatedResult,
  options: {
    title: string;
    rootPath: string;
    permalink?: PermalinkOption;
  }
): Dashboard => {
  const summary = convertSummary(results);
  const testFiles: TestFile[] = results.testResults.map((resultByFile) =>
    convertTestFile(resultByFile, {
      rootPath: options.rootPath,
      permalink: options.permalink,
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
  return { totalRunTime, ...results };
};

const convertTestFile = (
  result: TestResult,
  options: { rootPath: string; permalink?: PermalinkOption }
): TestFile => {
  const filePath = path.relative(options.rootPath, result.testFilePath);
  let permalink: string | undefined;
  if (options.permalink) {
    permalink = options.permalink.pattern
      /* eslint-disable no-template-curly-in-string */
      .replace("${hostname}", options.permalink.hostname)
      .replace("${repository}", options.permalink.repository)
      .replace("${commit}", options.permalink.commit)
      .replace("${filePath}", filePath);
    /* eslint-enable no-template-curly-in-string */
  }
  const children = convertChildren(result.testResults);
  return { filePath, children, permalink };
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
      } as Test);
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
    children.push({
      type: "describe",
      describe: result.ancestorTitles[currentLevel],
      // TODO: need a recursion limit
      children: convertChildren(testsInThisDescribe, currentLevel + 1),
    });
    index = lastIndex > 0 ? index + lastIndex - 1 : results.length;
  }
  return children;
};
