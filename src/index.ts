import * as fs from "fs/promises";
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
  title?: string;
  outputPath?: string;
};

export class MarkdownDashboardReporter implements Reporter {
  private globalConfig: Config.GlobalConfig;
  private readonly title: string;
  private readonly outputPath?: string;
  private context: ReporterContext;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions: ReporterOptions,
    reporterContext: ReporterContext
  ) {
    this.globalConfig = globalConfig;
    this.title = reporterOptions.title ?? "Tests Dashboard";
    this.outputPath = reporterOptions.outputPath;
    this.context = reporterContext;
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): void {
    // noop
  }
  getLastError() {
    // noop
  }

  async onRunComplete(
    testContexts: Set<TestContext>,
    results: AggregatedResult
  ): Promise<void> {
    let resultText = `# ${this.title}\n\n`;
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
    if (this.outputPath !== undefined && this.outputPath.length > 0) {
      await fs.mkdir(path.dirname(this.outputPath), { recursive: true });
      await fs.writeFile(this.outputPath, resultText);
    } else {
      console.log(resultText);
    }
  }
}

export default MarkdownDashboardReporter;
