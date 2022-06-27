import * as fs from "fs/promises";
import path from "path";

import type {
  Reporter,
  ReporterContext,
  ReporterOnStartOptions,
} from "@jest/reporters";
import type {
  AggregatedResult,
  AssertionResult,
  TestContext,
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
    const dashboard = this.convertResultsToDashboard(results, {
      title: this.title,
    });
    const resultText = this.printDashBoard(dashboard);
    if (this.outputPath !== undefined && this.outputPath.length > 0) {
      await fs.mkdir(path.dirname(this.outputPath), { recursive: true });
      await fs.writeFile(this.outputPath, resultText);
    } else {
      console.log(resultText);
    }
  }

  convertResultsToDashboard(
    results: AggregatedResult,
    options: { title: string }
  ): Dashboard {
    const testFiles: TestFiles[] = [];
    for (const testResultsByFile of results.testResults) {
      const filePath = path.relative(
        process.cwd(),
        testResultsByFile.testFilePath
      );
      const describes = this.convertChildren(testResultsByFile.testResults, 0);
      testFiles.push({ filePath, describes });
    }
    return {
      title: options.title,
      summary: "",
      testFiles: testFiles,
    };
  }

  // 現在のレイヤーについて、パースしてArray<Describe | Test>を返す
  // resultsはcurrentLevelに対して同一のancestorTitlesを持つ
  convertChildren(
    results: AssertionResult[],
    targetLevel: number
  ): Array<Describe | Test> {
    const children: Array<Describe | Test> = [];
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      // console.log(" ".repeat(targetLevel), "------------------------");
      // console.log(" ".repeat(targetLevel), "targetLevel: ", targetLevel);
      // console.log(" ".repeat(targetLevel), "result:", result.title);
      // console.log(
      //   " ".repeat(targetLevel),
      //   "ancestorTitles:",
      //   result.ancestorTitles
      // );
      // console.log(" ".repeat(targetLevel), "index:", index);

      // このLevel直下のテストの場合はテストを追加してcurrentIndexをインクリメントしてcontinueする
      // If this is the test on this level
      if (result.ancestorTitles.length === targetLevel) {
        // console.log(" ".repeat(targetLevel), "this is Test");
        children.push({
          type: "test",
          title: result.title,
          status: result.status,
        } as Test);
        continue;
      }

      // If this is the test inside child describe

      // 先頭の要素のdescribeを取得
      // Pick the child ancestorTitle
      const childAncestorTitle: string = result.ancestorTitles[targetLevel];
      // console.log(" ".repeat(targetLevel), result.ancestorTitles[targetLevel]);
      // 同じdescribeに入っているテストたちを取得
      // console.log(
      //   " ".repeat(targetLevel),
      //   results.slice(index).map((r) => r.ancestorTitles.join())
      // );
      const lastIndex = results
        .slice(index)
        .findIndex((r) => r.ancestorTitles[targetLevel] !== childAncestorTitle);
      // console.log(" ".repeat(targetLevel), "lastIndex: ", lastIndex);
      const testsInThisDescribe =
        lastIndex > 0
          ? results.slice(index, index + lastIndex)
          : results.slice(index);
      // console.log(
      //   " ".repeat(targetLevel),
      //   "testsInThisDescribe.length: ",
      //   testsInThisDescribe.length
      // );
      children.push({
        type: "describe",
        describe: result.ancestorTitles[targetLevel],
        childs: this.convertChildren(testsInThisDescribe, targetLevel + 1),
      });
      index = lastIndex > 0 ? index + lastIndex - 1 : results.length;
      // console.log(" ".repeat(targetLevel), "index after process", index);
    }
    return children;
  }

  printChildren(
    children: Array<Test | Describe>,
    currentLevel: number
  ): string {
    let resultText = "";
    for (const child of children) {
      switch (child.type) {
        case "test":
          resultText += `${"  ".repeat(currentLevel)}- ${child.title}\n`;
          break;
        case "describe":
          resultText += `${"  ".repeat(currentLevel)}- ${child.describe}\n`;
          resultText += this.printChildren(child.childs, currentLevel + 1);
          break;
        default:
          throw new Error("Illegal state");
      }
    }
    return resultText;
  }

  printDashBoard(dashboard: Dashboard): string {
    let resultText = `# ${dashboard.title}\n\n`;
    for (const file of dashboard.testFiles) {
      resultText += `## ${file.filePath}\n`;
      resultText += this.printChildren(file.describes, 0);
    }

    return resultText;
  }
}

type Dashboard = {
  title: string;
  summary: string;
  testFiles: TestFiles[];
};

type TestFiles = {
  filePath: string;
  describes: Array<Describe | Test>;
};

type Describe = {
  type: "describe";
  describe: string;
  childs: Array<Describe | Test>;
};

type Test = {
  type: "test";
  title: string;
  status: string;
};

export default MarkdownDashboardReporter;
