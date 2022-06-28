import * as fs from "fs/promises";
import path from "path";

import type { Reporter, ReporterContext } from "@jest/reporters";
import type { AggregatedResult, TestContext } from "@jest/test-result";
import type { Config } from "@jest/types";

import {
  PermalinkOption,
  convertResultsToDashboard,
  printDashBoard,
} from "./dashboard/index.js";

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
  private readonly outputPath?: string;
  private readonly permalink?: PermalinkOption;

  constructor(
    globalConfig: Config.GlobalConfig,
    reporterOptions: ReporterOptions,
    reporterContext: ReporterContext
  ) {
    this.globalConfig = globalConfig;
    this.context = reporterContext;

    this.title = reporterOptions.title ?? "Tests Dashboard";
    this.outputPath = reporterOptions.outputPath;
    this.permalink = buildPermalinkOption(reporterOptions.permalink);
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
      permalink: this.permalink,
    });
    const resultText = printDashBoard(dashboard);
    if (this.outputPath !== undefined && this.outputPath.length > 0) {
      const absolutePath = path.resolve(this.outputPath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, resultText);
      console.log(`\nDashboard is generated to ${absolutePath}`);
    } else {
      console.log(resultText);
    }
  }
}

const buildPermalinkOption = (
  permalink: ReporterOptions["permalink"]
): PermalinkOption | undefined => {
  if (
    permalink !== undefined &&
    typeof permalink !== "boolean" &&
    typeof permalink !== "object"
  ) {
    throw new Error("`permalink` option must be object or boolean");
  }

  let hostname = "github.com";
  let repository = process.env.GITHUB_REPOSITORY;
  let commit = process.env.GITHUB_SHA ?? "main";
  // eslint-disable-next-line no-template-curly-in-string
  let pattern = "https://${hostname}/${repository}/blob/${commit}/${filePath}";

  if (typeof permalink === "boolean" && !permalink) return undefined;
  if (typeof permalink === "object" && permalink !== null) {
    if (permalink.hostname) hostname = permalink.hostname;
    if (permalink.repository) repository = permalink.repository;
    if (permalink.commit) commit = permalink.commit;
    if (permalink.pattern) pattern = permalink.pattern;
  }
  if (hostname && repository && commit && pattern) {
    return { hostname, repository, commit, pattern };
  }
  return undefined;
};

export default MarkdownDashboardReporter;
