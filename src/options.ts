import fs from "fs";
import path from "path";

import git from "isomorphic-git";

import { parseRemoteUrl } from "./git.js";

import { ReporterOptions } from "./index.js";

export const buildTitle = (title?: string): string => {
  return title ?? "Test Dashboard";
};

export const buildOutputPath = (outputPath?: string): string => {
  return outputPath ?? "test-dashboard.md";
};

export const buildPermalinkBaseUrl = async ({
  permalinkBaseUrl,
  jestRootDir,
}: {
  permalinkBaseUrl?: ReporterOptions["permalinkBaseUrl"];
  jestRootDir: string;
}): Promise<string | undefined> => {
  if (permalinkBaseUrl) {
    return permalinkBaseUrl;
  }

  if (process.env.GITHUB_ACTIONS) {
    if (
      !process.env.GITHUB_SERVER_URL ||
      !process.env.GITHUB_REPOSITORY ||
      !process.env.GITHUB_SHA ||
      !process.env.GITHUB_WORKSPACE
    ) {
      throw new Error(
        "The following environment variables are required for the GitHub Actions environment\n- GITHUB_SERVER_URL\n- GITHUB_REPOSITORY\n- GITHUB_SHA\n- GITHUB_WORKSPACE"
      );
    }
    const serverUrl = process.env.GITHUB_SERVER_URL;
    const repository = process.env.GITHUB_REPOSITORY;
    const commit = process.env.GITHUB_SHA;
    const rootDir = process.env.GITHUB_WORKSPACE;
    const subtree = path.relative(rootDir, jestRootDir);
    const trailingSlash =
      subtree.length > 0 && !subtree.endsWith("/") ? "/" : "";
    return `${serverUrl}/${repository}/blob/${commit}/${subtree}${trailingSlash}`;
  }

  const rootDir = await git
    .findRoot({ fs, filepath: jestRootDir })
    .then((dir) => dir)
    .catch(async () => undefined);
  if (rootDir === undefined) {
    console.log("permalink disabled because project is not a git repository");
    return undefined;
  }

  try {
    const remotes = await git.listRemotes({ fs, dir: rootDir });
    const remote = remotes.at(0);
    if (remote === undefined) {
      console.error("no remote URL found.");
      return undefined;
    }
    const { serverUrl, repository } = parseRemoteUrl(remote.url);
    const commit = await git.resolveRef({ fs, dir: rootDir, ref: "HEAD" });
    const subtree = path.relative(rootDir, jestRootDir);
    const trailingSlash =
      subtree.length > 0 && !subtree.endsWith("/") ? "/" : "";
    return `${serverUrl}/${repository}/blob/${commit}/${subtree}${trailingSlash}`;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
