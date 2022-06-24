import path from "path";

import type {
  Reporter,
  ReporterContext,
  ReporterOnStartOptions,
  // eslint-disable-next-line node/no-unpublished-import
} from "@jest/reporters";
import type {
  AggregatedResult,
  TestContext,
  // eslint-disable-next-line node/no-unpublished-import
} from "@jest/test-result";
// eslint-disable-next-line node/no-unpublished-import
import type { Config } from "@jest/types";

export type ReporterOptions = {
  title: string;
};

export class MarkdownDashboardReporter implements Reporter {
  private _globalConfig: Config.GlobalConfig;
  private readonly _title: string;
  private _context: ReporterContext;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions: ReporterOptions,
    reporterContext: ReporterContext
  ) {
    this._globalConfig = globalConfig;
    this._title = reporterOptions.title ?? "Tests Dashboard";
    this._context = reporterContext;
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): void {
    // noop
  }
  getLastError() {
    // noop
  }

  onRunComplete(
    testContexts: Set<TestContext>,
    results: AggregatedResult
  ): void {
    let resultText = `# ${this._title}\n\n`;
    for (const testResultsByFile of results.testResults) {
      resultText += `## ${path.relative("", testResultsByFile.testFilePath)}\n`;
      let lastAncestorTitles: string[] = [];
      for (const testResult of testResultsByFile.testResults) {
        for (const [
          index,
          ancestorTitle,
        ] of testResult.ancestorTitles.entries()) {
          if (
            lastAncestorTitles.length < index ||
            ancestorTitle !== lastAncestorTitles[index]
          ) {
            resultText += `${"  ".repeat(index)}- ${ancestorTitle}\n`;
          }
        }
        lastAncestorTitles = testResult.ancestorTitles;
        resultText += `${"  ".repeat(testResult.ancestorTitles.length)}- ${
          testResult.title
        }\n`;
      }
    }
    console.log(resultText);
  }
}

export default MarkdownDashboardReporter;
