import { Store } from "../store.js";

export function addCommand(store: Store, alias?: string, targetPath?: string, ports?: number[], description?: string): string {
  if (!alias) {
    return "Usage: cdl add <alias> [path] [--port <port>...] [--desc <description>]";
  }
  const resolved = targetPath ?? process.cwd();
  store.set(alias, resolved, ports, description);
  let msg = `Added: ${alias} → ${resolved}`;
  if (ports && ports.length > 0) {
    msg += ` (ports: ${ports.join(", ")})`;
  }
  if (description) {
    msg += ` (${description})`;
  }
  return msg;
}
