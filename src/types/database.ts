export interface DatabaseResult<T = Record<string, unknown>> { success: boolean; results: T[]; }
export interface DatabaseStatement {
  bind(...values: (string | number | null)[]): DatabaseStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<DatabaseResult<T>>;
  run(): Promise<DatabaseResult>;
}
export interface ContactDatabase {
  prepare(query: string): DatabaseStatement;
  batch(statements: DatabaseStatement[]): Promise<DatabaseResult[]>;
}
