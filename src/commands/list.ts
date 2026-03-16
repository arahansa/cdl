import { Store } from "../store.js";

export function listCommand(store: Store, namesOnly: boolean): string {
  const links = store.getAll();
  const entries = Object.entries(links).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return "No links registered. Use 'cdl add <alias>' to add one.";
  }

  if (namesOnly) {
    return entries.map(([name]) => name).join("\n");
  }

  const maxLen = Math.max(...entries.map(([name]) => name.length));
  return entries
    .map(([name, entry]) => {
      let line = `${name.padEnd(maxLen)}  \u2192 ${entry.path}`;
      if (entry.description) {
        line += `  (${entry.description})`;
      }
      if (entry.ports && entry.ports.length > 0) {
        line += `  [ports: ${entry.ports.join(", ")}]`;
      }
      return line;
    })
    .join("\n");
}
