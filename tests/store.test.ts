// tests/store.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Store } from "../src/store.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("Store", () => {
  let tmpDir: string;
  let store: Store;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
    store = new Store(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should return empty object when no links file exists", () => {
    expect(store.getAll()).toEqual({});
  });

  it("should set and get a link", () => {
    store.set("my-app", "/some/path");
    expect(store.get("my-app")).toBe("/some/path");
  });

  it("should overwrite existing alias", () => {
    store.set("my-app", "/old/path");
    store.set("my-app", "/new/path");
    expect(store.get("my-app")).toBe("/new/path");
  });

  it("should return undefined for non-existent alias", () => {
    expect(store.get("nope")).toBeUndefined();
  });

  it("should delete a link", () => {
    store.set("my-app", "/some/path");
    const deleted = store.delete("my-app");
    expect(deleted).toBe(true);
    expect(store.get("my-app")).toBeUndefined();
  });

  it("should return false when deleting non-existent alias", () => {
    expect(store.delete("nope")).toBe(false);
  });

  it("should return all links as LinkEntry objects", () => {
    store.set("a", "/path/a");
    store.set("b", "/path/b");
    expect(store.getAll()).toEqual({
      a: { path: "/path/a" },
      b: { path: "/path/b" },
    });
  });

  it("should return all alias names", () => {
    store.set("b", "/path/b");
    store.set("a", "/path/a");
    expect(store.names()).toEqual(["a", "b"]);
  });

  it("should create config directory if it does not exist", () => {
    const nested = path.join(tmpDir, "sub", "dir");
    const s = new Store(nested);
    s.set("x", "/path/x");
    expect(fs.existsSync(nested)).toBe(true);
  });

  it("should migrate legacy string format to LinkEntry", () => {
    const filePath = path.join(tmpDir, "links.json");
    fs.writeFileSync(filePath, JSON.stringify({ legacy: "/old/path" }));
    const all = store.getAll();
    expect(all).toEqual({ legacy: { path: "/old/path" } });
  });

  describe("ports", () => {
    it("should set a link with ports", () => {
      store.set("my-app", "/some/path", [3000, 5432]);
      const entry = store.getEntry("my-app");
      expect(entry).toEqual({ path: "/some/path", ports: [3000, 5432] });
    });

    it("should add ports to existing alias", () => {
      store.set("my-app", "/some/path");
      store.addPorts("my-app", [3000]);
      store.addPorts("my-app", [5432, 3000]);
      const entry = store.getEntry("my-app");
      expect(entry?.ports).toEqual([3000, 5432]);
    });

    it("should return false when adding ports to non-existent alias", () => {
      expect(store.addPorts("nope", [3000])).toBe(false);
    });

    it("should remove ports from existing alias", () => {
      store.set("my-app", "/some/path", [3000, 5432, 8080]);
      store.removePorts("my-app", [5432]);
      const entry = store.getEntry("my-app");
      expect(entry?.ports).toEqual([3000, 8080]);
    });

    it("should remove ports field when all ports removed", () => {
      store.set("my-app", "/some/path", [3000]);
      store.removePorts("my-app", [3000]);
      const entry = store.getEntry("my-app");
      expect(entry?.ports).toBeUndefined();
    });

    it("should return false when removing ports from non-existent alias", () => {
      expect(store.removePorts("nope", [3000])).toBe(false);
    });

    it("should preserve existing ports when overwriting path", () => {
      store.set("my-app", "/old/path", [3000]);
      store.set("my-app", "/new/path");
      const entry = store.getEntry("my-app");
      expect(entry).toEqual({ path: "/new/path", ports: [3000] });
    });

    it("should not include ports key when no ports", () => {
      store.set("my-app", "/some/path");
      const raw = fs.readFileSync(path.join(tmpDir, "links.json"), "utf-8");
      const parsed = JSON.parse(raw);
      expect(parsed["my-app"]).toEqual({ path: "/some/path" });
      expect("ports" in parsed["my-app"]).toBe(false);
    });
  });
});
