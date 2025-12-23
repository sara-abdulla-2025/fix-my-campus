import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Issue, IssueCategory } from '@/types';

// GET /api/issues - Get all issues (with optional category filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as IssueCategory | null;

    let query = 'SELECT * FROM issues';
    const params: any[] = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY createdAt DESC';

    const issues = db.prepare(query).all(...params) as any[];

    // Convert dates from strings to Date objects
    const formattedIssues: Issue[] = issues.map((issue) => ({
      ...issue,
      upvotes: issue.upvotes || 0,
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
    }));

    return NextResponse.json({ issues: formattedIssues }, { status: 200 });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

// POST /api/issues - Create a new issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category } = body;

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories: IssueCategory[] = ['registration', 'advising', 'accessibility', 'tech'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: registration, advising, accessibility, tech' },
        { status: 400 }
      );
    }

    // Generate ID
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO issues (id, title, description, category, upvotes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, title, description, category, 0, now, now);

    // Fetch the created issue
    const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(id) as any;

    const formattedIssue: Issue = {
      ...issue,
      upvotes: issue.upvotes || 0,
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
    };

    return NextResponse.json({ issue: formattedIssue }, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}