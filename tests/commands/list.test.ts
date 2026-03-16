import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../../src/store.js";
import { listCommand } from "../../src/commands/list.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("listCommand", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should show message when no links", () => {
    const msg = listCommand(store, false);
    expect(msg).toContain("No links");
  });

  it("should list all links with arrows", () => {
    store.set("app", "/path/app");
    store.set("docs", "/path/docs");
    const msg = listCommand(store, false);
    expect(msg).toContain("app");
    expect(msg).toContain("\u2192");
    expect(msg).toContain("/path/app");
    expect(msg).toContain("docs");
  });

  it("should align alias names", () => {
    store.set("a", "/path/a");
    store.set("long-name", "/path/long");
    const lines = listCommand(store, false).split("\n");
    const arrowPositions = lines.map((l) => l.indexOf("\u2192"));
    expect(arrowPositions[0]).toBe(arrowPositions[1]);
  });

  it("should output names only with --names flag", () => {
    store.set("b", "/path/b");
    store.set("a", "/path/a");
    const msg = listCommand(store, true);
    expect(msg).toBe("a\nb");
  });

  it("should show ports when present", () => {
    store.set("app", "/path/app", [3000, 5432]);
    const msg = listCommand(store, false);
    expect(msg).toContain("[ports: 3000, 5432]");
  });

  it("should not show ports bracket when no ports", () => {
    store.set("app", "/path/app");
    const msg = listCommand(store, false);
    expect(msg).not.toContain("[ports");
  });
});
