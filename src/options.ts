import { Permalink } from "./dashboard/index.js";

import { ReporterOptions } from "./index.js";

export const buildTitle = (title?: string): string => {
  return title ?? "Test Dashboard";
};

export const buildOutputPath = (outputPath?: string): string => {
  return outputPath ?? "test-dashboard.md";
};

export const buildPermalink = (
  permalink?: ReporterOptions["permalink"]
): Permalink | undefined => {
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
