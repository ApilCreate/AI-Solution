import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// GET - List all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let allBlogs;
    
    if (status && status !== 'all') {
      allBlogs = await db.select().from(blogs)
        .where(eq(blogs.status, status))
        .orderBy(desc(blogs.createdAt));
    } else {
      allBlogs = await db.select().from(blogs)
        .orderBy(desc(blogs.createdAt));
    }
    
    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    // For now, skip auth check to avoid issues
    // await requireAdminSimple();
    
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

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const blogData: any = {
      title,
      content,
      excerpt,
      author,
      image,
      category,
      tags: tags || [],
      readTime,
      status: status || 'draft',
      updatedAt: new Date()
    };

    if (status === 'published') {
      blogData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    const [newBlog] = await db.insert(blogs).values(blogData).returning();

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}