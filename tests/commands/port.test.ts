import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../../src/store.js";
import { portCommand } from "../../src/commands/port.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("portCommand", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should show no ports message when no args", () => {
    const msg = portCommand(store);
    expect(msg).toContain("No ports registered");
  });

  it("should show usage when alias only", () => {
    const msg = portCommand(store, "app");
    expect(msg).toContain("Usage");
  });

  it("should return error for non-existent alias", () => {
    const msg = portCommand(store, "nope", "list");
    expect(msg).toContain("not found");
  });

  it("should add ports to alias", () => {
    store.set("app", "/path/app");
    const msg = portCommand(store, "app", "add", "3000", "5432");
    expect(msg).toContain("Added ports");
    expect(store.getEntry("app")?.ports).toEqual([3000, 5432]);
  });

  it("should show usage when add with no ports", () => {
    store.set("app", "/path/app");
    const msg = portCommand(store, "app", "add");
    expect(msg).toContain("Usage");
  });

  it("should remove ports from alias", () => {
    store.set("app", "/path/app", [3000, 5432]);
    const msg = portCommand(store, "app", "rm", "5432");
    expect(msg).toContain("Removed ports");
    expect(store.getEntry("app")?.ports).toEqual([3000]);
  });

  it("should list ports", () => {
    store.set("app", "/path/app", [3000, 5432]);
    const msg = portCommand(store, "app", "list");
    expect(msg).toBe("app: 3000, 5432");
  });

  it("should show no ports message", () => {
    store.set("app", "/path/app");
    const msg = portCommand(store, "app", "list");
    expect(msg).toContain("no ports");
  });

  it("should return error for unknown action", () => {
    store.set("app", "/path/app");
    const msg = portCommand(store, "app", "foo");
    expect(msg).toContain("Unknown action");
  });

  it("should ignore invalid port numbers", () => {
    store.set("app", "/path/app");
    const msg = portCommand(store, "app", "add", "abc", "0", "70000");
    expect(msg).toContain("Usage");
  });
});
