import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { leads } from './schema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const connectionString = process.env.DATABASE_URL;

export let pool: Pool | null = null;

function loadLocalLeads(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local leads.json:', err);
  }
  return [];
}

function saveLocalLeads(records: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local leads.json:', err);
  }
}

// In-memory / file-backed fallback implementation of Drizzle queries for development/standalone mode
class FallbackDb {
  select(fields?: any) {
    return {
      from: (_table: any) => {
        const queryPromise = Promise.resolve().then(() => {
          const rawLeads = loadLocalLeads();
          if (fields && fields.count !== undefined) {
            return [{ count: rawLeads.length }];
          }
          return rawLeads.map((l: any) => ({
            ...l,
            createdAt: l.createdAt ? new Date(l.createdAt) : (l.timestamp ? new Date(l.timestamp) : new Date()),
            consentAt: l.consentAt ? new Date(l.consentAt) : new Date(),
          }));
        });

        return Object.assign(queryPromise, {
          orderBy: (_clause: any) => {
            return Promise.resolve().then(() => {
              const rawLeads = loadLocalLeads();
              const formatted = rawLeads.map((l: any) => ({
                ...l,
                createdAt: l.createdAt ? new Date(l.createdAt) : (l.timestamp ? new Date(l.timestamp) : new Date()),
                consentAt: l.consentAt ? new Date(l.consentAt) : new Date(),
              }));
              return formatted.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
            });
          },
        });
      },
    };
  }

  insert(_table: any) {
    return {
      values: async (data: any) => {
        const current = loadLocalLeads();
        const record = {
          id: data.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
          createdAt: new Date().toISOString(),
          consentAt: new Date().toISOString(),
          status: 'new',
          ...data,
        };
        current.unshift(record);
        saveLocalLeads(current);
        return [record];
      },
    };
  }
}

let dbInstance: any;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    });
    dbInstance = drizzle(pool, { schema: { leads } });
  } catch (e) {
    console.warn('Failed to initialize PostgreSQL pool, falling back to local file storage:', e);
    dbInstance = new FallbackDb();
  }
} else {
  dbInstance = new FallbackDb();
}

export const db = dbInstance;

