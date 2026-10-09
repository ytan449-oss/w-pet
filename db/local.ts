import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ContactDatabase, DatabaseResult, DatabaseStatement } from "../src/types/database";

class LocalStatement implements DatabaseStatement {
  constructor(private sqlite: DatabaseSync, private query: string, private values: (string | number | null)[] = []) {}
  bind(...values: (string | number | null)[]) { return new LocalStatement(this.sqlite, this.query, values); }
  async first<T>() { return (this.sqlite.prepare(this.query).get(...this.values) ?? null) as T | null; }
  async all<T>() { return { success: true, results: this.sqlite.prepare(this.query).all(...this.values) as T[] }; }
  async run() { this.sqlite.prepare(this.query).run(...this.values); return { success: true, results: [] }; }
}

/** SQLite adapter for local development/tests, never bundled into the Worker. */
export function sqliteBinding(sqlite: DatabaseSync): ContactDatabase {
  return {
    prepare(query) { return new LocalStatement(sqlite, query); },
    async batch(statements) {
      sqlite.exec("BEGIN");
      try {
        const results: DatabaseResult[] = [];
        for (const statement of statements) results.push(await statement.all());
        sqlite.exec("COMMIT"); return results;
      } catch (error) { sqlite.exec("ROLLBACK"); throw error; }
    },
  };
}

export function migrateLocal(sqlite: DatabaseSync, root = process.cwd()) {
  sqlite.exec("CREATE TABLE IF NOT EXISTS _wpet_local_migrations (tag TEXT PRIMARY KEY)");
  const journal = JSON.parse(readFileSync(path.join(root, "drizzle/meta/_journal.json"), "utf8")) as { entries: { tag: string }[] };
  for (const { tag } of journal.entries) {
    if (sqlite.prepare("SELECT tag FROM _wpet_local_migrations WHERE tag=?").get(tag)) continue;
    sqlite.exec("BEGIN");
    try {
      sqlite.exec(readFileSync(path.join(root, "drizzle", `${tag}.sql`), "utf8"));
      sqlite.prepare("INSERT INTO _wpet_local_migrations(tag) VALUES (?)").run(tag);
      sqlite.exec("COMMIT");
    } catch (error) { sqlite.exec("ROLLBACK"); throw error; }
  }
}

export function openLocalDatabase() {
  mkdirSync(".sites-runtime", { recursive: true });
  const sqlite = new DatabaseSync(".sites-runtime/contact.sqlite");
  migrateLocal(sqlite);
  return sqliteBinding(sqlite);
}
