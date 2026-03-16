import { Store } from "../store.js";

type ResolveResult = { path: string } | { error: string };

export function resolveCommand(store: Store, alias?: string): ResolveResult {
  if (!alias) {
    return { error: "Usage: cdl resolve <alias>" };
  }
  const p = store.get(alias);
  if (!p) {
    return { error: `alias "${alias}" not found` };
  }
  return { path: p };
}
