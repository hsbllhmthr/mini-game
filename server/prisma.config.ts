import "dotenv/config";
import { defineConfig } from "prisma/config";

const offlineMode = process.env.OFFLINE_MODE !== 'false';
let dbUrl = process.env.DATABASE_URL;
if (offlineMode && (!dbUrl || !dbUrl.startsWith('file:'))) {
  dbUrl = 'file:./dev.db';
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl || 'file:./dev.db',
  },
});
