import type { ContactDatabase, DatabaseResult, DatabaseStatement } from "../src/types/database";

export interface RemoteDatabaseEnv {
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_D1_DATABASE_ID?: string;
  CLOUDFLARE_D1_API_TOKEN?: string;
}
type Query = { sql: string; params: (string | null)[] };

/** Server-only D1 REST adapter for hosts without a Cloudflare Worker binding. */
export function remoteDatabase(env: RemoteDatabaseEnv, fetcher: typeof fetch = fetch): ContactDatabase | undefined {
  if (!/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID ?? "")
      || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(env.CLOUDFLARE_D1_DATABASE_ID ?? "")
      || !env.CLOUDFLARE_D1_API_TOKEN) return undefined;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_D1_DATABASE_ID}/query`;
  async function execute(queries: Query[]): Promise<DatabaseResult[]> {
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: { authorization: `Bearer ${env.CLOUDFLARE_D1_API_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify(queries.length === 1 ? queries[0] : { batch: queries }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("contact_database_unavailable");
    const data = await response.json() as { success?: boolean; result?: DatabaseResult[] };
    if (data.success !== true || !Array.isArray(data.result) || data.result.length !== queries.length
        || data.result.some(result => result.success !== true || (result.results !== undefined && !Array.isArray(result.results)))) {
      throw new Error("contact_database_unavailable");
    }
    return data.result.map(result => ({ success: true, results: result.results ?? [] }));
  }
  class Statement implements DatabaseStatement {
    constructor(readonly query: Query) {}
    bind(...values: (string | number | null)[]) {
      return new Statement({ sql: this.query.sql, params: values.map(value => value === null ? null : String(value)) });
    }
    async first<T = Record<string, unknown>>() {
      return (await execute([this.query]))[0].results[0] as T | undefined ?? null;
    }
    async all<T = Record<string, unknown>>() { return (await execute([this.query]))[0] as DatabaseResult<T>; }
    async run() { return (await execute([this.query]))[0]; }
  }
  return {
    prepare(sql) { return new Statement({ sql, params: [] }); },
    batch(statements) {
      if (!statements.length) return Promise.resolve([]);
      const queries = statements.map(statement => {
        if (!(statement instanceof Statement)) throw new Error("invalid_database_statement");
        return statement.query;
      });
      return execute(queries);
    },
  };
}
