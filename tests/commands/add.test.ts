import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../../src/store.js";
import { addCommand } from "../../src/commands/add.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("addCommand", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should add alias with explicit path", () => {
    const msg = addCommand(store, "my-app", "/some/path");
    expect(store.get("my-app")).toBe("/some/path");
    expect(msg).toContain("my-app");
  });

  it("should add alias with cwd when path omitted", () => {
    const msg = addCommand(store, "here");
    expect(store.get("here")).toBe(process.cwd());
    expect(msg).toContain("here");
  });

  it("should return error when alias is missing", () => {
    const msg = addCommand(store);
    expect(msg).toContain("Usage");
  });
});
