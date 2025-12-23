import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Issue } from '@/types';

// GET /api/issues/[id] - Get a single issue by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const issue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    const formattedIssue: Issue = {
      ...issue,
      upvotes: issue.upvotes || 0,
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
    };

    return NextResponse.json({ issue: formattedIssue }, { status: 200 });
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    );
  }
}

// PUT /api/issues/[id] - Update an issue (e.g., upvote, edit)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, category, upvotes } = body;

    // Check if issue exists
    const existingIssue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;
    if (!existingIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (category !== undefined) {
      // Validate category if provided
      const validCategories = ['registration', 'advising', 'accessibility', 'tech'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
      updates.push('category = ?');
      values.push(category);
    }
    if (upvotes !== undefined) {
      updates.push('upvotes = ?');
      values.push(upvotes);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Always update the updatedAt timestamp
    updates.push('"updatedAt" = ?');
    values.push(new Date().toISOString());
    values.push(id); // Add id for WHERE clause

    const updateQuery = `UPDATE issues SET ${updates.join(', ')} WHERE id = ?`;
    await db.prepare(updateQuery).run(...values);

    // Fetch updated issue
    const updatedIssue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;

    const formattedIssue: Issue = {
      ...updatedIssue,
      upvotes: updatedIssue.upvotes || 0,
      createdAt: new Date(updatedIssue.createdAt),
      updatedAt: new Date(updatedIssue.updatedAt),
    };

    return NextResponse.json({ issue: formattedIssue }, { status: 200 });
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { error: 'Failed to update issue' },
      { status: 500 }
    );
  }
}

// DELETE /api/issues/[id] - Delete an issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if issue exists
    const issue = (await db.prepare('SELECT * FROM issues WHERE id = ?').get(id)) as any;
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Delete issue (CASCADE will handle related comments and solutions)
    await db.prepare('DELETE FROM issues WHERE id = ?').run(id);

    return NextResponse.json(
      { message: 'Issue deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete issue' },
      { status: 500 }
    );
  }
}