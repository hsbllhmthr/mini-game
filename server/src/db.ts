import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const offlineMode = process.env.OFFLINE_MODE !== 'false';

let prisma: PrismaClient;

if (offlineMode) {
  const tmpDir = path.resolve(__dirname, '../.tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  process.env.TEMP = tmpDir;
  process.env.TMP = tmpDir;
  process.env.SQLITE_TMPDIR = tmpDir;

  let dbPath = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^file:/, '') : './dev.db';
  console.log(`[Database] Initializing SQLite connection at: ${dbPath}`);

  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({ adapter });
} else {
  const { PrismaPg } = await import('@prisma/adapter-pg');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for PostgreSQL mode.');
  }
  console.log('[Database] Initializing PostgreSQL connection...');
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
}

export { prisma };
