// @ts-ignore
import { buildTitle, buildPermalink } from "../options";

describe("buildTitle", () => {
  it("should return default value", () => {
    expect(buildTitle()).toBe("Test Dashboard");
  });
  it("should return input value", () => {
    expect(buildTitle("My dashboard")).toBe("My dashboard");
  });
});

describe("buildPermalink", () => {
  const defaultPermalink = {
    hostname: "github.com",
    commit: "main",
    // eslint-disable-next-line no-template-curly-in-string
    pattern: "https://${hostname}/${repository}/blob/${commit}/${filePath}",
  };

  beforeEach(() => {
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_SHA;
  });

  it("should return false", function () {
    expect(buildPermalink()).toBeUndefined();
  });

  it("should return permalink using environment variables", function () {
    process.env.GITHUB_REPOSITORY = "mshrtsr/jest-md-dashboard";
    process.env.GITHUB_SHA = "master";
    const permalink = buildPermalink();
    expect(permalink).toStrictEqual({
      ...defaultPermalink,
      repository: "mshrtsr/jest-md-dashboard",
      commit: "master",
    });
  });

  it("should return permalink using environment variables if input is true", function () {
    process.env.GITHUB_REPOSITORY = "mshrtsr/jest-md-dashboard";
    process.env.GITHUB_SHA = "master";
    const permalink = buildPermalink(true);
    expect(permalink).toStrictEqual({
      ...defaultPermalink,
      repository: "mshrtsr/jest-md-dashboard",
      commit: "master",
    });
  });

  it("should return permalink using input", function () {
    process.env.GITHUB_REPOSITORY = "mshrtsr/jest-md-dashboard";
    process.env.GITHUB_SHA = "master";
    const permalink = {
      hostname: "github.example.com",
      repository: "jest-md-dashboard",
      commit: "master",
      // eslint-disable-next-line no-template-curly-in-string
      pattern: "https://${hostname}/${repository}/files/${commit}/${filePath}",
    };
    expect(buildPermalink(permalink)).toStrictEqual(permalink);
  });

  it("should return false when input is false", function () {
    expect(buildPermalink(false)).toBeUndefined();
  });

  it("should throw an error if input is illegal type", () => {
    const errorMessage = "`permalink` option must be object or boolean";
    expect(() => buildPermalink(0)).toThrow(errorMessage);
    expect(() => buildPermalink(1)).toThrow(errorMessage);
    expect(() => buildPermalink("hoge")).toThrow(errorMessage);
    expect(() => buildPermalink("true")).toThrow(errorMessage);
    expect(() => buildPermalink("false")).toThrow(errorMessage);
    expect(() => buildPermalink("true")).toThrow(errorMessage);
    expect(() => buildPermalink("true")).toThrow(errorMessage);
  });
});
