import path from "path";

import {
  AggregatedResult,
  AssertionResult,
  TestResult,
} from "@jest/test-result";

import { Dashboard, Describe, Test, TestFiles } from "./types.js";

export const convertResultsToDashboard = (
  results: AggregatedResult,
  options: { title: string; rootPath: string }
): Dashboard => {
  // TODO: create summary

  const testFiles: TestFiles[] = results.testResults.map((resultByFile) =>
    convertTestFile(resultByFile, { rootPath: options.rootPath })
  );
  return {
    title: options.title,
    summary: "",
    testFiles: testFiles,
  };
};

const convertTestFile = (result: TestResult, options: { rootPath: string }) => {
  const filePath = path.relative(options.rootPath, result.testFilePath);
  const describes = convertChildren(result.testResults);
  return { filePath, children: describes };
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
