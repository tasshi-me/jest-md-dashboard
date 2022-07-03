import { Status } from "@jest/test-result";

import { Dashboard, Describe, Summary, Test, TestFile } from "./types.js";

export const printDashBoard = (dashboard: Dashboard): string => {
  let resultText = `# ${dashboard.title}\n\n`;
  resultText += printSummary(dashboard.summary);
  resultText += printTestFiles(dashboard.testFiles);
  return resultText;
};

const printSummary = (summary: Summary): string => {
  let resultText = "\n";

  const startTime = new Date(summary.startTime);
  resultText += "| :clock10: Start time | :hourglass: Duration |\n";
  resultText += "| --- | ---: |\n";
  resultText += `|${startTime.toLocaleString()}|${summary.totalRunTime} s|\n`;
  resultText += "\n";

  resultText +=
    "| | :white_check_mark: Passed | :x: Failed | :construction: Todo | :white_circle: Total |\n";
  resultText += "| --- | ---: | ---: | ---:| ---: |\n";
  resultText += `|Test Suites|${summary.numPassedTestSuites}|${summary.numFailedTestSuites}|-|${summary.numTotalTestSuites}|\n`;
  resultText += `|Tests|${summary.numPassedTests}|${summary.numFailedTests}|${summary.numTodoTests}|${summary.numTotalTests}|\n`;
  resultText += "\n";
  return resultText;
};

const printTestFiles = (testFiles: TestFile[]): string => {
  let resultText = "";
  for (const file of testFiles) {
    const link = file.permalink ? ` [[link](${file.permalink})]` : "";
    resultText += `## ${file.filePath}${link}\n\n`;

    resultText += `${file.numPassingTests} passed, ${file.numFailingTests} failed, ${file.numTodoTests} todo, done in ${file.duration} s\n`;
    resultText += "\n";

    resultText += printChildren(file.children);

    resultText += "\n";
  }
  return resultText;
};

const printChildren = (
  children: Array<Test | Describe>,
  currentLevel: number = 0
): string => {
  let resultText = "";
  for (const child of children) {
    switch (child.type) {
      case "test":
        resultText += `${"  ".repeat(currentLevel)}- ${printStatus(
          child.status
        )} ${child.title}\n`;
        break;
      case "describe":
        resultText += `${"  ".repeat(currentLevel)}- ${printStatus(
          child.status
        )} ${child.describe}\n`;
        resultText += printChildren(child.children, currentLevel + 1);
        break;
      default:
        throw new Error("Illegal state");
    }
  }
  return resultText;
};

const printStatus = (status: Status): string => {
  switch (status) {
    case "passed":
      return ":white_check_mark:";
    case "failed":
      return ":x:";
    case "skipped":
      return ":fast_forward:";
    case "pending":
      return ":running:";
    case "todo":
      return ":construction:";
    case "disabled":
      return ":no_entry_sign:";
    default:
      throw new Error("Illegal state");
  }
};
