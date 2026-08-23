import postgres from "postgres";

const globalForSql = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export const sql =
  globalForSql.sql ??
  postgres(process.env.DATABASE_URL || "", {
    onnotice: () => {},
  });

if (process.env.NODE_ENV !== "production") {
  globalForSql.sql = sql;
}
