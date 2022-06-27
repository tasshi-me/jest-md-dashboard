export type Dashboard = {
  title: string;
  summary: string;
  testFiles: TestFiles[];
};

export type TestFiles = {
  filePath: string;
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
