import "dotenv/config";
import { defineConfig } from "prisma/config";

const offlineMode = process.env.OFFLINE_MODE === 'true';
const defaultUrl = offlineMode ? 'file:./dev.db' : '';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || defaultUrl,
  },
});
