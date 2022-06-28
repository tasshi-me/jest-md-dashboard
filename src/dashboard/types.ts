export type Dashboard = {
  title: string;
  summary: string;
  testFiles: TestFile[];
};

export type TestFile = {
  filePath: string;
  permalink?: string;
  children: Array<Describe | Test>;
};

export type Describe = {
  type: "describe";
  describe: string;
  children: Array<Describe | Test>;
};

export type Test = {
  type: "test";
  title: string;
  status: string;
};
