import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const offlineMode = process.env.OFFLINE_MODE === 'true';

let prisma: PrismaClient;

if (offlineMode) {
  // Override temp directory for SQLite to avoid ENOSPC on full C: drive
  const tmpDir = path.resolve(__dirname, '../.tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  process.env.TEMP = tmpDir;
  process.env.TMP = tmpDir;
  process.env.SQLITE_TMPDIR = tmpDir;
  console.log(`[Database] SQLite temporary directory overridden to: ${tmpDir}`);

  // Dynamically import adapter to avoid loading pg dependencies in offline mode
  const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
  
  const dbPath = process.env.DATABASE_URL || 'file:./dev.db';
  console.log(`[Database] Initializing SQLite connection at: ${dbPath}`);
  
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({ adapter });

  // Set pragmas on SQLite client for memory operations and journaling optimization
  try {
    await prisma.$executeRawUnsafe('PRAGMA temp_store = MEMORY;');
    await prisma.$executeRawUnsafe('PRAGMA journal_mode = WAL;');
    console.log('[Database] Applied SQLite PRAGMA configuration successfully.');
  } catch (err) {
    console.warn('[Database] Failed to set SQLite pragmas:', err);
  }
} else {
  // Dynamically import adapter to avoid loading SQLite native dependencies in online mode
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
