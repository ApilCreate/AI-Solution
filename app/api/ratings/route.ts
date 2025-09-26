import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { ratings, testimonials } from '../../../db/schema';
import { eq, desc, and, gte, lte, or, like, count, avg } from 'drizzle-orm';

// GET /api/ratings - Get all ratings with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const filter = searchParams.get('filter'); // 'week', 'month', '3months', '6months', 'year'
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build date filter
    let dateFilter;
    if (filter) {
      const now = new Date();
      switch (filter) {
        case 'week':
          dateFilter = gte(ratings.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
          break;
        case 'month':
          dateFilter = gte(ratings.createdAt, new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
          break;
        case '3months':
          dateFilter = gte(ratings.createdAt, new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
          break;
        case '6months':
          dateFilter = gte(ratings.createdAt, new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000));
          break;
        case 'year':
          dateFilter = gte(ratings.createdAt, new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000));
          break;
      }
    }

    // Build where conditions
    const whereConditions = [];
    if (status) {
      whereConditions.push(eq(ratings.status, status));
    }
    if (dateFilter) {
      whereConditions.push(dateFilter);
    }
    if (search) {
      whereConditions.push(
        or(
          like(ratings.name, `%${search}%`),
          like(ratings.email, `%${search}%`),
          like(ratings.comment, `%${search}%`)
        )
      );
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get ratings with pagination
    const ratingsData = await db
      .select()
      .from(ratings)
      .where(whereClause)
      .orderBy(desc(ratings.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(ratings)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Get rating statistics
    const totalCount = await db
      .select({ count: count() })
      .from(ratings)
      .where(dateFilter || undefined);

    const avgRating = await db
      .select({ avg: avg(ratings.rating) })
      .from(ratings)
      .where(dateFilter || undefined);

    const fiveStars = await db
      .select({ count: count() })
      .from(ratings)
      .where(and(dateFilter || undefined, eq(ratings.rating, 5)));

    const fourStars = await db
      .select({ count: count() })
      .from(ratings)
      .where(and(dateFilter || undefined, eq(ratings.rating, 4)));

    const threeStars = await db
      .select({ count: count() })
      .from(ratings)
      .where(and(dateFilter || undefined, eq(ratings.rating, 3)));

    const twoStars = await db
      .select({ count: count() })
      .from(ratings)
      .where(and(dateFilter || undefined, eq(ratings.rating, 2)));

    const oneStar = await db
      .select({ count: count() })
      .from(ratings)
      .where(and(dateFilter || undefined, eq(ratings.rating, 1)));

    const statsResult = {
      total: totalCount[0]?.count || 0,
      average: avgRating[0]?.avg ? parseFloat(avgRating[0].avg.toString()) : 0,
      fiveStars: fiveStars[0]?.count || 0,
      fourStars: fourStars[0]?.count || 0,
      threeStars: threeStars[0]?.count || 0,
      twoStars: twoStars[0]?.count || 0,
      oneStar: oneStar[0]?.count || 0,
    };

    return NextResponse.json({
      ratings: ratingsData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      stats: statsResult,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST /api/ratings - Create a new rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, rating, comment } = body;

    // Validate required fields
    if (!name || !email || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create the rating
    const newRating = await db
      .insert(ratings)
      .values({
        name,
        email,
        rating,
        comment,
        status: 'new',
      })
      .returning();

    return NextResponse.json(newRating[0], { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}
