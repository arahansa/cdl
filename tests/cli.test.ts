import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("CLI integration", () => {
  let tmpDir: string;
  const cli = (args: string[], env?: Record<string, string>) => {
    return execFileSync(
      "node",
      ["--import", "tsx", path.resolve("src/cli.ts"), ...args],
      {
        encoding: "utf-8",
        env: { ...process.env, ...env },
        cwd: process.cwd(),
      }
    ).trim();
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdl-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should show usage when no args", () => {
    const out = cli([], { CDL_CONFIG_DIR: tmpDir });
    expect(out).toContain("Usage");
  });

  it("should add and list a link", () => {
    cli(["add", "test-alias", "/tmp"], { CDL_CONFIG_DIR: tmpDir });
    const out = cli(["list"], { CDL_CONFIG_DIR: tmpDir });
    expect(out).toContain("test-alias");
    expect(out).toContain("/tmp");
  });

  it("should resolve a link", () => {
    cli(["add", "test-alias", "/tmp"], { CDL_CONFIG_DIR: tmpDir });
    const out = cli(["resolve", "test-alias"], { CDL_CONFIG_DIR: tmpDir });
    expect(out).toBe("/tmp");
  });

  it("should remove a link", () => {
    cli(["add", "test-alias", "/tmp"], { CDL_CONFIG_DIR: tmpDir });
    cli(["rm", "test-alias"], { CDL_CONFIG_DIR: tmpDir });
    const out = cli(["list"], { CDL_CONFIG_DIR: tmpDir });
    expect(out).toContain("No links");
  });
});
