import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, events, profiles } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // eventId is required for GET requests
    if (!eventId) {
      return NextResponse.json(
        { 
          error: 'eventId parameter is required',
          code: 'MISSING_EVENT_ID' 
        },
        { status: 400 }
      );
    }

    // Build WHERE conditions
    const conditions = [];
    
    if (eventId) {
      const parsedEventId = parseInt(eventId);
      if (isNaN(parsedEventId)) {
        return NextResponse.json(
          { 
            error: 'Invalid eventId format',
            code: 'INVALID_EVENT_ID' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(reviews.eventId, parsedEventId));
    }

    if (userId) {
      conditions.push(eq(reviews.userId, userId));
    }

    // Query with LEFT JOINs to include user and event details
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;
    
    const reviewsList = await db
      .select({
        id: reviews.id,
        eventId: reviews.eventId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
        },
        event: {
          title: events.title,
        },
      })
      .from(reviews)
      .leftJoin(profiles, eq(reviews.userId, profiles.id))
      .leftJoin(events, eq(reviews.eventId, events.id))
      .where(whereCondition)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(reviewsList, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userId, rating, comment } = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { 
          error: 'eventId is required',
          code: 'MISSING_EVENT_ID' 
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { 
          error: 'userId is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { 
          error: 'rating is required',
          code: 'MISSING_RATING' 
        },
        { status: 400 }
      );
    }

    // Validate rating range (1-5)
    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { 
          error: 'rating must be an integer between 1 and 5',
          code: 'INVALID_RATING' 
        },
        { status: 400 }
      );
    }

    // Validate eventId format
    const parsedEventId = parseInt(eventId);
    if (isNaN(parsedEventId)) {
      return NextResponse.json(
        { 
          error: 'Invalid eventId format',
          code: 'INVALID_EVENT_ID' 
        },
        { status: 400 }
      );
    }

    // Validate event exists
    const eventExists = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.id, parsedEventId))
      .limit(1);

    if (eventExists.length === 0) {
      return NextResponse.json(
        { 
          error: 'Event not found',
          code: 'EVENT_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Prepare insert data
    const insertData = {
      eventId: parsedEventId,
      userId: userId.trim(),
      rating: parsedRating,
      comment: comment ? comment.trim() : null,
      createdAt: new Date().toISOString(),
    };

    // Insert review
    const newReview = await db
      .insert(reviews)
      .values(insertData)
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}