import { Store } from "../store.js";

export function descCommand(store: Store, alias?: string, ...descArgs: string[]): string {
  if (!alias) {
    return "Usage: cdl desc <alias> [set <description> | rm]";
  }

  const entry = store.getEntry(alias);
  if (!entry) {
    return `Error: alias "${alias}" not found`;
  }

  const action = descArgs[0];

  if (!action) {
    return entry.description
      ? `${alias}: ${entry.description}`
      : `${alias}: no description`;
  }

  switch (action) {
    case "set": {
      const text = descArgs.slice(1).join(" ");
      if (!text) {
        return "Usage: cdl desc <alias> set <description>";
      }
      store.setDescription(alias, text);
      return `Description set for ${alias}: ${text}`;
    }
    case "rm": {
      store.setDescription(alias, null);
      return `Description removed from ${alias}`;
    }
    default: {
      // 인자가 action 없이 바로 텍스트로 올 경우 set으로 처리
      const text = descArgs.join(" ");
      store.setDescription(alias, text);
      return `Description set for ${alias}: ${text}`;
    }
  }
}
