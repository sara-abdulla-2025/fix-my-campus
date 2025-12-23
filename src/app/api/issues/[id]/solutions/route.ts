import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Solution } from '@/types';

// GET /api/issues/[id]/solutions - Get all solutions for an issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify issue exists
    const issue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Get all solutions for this issue, ordered by upvotes (descending) then by creation date
    const solutions = (await db
      .prepare('SELECT * FROM solutions WHERE "issueId" = ? ORDER BY upvotes DESC, "createdAt" ASC')
      .all(id)) as any[];

    // Convert dates from strings to Date objects
    const formattedSolutions: Solution[] = solutions.map((solution) => ({
      ...solution,
      upvotes: solution.upvotes || 0,
      createdAt: new Date(solution.createdAt),
    }));

    return NextResponse.json({ solutions: formattedSolutions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}

// POST /api/issues/[id]/solutions - Propose a new solution for an issue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description } = body;

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Solution title is required' },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Solution description is required' },
        { status: 400 }
      );
    }

    // Verify issue exists
    const issue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Generate ID and timestamp
    const solutionId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert solution into database
    const stmt = db.prepare(`
      INSERT INTO solutions (id, title, description, "issueId", upvotes, "createdAt")
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(solutionId, title.trim(), description.trim(), id, 0, now);

    // Fetch the created solution
    const solution = (await db.prepare('SELECT * FROM solutions WHERE id = ?').get(solutionId)) as any;

    const formattedSolution: Solution = {
      ...solution,
      upvotes: solution.upvotes || 0,
      createdAt: new Date(solution.createdAt),
    };

    return NextResponse.json({ solution: formattedSolution }, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);
    return NextResponse.json(
      { error: 'Failed to create solution' },
      { status: 500 }
    );
  }
}

