import * as fs from "fs/promises";
import path from "path";

import type { Reporter, ReporterContext } from "@jest/reporters";
import type { AggregatedResult, TestContext } from "@jest/test-result";
import type { Config } from "@jest/types";

import {
  convertResultsToDashboard,
  printDashBoard,
} from "./dashboard/index.js";
import { Logger } from "./log.js";
import {
  buildTitle,
  buildPermalinkBaseUrl,
  buildOutputPath,
} from "./options.js";

export type ReporterOptions = {
  title?: string;
  outputPath?: string;
  permalinkBaseUrl?: string;
};

export class MarkdownDashboardReporter implements Reporter {
  private readonly globalConfig: Config.GlobalConfig;
  private readonly context: ReporterContext;
  private readonly log: Logger;
  private readonly title: string;
  private readonly outputPath: string;
  private readonly permalinkBaseUrl: Promise<string | undefined>;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions: ReporterOptions,
    reporterContext: ReporterContext,
  ) {
    this.globalConfig = globalConfig;
    this.context = reporterContext;

    this.log = new Logger(this.globalConfig.silent);

    this.title = buildTitle(reporterOptions.title);
    this.outputPath = buildOutputPath(reporterOptions.outputPath);
    this.permalinkBaseUrl = buildPermalinkBaseUrl({
      permalinkBaseUrl: reporterOptions.permalinkBaseUrl,
      jestRootDir: this.globalConfig.rootDir,
      log: this.log,
    });
  }

  onRunStart = () => {
    // noop
  };
  getLastError = () => {
    // noop
  };

  onRunComplete = async (
    testContexts: Set<TestContext>,
    results: AggregatedResult,
  ): Promise<void> => {
    const permalinkBaseUrl = await this.permalinkBaseUrl;
    const dashboard = convertResultsToDashboard(results, {
      title: this.title,
      jestRootDir: this.globalConfig.rootDir,
      permalinkBaseUrl,
    });
    const resultText = printDashBoard(dashboard);
    if (this.outputPath === "-") {
      console.log(resultText);
    } else {
      const absolutePath = path.resolve(this.outputPath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, resultText);
      this.log.info(`Dashboard is generated to ${absolutePath}`);
    }
  };
}

export default MarkdownDashboardReporter;
