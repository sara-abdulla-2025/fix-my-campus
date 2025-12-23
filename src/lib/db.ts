import { sql } from '@vercel/postgres';

// Initialize tables (run once on first connection)
let initialized = false;

async function ensureTables() {
  if (initialized) return;
  
  try {
    // Create tables one by one to handle errors better
    await sql`
      CREATE TABLE IF NOT EXISTS issues (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        upvotes INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(255) PRIMARY KEY,
        content TEXT NOT NULL,
        "issueId" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("issueId") REFERENCES issues(id) ON DELETE CASCADE
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS solutions (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        "issueId" VARCHAR(255) NOT NULL,
        upvotes INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("issueId") REFERENCES issues(id) ON DELETE CASCADE
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_issues_createdAt ON issues("createdAt")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_issueId ON comments("issueId")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_solutions_issueId ON solutions("issueId")`;
    
    initialized = true;
  } catch (error: any) {
    // Tables might already exist, that's okay
    if (!error.message?.includes('already exists')) {
      console.error('Tables initialization error:', error);
    }
    initialized = true;
  }
}

// Helper to convert ? placeholders to PostgreSQL $1, $2, etc.
function convertQuery(query: string, params: any[]): { text: string; values: any[] } {
  let paramIndex = 1;
  const values: any[] = [];
  const text = query.replace(/\?/g, () => {
    values.push(params[paramIndex - 1]);
    return `$${paramIndex++}`;
  });
  return { text, values };
}

// Wrapper to make PostgreSQL queries similar to SQLite's prepare/get pattern
export const db = {
  // Helper methods to match SQLite API
  prepare(query: string) {
    return {
      get: async (...params: any[]) => {
        await ensureTables();
        const { text, values } = convertQuery(query, params);
        const result = await sql.query(text, values);
        return result.rows[0] || null;
      },
      all: async (...params: any[]) => {
        await ensureTables();
        const { text, values } = convertQuery(query, params);
        const result = await sql.query(text, values);
        return result.rows;
      },
      run: async (...params: any[]) => {
        await ensureTables();
        const { text, values } = convertQuery(query, params);
        await sql.query(text, values);
        return { changes: 0 }; // PostgreSQL doesn't return changes like SQLite
      },
    };
  },
  
  exec: async (query: string) => {
    await ensureTables();
    await sql.query(query);
  },
};
