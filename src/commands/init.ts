import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const MARKER_START = "# >>> cdl shell integration >>>";

export function initCommand(): string {
  const zshrc = path.join(os.homedir(), ".zshrc");

  if (fs.existsSync(zshrc)) {
    const content = fs.readFileSync(zshrc, "utf-8");
    if (content.includes(MARKER_START)) {
      return "cdl shell integration is already set up in .zshrc";
    }
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const shellScript = fs.readFileSync(
    path.join(__dirname, "..", "shell", "cdl.zsh"),
    "utf-8"
  );

  fs.appendFileSync(zshrc, "\n" + shellScript + "\n");

  return `cdl shell integration added to ${zshrc}\nRun 'source ~/.zshrc' or open a new terminal to activate.`;
}
