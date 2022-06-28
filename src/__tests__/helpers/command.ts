import child_process from "child_process";
import os from "os";

export const runJest = (configPath: string, env?: object) => {
  const jestCommand = `jest${os.platform() === "win32" ? ".cmd" : ""}`;
  return child_process.spawnSync(jestCommand, [`--config=${configPath}`], {
    env: {
      ...process.env,
      ...(env ? env : { GITHUB_REPOSITORY: undefined, GITHUB_SHA: undefined }),
    },
  });
};
