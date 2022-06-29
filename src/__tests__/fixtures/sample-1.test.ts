describe("describe depth 1", () => {
  test("test 1", async () => {
    expect(1).toBe(1);
  });
  test("test 2", async () => {
    expect(1).toBe(1);
  });
  describe("describe depth 2", () => {
    test("test 1", async () => {
      expect(1).toBe(1);
    });
    test("test 2", async () => {
      expect(1).toBe(1);
    });
    describe("describe depth 3", () => {
      test("test 1", async () => {
        expect(1).toBe(1);
      });
      test("test 2", async () => {
        expect(1).toBe(1);
      });
    });
  });
  describe("describe depth 2-2", () => {
    test("test 1", async () => {
      expect(1).toBe(1);
    });
    test.todo("test 2");
  });
  test("test 3", async () => {
    expect(1).toBe(1);
  });
  test("test 4", async () => {
    expect(1).toBe(1);
  });
});

describe("describe depth 1-2", () => {
  test.each([1, 2])("parametarized: %d", (value) => {
    expect(1).toBe(1);
  });
  test.each([1, 2])("parametarized: %d", (value) => {
    expect(1).toBe(1);
  });
});
