import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString && process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production (use the Supabase pooler URL).");
  }

  const adapter = new PrismaPg({
    connectionString:
      connectionString ??
      "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
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
