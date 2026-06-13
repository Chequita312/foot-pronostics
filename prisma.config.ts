import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma CLI ne charge pas .env.local — on le fait ici pour migrate/introspect
try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.POSTGRES_URL_NON_POOLING,
  },
});
