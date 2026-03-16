import { Store } from "../store.js";

export function portCommand(store: Store, alias?: string, action?: string, ...portArgs: string[]): string {
  if (!alias) {
    const all = store.getAll();
    const entries = Object.entries(all).filter(([, e]) => e.ports && e.ports.length > 0);
    if (entries.length === 0) {
      return "No ports registered";
    }
    return entries
      .map(([name, e]) => `${name}: ${e.ports!.join(", ")}`)
      .join("\n");
  }

  if (!action) {
    return "Usage: cdl port <alias> <add|rm|list> [port...]";
  }

  const entry = store.getEntry(alias);
  if (!entry) {
    return `Error: alias "${alias}" not found`;
  }

  switch (action) {
    case "add": {
      const ports = parsePorts(portArgs);
      if (ports.length === 0) {
        return "Usage: cdl port <alias> add <port> [port...]";
      }
      store.addPorts(alias, ports);
      return `Added ports to ${alias}: ${ports.join(", ")}`;
    }
    case "rm": {
      const ports = parsePorts(portArgs);
      if (ports.length === 0) {
        return "Usage: cdl port <alias> rm <port> [port...]";
      }
      store.removePorts(alias, ports);
      return `Removed ports from ${alias}: ${ports.join(", ")}`;
    }
    case "list": {
      const ports = entry.ports ?? [];
      if (ports.length === 0) {
        return `${alias}: no ports registered`;
      }
      return `${alias}: ${ports.join(", ")}`;
    }
    default:
      return `Unknown action "${action}". Use add, rm, or list.`;
  }
}

function parsePorts(args: string[]): number[] {
  const ports: number[] = [];
  for (const arg of args) {
    const n = parseInt(arg, 10);
    if (!isNaN(n) && n > 0 && n <= 65535) {
      ports.push(n);
    }
  }
  return ports;
}
