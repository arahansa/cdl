import { Store } from "../store.js";

export function rmCommand(store: Store, alias?: string): string {
  if (!alias) {
    return "Usage: cdl rm <alias>";
  }
  if (store.delete(alias)) {
    return `Removed: ${alias}`;
  }
  return `Error: alias "${alias}" not found`;
}
