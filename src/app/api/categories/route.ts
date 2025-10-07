import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Get single category by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: "Valid ID is required",
            code: "INVALID_ID" 
          },
          { status: 400 }
        );
      }

      const category = await db.select()
        .from(categories)
        .where(eq(categories.id, parseInt(id)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { 
            error: 'Category not found',
            code: "CATEGORY_NOT_FOUND"
          },
          { status: 404 }
        );
      }

      return NextResponse.json(category[0], { status: 200 });
    }

    // Get all categories sorted by name
    const allCategories = await db.select()
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(allCategories, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}