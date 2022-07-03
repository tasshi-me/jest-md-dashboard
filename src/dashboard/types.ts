import { Status } from "@jest/test-result";

export type Dashboard = {
  title: string;
  summary: Summary;
  testFiles: TestFile[];
};

export type Summary = {
  numFailedTests: number;
  numFailedTestSuites: number;
  numPassedTests: number;
  numPassedTestSuites: number;
  numPendingTests: number;
  numTodoTests: number;
  numPendingTestSuites: number;
  numRuntimeErrorTestSuites: number;
  numTotalTests: number;
  numTotalTestSuites: number;
  startTime: number;
  totalRunTime: number;
};

export type TestFile = {
  filePath: string;
  permalink?: string;
  numPassingTests: number;
  numFailingTests: number;
  numTodoTests: number;
  duration: number;
  children: Array<Describe | Test>;
};

export type Describe = {
  type: "describe";
  describe: string;
  status: Status;
  children: Array<Describe | Test>;
};

export type Test = {
  type: "test";
  title: string;
  status: Status;
};
