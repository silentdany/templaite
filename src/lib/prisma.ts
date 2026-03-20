import { PrismaPg } from "@prisma/adapter-pg";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { PrismaClient } from "../generated/prisma/client";

function resolveConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (url) return url;

  const isProdBuild =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

  if (process.env.NODE_ENV === "production" && !isProdBuild) {
    throw new Error(
      "DATABASE_URL is required in production (use the Supabase pooler URL).",
    );
  }

  return "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: resolveConnectionString(),
  });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
