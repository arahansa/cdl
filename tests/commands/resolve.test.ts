import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../../src/store.js";
import { resolveCommand } from "../../src/commands/resolve.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("resolveCommand", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should return path for existing alias", () => {
    store.set("my-app", "/some/path");
    const result = resolveCommand(store, "my-app");
    expect(result).toEqual({ path: "/some/path" });
  });

  it("should return error for non-existent alias", () => {
    const result = resolveCommand(store, "nope");
    expect(result).toEqual({ error: 'alias "nope" not found' });
  });

  it("should return error when alias is missing", () => {
    const result = resolveCommand(store);
    expect(result).toEqual({ error: "Usage: cdl resolve <alias>" });
  });
});
