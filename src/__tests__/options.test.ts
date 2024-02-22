import fsSync from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";

import git from "isomorphic-git";

import { Logger } from "../log.js";
import {
  buildTitle,
  buildOutputPath,
  buildPermalinkBaseUrl,
} from "../options.js";

const log = new Logger();

describe("buildTitle", () => {
  it("should return default value", () => {
    expect(buildTitle()).toBe("Test Dashboard");
  });
  it("should return input value", () => {
    expect(buildTitle("My dashboard")).toBe("My dashboard");
  });
});

describe("buildOutputPath", () => {
  it("should return default value", () => {
    expect(buildOutputPath()).toBe("test-dashboard.md");
  });
  it("should return input value", () => {
    expect(buildOutputPath("/path/to/dashboard.md")).toBe(
      "/path/to/dashboard.md"
    );
  });
});

describe("buildPermalinkBaseUrl", () => {
  beforeEach(() => {
    delete process.env.GITHUB_ACTIONS;
    delete process.env.GITHUB_SERVER_URL;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_SHA;
    delete process.env.GITHUB_WORKSPACE;
  });

  it("should return permalinkBaseUrl using user input", async () => {
    process.env.GITHUB_ACTIONS = "true";
    process.env.GITHUB_SERVER_URL = "https://github.com";
    process.env.GITHUB_REPOSITORY = "tasshi-me/jest-md-dashboard";
    process.env.GITHUB_SHA = "main";
    process.env.GITHUB_WORKSPACE = "/path/to/repository/";
    const input =
      "https://github.example.com/tasshi-me/jest-md-dashboard/files/develop/";
    const actual = await buildPermalinkBaseUrl({
      permalinkBaseUrl: input,
      jestRootDir: "/path/to/repository/",
      log,
    });
    expect(actual).toBe(input);
  });

  describe("on GitHub Actions", () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = "true";
      process.env.GITHUB_SERVER_URL = "https://github.com";
      process.env.GITHUB_REPOSITORY = "tasshi-me/jest-md-dashboard";
      process.env.GITHUB_SHA = "main";
      process.env.GITHUB_WORKSPACE = "/path/to/repository/";
    });

    it("should return permalinkBaseUrl", async () => {
      const actual = await buildPermalinkBaseUrl({
        jestRootDir: "/path/to/repository/",
        log,
      });
      const expected =
        "https://github.com/tasshi-me/jest-md-dashboard/blob/main/";
      expect(actual).toBe(expected);
    });

    it("should return permalinkBaseUrl (GHE)", async () => {
      process.env.GITHUB_SERVER_URL = "https://github.example.com";
      const actual = await buildPermalinkBaseUrl({
        jestRootDir: "/path/to/repository",
        log,
      });
      const expected =
        "https://github.example.com/tasshi-me/jest-md-dashboard/blob/main/";
      expect(actual).toBe(expected);
    });

    it("should return permalinkBaseUrl if jest runs on subtree", async () => {
      const actual = await buildPermalinkBaseUrl({
        jestRootDir: "/path/to/repository/subtree",
        log,
      });
      const expected =
        "https://github.com/tasshi-me/jest-md-dashboard/blob/main/subtree/";
      expect(actual).toBe(expected);
    });

    it("should throw Error if required variables are missing", async () => {
      delete process.env.GITHUB_SERVER_URL;
      await expect(() =>
        buildPermalinkBaseUrl({
          jestRootDir: "/path/to/repository/subtree",
          log,
        })
      ).rejects.toThrow(
        "The following environment variables are required for the GitHub Actions environment\n- GITHUB_SERVER_URL\n- GITHUB_REPOSITORY\n- GITHUB_SHA\n- GITHUB_WORKSPACE"
      );
    });
  });

  describe("using local git config", () => {
    it("should return permalinkBaseUrl using git config", async () => {
      const gitProject = await fs.mkdtemp(
        path.join(os.tmpdir(), "jest-md-dashboard-")
      );
      await git.init({ fs: fsSync, dir: gitProject });
      await git.addRemote({
        fs: fsSync,
        dir: gitProject,
        remote: "origin",
        url: "git@github.com:tasshi-me/jest-md-dashboard.git",
      });
      const sha = await git.commit({
        fs: fsSync,
        dir: gitProject,
        message: "initial commit",
        author: { name: "test", email: "git@example.com" },
      });

      const actual = await buildPermalinkBaseUrl({
        jestRootDir: gitProject,
        log,
      });
      const expected = `https://github.com/tasshi-me/jest-md-dashboard/blob/${sha}/`;
      expect(actual).toBe(expected);
    });
    it("should return undefined if jest runs outside of git project", async () => {
      const nonGitProject = await fs.mkdtemp(
        path.join(os.tmpdir(), "jest-md-dashboard-")
      );
      const actual = await buildPermalinkBaseUrl({
        jestRootDir: nonGitProject,
        log: new Logger(true),
      });
      expect(actual).toBeUndefined();
    });
  });
});
