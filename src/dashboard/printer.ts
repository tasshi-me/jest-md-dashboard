import { Dashboard, Describe, Test } from "./types.js";

export const printDashBoard = (dashboard: Dashboard): string => {
  let resultText = `# ${dashboard.title}\n\n`;
  for (const file of dashboard.testFiles) {
    const link = file.permalink ? ` [[link](${file.permalink})]` : "";
    resultText += `## ${file.filePath}${link}\n`;
    resultText += printChildren(file.children);
  }

  return resultText;
};

const printChildren = (
  children: Array<Test | Describe>,
  currentLevel: number = 0
): string => {
  let resultText = "";
  for (const child of children) {
    switch (child.type) {
      case "test":
        resultText += `${"  ".repeat(currentLevel)}- ${child.title}\n`;
        break;
      case "describe":
        resultText += `${"  ".repeat(currentLevel)}- ${child.describe}\n`;
        resultText += printChildren(child.children, currentLevel + 1);
        break;
      default:
        throw new Error("Illegal state");
    }
  }
  return resultText;
};
