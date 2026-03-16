// src/store.ts
import fs from "node:fs";
import path from "node:path";

export type LinkEntry = {
  path: string;
  ports?: number[];
  description?: string;
};

type Links = Record<string, LinkEntry>;

const LINKS_FILE = "links.json";

export class Store {
  private filePath: string;

  constructor(configDir: string) {
    this.filePath = path.join(configDir, LINKS_FILE);
  }

  getAll(): Links {
    if (!fs.existsSync(this.filePath)) return {};
    const raw = fs.readFileSync(this.filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return this.normalize(parsed);
  }

  get(alias: string): string | undefined {
    return this.getAll()[alias]?.path;
  }

  getEntry(alias: string): LinkEntry | undefined {
    return this.getAll()[alias];
  }

  set(alias: string, targetPath: string, ports?: number[], description?: string): void {
    const links = this.getAll();
    const existing = links[alias];
    const entry: LinkEntry = { path: targetPath };
    const mergedPorts = ports ?? existing?.ports;
    if (mergedPorts && mergedPorts.length > 0) {
      entry.ports = mergedPorts;
    }
    const mergedDesc = description ?? existing?.description;
    if (mergedDesc) {
      entry.description = mergedDesc;
    }
    links[alias] = entry;
    this.save(links);
  }

  delete(alias: string): boolean {
    const links = this.getAll();
    if (!(alias in links)) return false;
    delete links[alias];
    this.save(links);
    return true;
  }

  addPorts(alias: string, ports: number[]): boolean {
    const links = this.getAll();
    if (!(alias in links)) return false;
    const entry = links[alias];
    const existing = entry.ports ?? [];
    const merged = [...new Set([...existing, ...ports])].sort((a, b) => a - b);
    entry.ports = merged;
    links[alias] = entry;
    this.save(links);
    return true;
  }

  setDescription(alias: string, description: string | null): boolean {
    const links = this.getAll();
    if (!(alias in links)) return false;
    const entry = links[alias];
    if (description === null) {
      delete entry.description;
    } else {
      entry.description = description;
    }
    links[alias] = entry;
    this.save(links);
    return true;
  }

  removePorts(alias: string, ports: number[]): boolean {
    const links = this.getAll();
    if (!(alias in links)) return false;
    const entry = links[alias];
    const existing = entry.ports ?? [];
    const filtered = existing.filter((p) => !ports.includes(p));
    if (filtered.length > 0) {
      entry.ports = filtered;
    } else {
      delete entry.ports;
    }
    links[alias] = entry;
    this.save(links);
    return true;
  }

  names(): string[] {
    return Object.keys(this.getAll()).sort();
  }

  private normalize(raw: Record<string, unknown>): Links {
    const result: Links = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") {
        result[key] = { path: value };
      } else if (typeof value === "object" && value !== null && "path" in value) {
        result[key] = value as LinkEntry;
      }
    }
    return result;
  }

  private save(links: Links): void {
    const dir = path.dirname(this.filePath);
    if (!dir || !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(links, null, 2) + "\n");
  }
}
