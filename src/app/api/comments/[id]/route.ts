import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if comment exists
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as any;
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Delete comment
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

