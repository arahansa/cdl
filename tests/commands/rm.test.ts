import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../../src/store.js";
import { rmCommand } from "../../src/commands/rm.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("rmCommand", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should remove existing alias", () => {
    store.set("my-app", "/some/path");
    const msg = rmCommand(store, "my-app");
    expect(store.get("my-app")).toBeUndefined();
    expect(msg).toContain("Removed");
  });

  it("should return error for non-existent alias", () => {
    const msg = rmCommand(store, "nope");
    expect(msg).toContain("not found");
  });

  it("should return error when alias is missing", () => {
    const msg = rmCommand(store);
    expect(msg).toContain("Usage");
  });
});
