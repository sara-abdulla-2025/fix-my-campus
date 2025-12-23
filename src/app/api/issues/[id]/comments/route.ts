import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Comment } from '@/types';

// GET /api/issues/[id]/comments - Get all comments for an issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify issue exists
    const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(id) as any;
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Get all comments for this issue
    const comments = db
      .prepare('SELECT * FROM comments WHERE issueId = ? ORDER BY createdAt ASC')
      .all(id) as any[];

    // Convert dates from strings to Date objects
    const formattedComments: Comment[] = comments.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    }));

    return NextResponse.json({ comments: formattedComments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/issues/[id]/comments - Create a new comment for an issue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Verify issue exists
    const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(id) as any;
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Generate ID and timestamp
    const commentId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert comment into database
    const stmt = db.prepare(`
      INSERT INTO comments (id, content, issueId, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(commentId, content.trim(), id, now);

    // Fetch the created comment
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as any;

    const formattedComment: Comment = {
      ...comment,
      createdAt: new Date(comment.createdAt),
    };

    return NextResponse.json({ comment: formattedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}