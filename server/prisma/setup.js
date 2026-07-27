import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'schema.prisma.template');
const schemaPath = path.join(__dirname, 'schema.prisma');

const offlineMode = process.env.OFFLINE_MODE === 'true';
const provider = offlineMode ? 'sqlite' : 'postgresql';

console.log(`[Prisma Setup] Setting up database schema...`);
console.log(`[Prisma Setup] OFFLINE_MODE is ${offlineMode ? 'ENABLED (using SQLite)' : 'DISABLED (using PostgreSQL)'}`);

try {
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace DATABASE_PROVIDER placeholder
  let schemaContent = template.replace('DATABASE_PROVIDER', provider);
  
  // If we are using SQLite, ensure DATABASE_URL starts with file:
  if (offlineMode && (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:'))) {
    console.log(`[Prisma Setup] Overriding DATABASE_URL for SQLite offline mode to local 'file:./dev.db'.`);
    process.env.DATABASE_URL = 'file:./dev.db';
  }

  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log(`[Prisma Setup] Generated schema.prisma with '${provider}' provider successfully!`);
} catch (error) {
  console.error('[Prisma Setup] Error generating schema.prisma:', error);
  process.exit(1);
}
