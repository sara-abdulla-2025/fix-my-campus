import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Solution } from '@/types';

// PUT /api/solutions/[id] - Update a solution (upvote)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { upvotes } = body;

    // Check if solution exists
    const solution = db.prepare('SELECT * FROM solutions WHERE id = ?').get(id) as any;
    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Update upvotes
    const newUpvotes = upvotes !== undefined ? upvotes : solution.upvotes + 1;
    
    db.prepare('UPDATE solutions SET upvotes = ? WHERE id = ?').run(newUpvotes, id);

    // Fetch updated solution
    const updatedSolution = db.prepare('SELECT * FROM solutions WHERE id = ?').get(id) as any;

    const formattedSolution: Solution = {
      ...updatedSolution,
      upvotes: updatedSolution.upvotes || 0,
      createdAt: new Date(updatedSolution.createdAt),
    };

    return NextResponse.json({ solution: formattedSolution }, { status: 200 });
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json(
      { error: 'Failed to update solution' },
      { status: 500 }
    );
  }
}

// DELETE /api/solutions/[id] - Delete a solution
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if solution exists
    const solution = db.prepare('SELECT * FROM solutions WHERE id = ?').get(id) as any;
    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Delete solution
    db.prepare('DELETE FROM solutions WHERE id = ?').run(id);

    return NextResponse.json(
      { message: 'Solution deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting solution:', error);
    return NextResponse.json(
      { error: 'Failed to delete solution' },
      { status: 500 }
    );
  }
}

