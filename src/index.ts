import * as fs from "fs/promises";
import path from "path";

import type { Reporter, ReporterContext } from "@jest/reporters";
import type { AggregatedResult, TestContext } from "@jest/test-result";
import type { Config } from "@jest/types";

import {
  convertResultsToDashboard,
  printDashBoard,
} from "./dashboard/index.js";

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

  onRunStart() {
    // noop
  }
  getLastError() {
    // noop
  }

  async onRunComplete(
    testContexts: Set<TestContext>,
    results: AggregatedResult
  ): Promise<void> {
    const dashboard = convertResultsToDashboard(results, {
      title: this.title,
      rootPath: process.cwd(),
    });
    const resultText = printDashBoard(dashboard);
    if (this.outputPath !== undefined && this.outputPath.length > 0) {
      await fs.mkdir(path.dirname(this.outputPath), { recursive: true });
      await fs.writeFile(this.outputPath, resultText);
    } else {
      console.log(resultText);
    }
  }
}

export default MarkdownDashboardReporter;
