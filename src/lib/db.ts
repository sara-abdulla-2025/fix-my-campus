import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'database.db');
export const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    issueId TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issueId) REFERENCES issues(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS solutions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    issueId TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issueId) REFERENCES issues(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
  CREATE INDEX IF NOT EXISTS idx_issues_createdAt ON issues(createdAt);
  CREATE INDEX IF NOT EXISTS idx_comments_issueId ON comments(issueId);
  CREATE INDEX IF NOT EXISTS idx_solutions_issueId ON solutions(issueId);
`);