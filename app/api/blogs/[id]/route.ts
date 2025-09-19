import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogs } from '@/db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// GET - Get single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Skip auth for now
    const { id } = await params;
    const body = await request.json();
    
    const {
      title,
      content,
      excerpt,
      author,
      image,
      category,
      tags,
      readTime,
      status,
      publishedAt
    } = body;

    const updateData: any = {
      title,
      content,
      excerpt,
      author,
      image,
      category,
      tags: tags || [],
      readTime,
      status,
      updatedAt: new Date()
    };

    if (status === 'published' && publishedAt) {
      updateData.publishedAt = new Date(publishedAt);
    } else if (status === 'published' && !publishedAt) {
      updateData.publishedAt = new Date();
    }

    const [updatedBlog] = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, id))
      .returning();

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Skip auth for now
    const { id } = await params;

    const [deletedBlog] = await db
      .delete(blogs)
      .where(eq(blogs.id, id))
      .returning();

    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}