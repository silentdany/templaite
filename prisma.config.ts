import "dotenv/config";
import { defineConfig } from "prisma/config";

// CLI (migrate, introspect) should use a direct Supabase session port (5432). Runtime app uses pooled `DATABASE_URL` in src/lib/prisma.ts.
const directUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: directUrl,
  },
});
