import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { venues, profiles } from '@/db/schema';
import { eq, like, and, gte, lte, asc, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single venue by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const venue = await db
        .select({
          id: venues.id,
          name: venues.name,
          address: venues.address,
          city: venues.city,
          area: venues.area,
          capacity: venues.capacity,
          amenities: venues.amenities,
          pricePerHour: venues.pricePerHour,
          images: venues.images,
          managerId: venues.managerId,
          createdAt: venues.createdAt,
          manager: {
            fullName: profiles.fullName,
            email: profiles.email,
            phone: profiles.phone,
          },
        })
        .from(venues)
        .leftJoin(profiles, eq(venues.managerId, profiles.id))
        .where(eq(venues.id, parseInt(id)))
        .limit(1);

      if (venue.length === 0) {
        return NextResponse.json(
          { error: 'Venue not found', code: 'VENUE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(venue[0], { status: 200 });
    }

    // List venues with filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const area = searchParams.get('area');
    const minCapacity = searchParams.get('minCapacity');
    const maxCapacity = searchParams.get('maxCapacity');
    const managerId = searchParams.get('managerId');

    let query = db
      .select({
        id: venues.id,
        name: venues.name,
        address: venues.address,
        city: venues.city,
        area: venues.area,
        capacity: venues.capacity,
        amenities: venues.amenities,
        pricePerHour: venues.pricePerHour,
        images: venues.images,
        managerId: venues.managerId,
        createdAt: venues.createdAt,
        manager: {
          fullName: profiles.fullName,
          email: profiles.email,
          phone: profiles.phone,
        },
      })
      .from(venues)
      .leftJoin(profiles, eq(venues.managerId, profiles.id));

    const conditions = [];

    if (search) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(
        or(
          like(venues.name, searchTerm),
          like(venues.address, searchTerm),
          like(venues.area, searchTerm)
        )
      );
    }

    if (area) {
      conditions.push(eq(venues.area, area.trim()));
    }

    if (minCapacity) {
      const min = parseInt(minCapacity);
      if (!isNaN(min)) {
        conditions.push(gte(venues.capacity, min));
      }
    }

    if (maxCapacity) {
      const max = parseInt(maxCapacity);
      if (!isNaN(max)) {
        conditions.push(lte(venues.capacity, max));
      }
    }

    if (managerId) {
      conditions.push(eq(venues.managerId, managerId.trim()));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(asc(venues.name))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, area, capacity, pricePerHour, managerId, amenities, images } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!address || address.trim() === '') {
      return NextResponse.json(
        { error: 'Address is required', code: 'MISSING_ADDRESS' },
        { status: 400 }
      );
    }

    if (!area || area.trim() === '') {
      return NextResponse.json(
        { error: 'Area is required', code: 'MISSING_AREA' },
        { status: 400 }
      );
    }

    if (!capacity || typeof capacity !== 'number') {
      return NextResponse.json(
        { error: 'Capacity is required and must be a number', code: 'INVALID_CAPACITY' },
        { status: 400 }
      );
    }

    if (capacity <= 0) {
      return NextResponse.json(
        { error: 'Capacity must be greater than 0', code: 'INVALID_CAPACITY_VALUE' },
        { status: 400 }
      );
    }

    if (pricePerHour === undefined || pricePerHour === null || typeof pricePerHour !== 'number') {
      return NextResponse.json(
        { error: 'Price per hour is required and must be a number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (pricePerHour < 0) {
      return NextResponse.json(
        { error: 'Price per hour must be greater than or equal to 0', code: 'INVALID_PRICE_VALUE' },
        { status: 400 }
      );
    }

    if (!managerId || managerId.trim() === '') {
      return NextResponse.json(
        { error: 'Manager ID is required', code: 'MISSING_MANAGER_ID' },
        { status: 400 }
      );
    }

    // Prepare venue data
    const venueData = {
      name: name.trim(),
      address: address.trim(),
      city: 'Pune',
      area: area.trim(),
      capacity,
      pricePerHour,
      managerId: managerId.trim(),
      amenities: amenities || [],
      images: images || [],
      createdAt: new Date().toISOString(),
    };

    // Insert venue
    const newVenue = await db.insert(venues).values(venueData).returning();

    return NextResponse.json(newVenue[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}