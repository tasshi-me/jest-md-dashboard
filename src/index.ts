import * as fs from "fs/promises";
import path from "path";

import type { Reporter, ReporterContext } from "@jest/reporters";
import type { AggregatedResult, TestContext } from "@jest/test-result";
import type { Config } from "@jest/types";

import {
  Permalink,
  convertResultsToDashboard,
  printDashBoard,
} from "./dashboard/index.js";
import { buildTitle, buildPermalink, buildOutputPath } from "./options.js";

export type ReporterOptions = {
  title?: string;
  outputPath?: string;
  permalink?:
    | {
        hostname?: string;
        repository?: string;
        commit?: string;
        pattern?: string;
      }
    | boolean;
};

export class MarkdownDashboardReporter implements Reporter {
  private readonly globalConfig: Config.GlobalConfig;
  private readonly context: ReporterContext;
  private readonly title: string;
  private readonly outputPath: string;
  private readonly permalink?: Permalink;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions: ReporterOptions,
    reporterContext: ReporterContext
  ) {
    this.globalConfig = globalConfig;
    this.context = reporterContext;

    this.title = buildTitle(reporterOptions.title);
    this.outputPath = buildOutputPath(reporterOptions.outputPath);
    this.permalink = buildPermalink(reporterOptions.permalink);
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
      rootPath: this.globalConfig.rootDir,
      permalink: this.permalink,
    });
    const resultText = printDashBoard(dashboard);
    if (this.outputPath === "-") {
      console.log(resultText);
    } else {
      const absolutePath = path.resolve(this.outputPath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, resultText);
      console.log(`\nDashboard is generated to ${absolutePath}`);
    }
  }
}

export default MarkdownDashboardReporter;
