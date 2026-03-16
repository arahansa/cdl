#!/usr/bin/env node
// src/cli.ts
import path from "node:path";
import os from "node:os";
import { Store } from "./store.js";
import { addCommand } from "./commands/add.js";
import { rmCommand } from "./commands/rm.js";
import { listCommand } from "./commands/list.js";
import { resolveCommand } from "./commands/resolve.js";
import { initCommand } from "./commands/init.js";
import { portCommand } from "./commands/port.js";
import { descCommand } from "./commands/desc.js";

const configDir = process.env.CDL_CONFIG_DIR ?? path.join(os.homedir(), ".cdl");
const store = new Store(configDir);

const [command, ...args] = process.argv.slice(2);

const USAGE = `Usage: cdl <command>

Commands:
  add <alias> [path] [--port <port>...] [--desc <description>]
                                       Register a directory (default: current dir)
  rm <alias>                             Remove an alias
  list                                   List all aliases
  resolve <alias>                        Print path for alias (used by shell function)
  port <alias> <add|rm|list> [port...]   Manage ports for an alias
  desc <alias> [set <text> | rm]         Manage description for an alias
  init                                   Set up shell integration in .zshrc
  help                                   Show this help message`;

if (command === "help" || command === "--help" || command === "-h") {
  console.log(USAGE);
  process.exit(0);
}

switch (command) {
  case "add": {
    const { positional, ports, description } = parseAddArgs(args);
    console.log(addCommand(store, positional[0], positional[1], ports.length > 0 ? ports : undefined, description));
    break;
  }
  case "rm":
    console.log(rmCommand(store, args[0]));
    break;
  case "list":
    console.log(listCommand(store, args.includes("--names")));
    break;
  case "resolve": {
    const result = resolveCommand(store, args[0]);
    if ("path" in result) {
      process.stdout.write(result.path);
    } else {
      process.stderr.write(result.error + "\n");
      process.exit(1);
    }
    break;
  }
  case "port":
    console.log(portCommand(store, args[0], args[1], ...args.slice(2)));
    break;
  case "desc":
    console.log(descCommand(store, args[0], ...args.slice(1)));
    break;
  case "init":
    console.log(initCommand());
    break;
  default:
    console.log(USAGE);
    break;
}

function parseAddArgs(args: string[]): { positional: string[]; ports: number[]; description?: string } {
  const positional: string[] = [];
  const ports: number[] = [];
  let description: string | undefined;
  let i = 0;
  while (i < args.length) {
    if (args[i] === "--port") {
      i++;
      while (i < args.length && !args[i].startsWith("--")) {
        const n = parseInt(args[i], 10);
        if (!isNaN(n) && n > 0 && n <= 65535) {
          ports.push(n);
        }
        i++;
      }
    } else if (args[i] === "--desc") {
      i++;
      if (i < args.length) {
        description = args[i];
        i++;
      }
    } else {
      positional.push(args[i]);
      i++;
    }
  }
  return { positional, ports, description };
}
