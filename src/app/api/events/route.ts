import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { events, venues, categories, profiles } from '@/db/schema';
import { eq, like, and, desc, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single event fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const result = await db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          categoryId: events.categoryId,
          venueId: events.venueId,
          managerId: events.managerId,
          startDate: events.startDate,
          endDate: events.endDate,
          ticketPrice: events.ticketPrice,
          totalSeats: events.totalSeats,
          availableSeats: events.availableSeats,
          status: events.status,
          imageUrl: events.imageUrl,
          tags: events.tags,
          createdAt: events.createdAt,
          updatedAt: events.updatedAt,
          venue: {
            id: venues.id,
            name: venues.name,
            address: venues.address,
            city: venues.city,
            area: venues.area,
            capacity: venues.capacity,
            amenities: venues.amenities,
            pricePerHour: venues.pricePerHour,
          },
          category: {
            id: categories.id,
            name: categories.name,
            description: categories.description,
            icon: categories.icon,
          },
          manager: {
            id: profiles.id,
            fullName: profiles.fullName,
            email: profiles.email,
            phone: profiles.phone,
          },
        })
        .from(events)
        .leftJoin(venues, eq(events.venueId, venues.id))
        .leftJoin(categories, eq(events.categoryId, categories.id))
        .leftJoin(profiles, eq(events.managerId, profiles.id))
        .where(eq(events.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List events with filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const venueId = searchParams.get('venueId');
    const status = searchParams.get('status');
    const area = searchParams.get('area');

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(events.title, `%${search}%`),
          like(events.description, `%${search}%`)
        )
      );
    }

    if (categoryId && !isNaN(parseInt(categoryId))) {
      conditions.push(eq(events.categoryId, parseInt(categoryId)));
    }

    if (venueId && !isNaN(parseInt(venueId))) {
      conditions.push(eq(events.venueId, parseInt(venueId)));
    }

    if (status) {
      conditions.push(eq(events.status, status.trim()));
    }

    if (area) {
      conditions.push(like(venues.area, `%${area}%`));
    }

    let query = db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        categoryId: events.categoryId,
        venueId: events.venueId,
        managerId: events.managerId,
        startDate: events.startDate,
        endDate: events.endDate,
        ticketPrice: events.ticketPrice,
        totalSeats: events.totalSeats,
        availableSeats: events.availableSeats,
        status: events.status,
        imageUrl: events.imageUrl,
        tags: events.tags,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        venue: {
          id: venues.id,
          name: venues.name,
          address: venues.address,
          city: venues.city,
          area: venues.area,
          capacity: venues.capacity,
          amenities: venues.amenities,
          pricePerHour: venues.pricePerHour,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          icon: categories.icon,
        },
      })
      .from(events)
      .leftJoin(venues, eq(events.venueId, venues.id))
      .leftJoin(categories, eq(events.categoryId, categories.id))
      .orderBy(desc(events.startDate));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const {
      title,
      description,
      categoryId,
      venueId,
      managerId,
      startDate,
      endDate,
      ticketPrice,
      totalSeats,
      imageUrl,
      tags,
    } = body;

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'TITLE_REQUIRED' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required', code: 'CATEGORY_ID_REQUIRED' },
        { status: 400 }
      );
    }

    if (!venueId) {
      return NextResponse.json(
        { error: 'Venue ID is required', code: 'VENUE_ID_REQUIRED' },
        { status: 400 }
      );
    }

    if (!managerId) {
      return NextResponse.json(
        { error: 'Manager ID is required', code: 'MANAGER_ID_REQUIRED' },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { error: 'Start date is required', code: 'START_DATE_REQUIRED' },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { error: 'End date is required', code: 'END_DATE_REQUIRED' },
        { status: 400 }
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        {
          error: 'Start date must be before end date',
          code: 'INVALID_DATE_RANGE',
        },
        { status: 400 }
      );
    }

    if (ticketPrice === undefined || ticketPrice === null) {
      return NextResponse.json(
        { error: 'Ticket price is required', code: 'TICKET_PRICE_REQUIRED' },
        { status: 400 }
      );
    }

    if (ticketPrice < 0) {
      return NextResponse.json(
        {
          error: 'Ticket price must be greater than or equal to 0',
          code: 'INVALID_TICKET_PRICE',
        },
        { status: 400 }
      );
    }

    if (!totalSeats || totalSeats <= 0) {
      return NextResponse.json(
        {
          error: 'Total seats must be greater than 0',
          code: 'INVALID_TOTAL_SEATS',
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newEvent = await db
      .insert(events)
      .values({
        title: title.trim(),
        description: description ? description.trim() : null,
        categoryId,
        venueId,
        managerId: managerId.trim(),
        startDate,
        endDate,
        ticketPrice,
        totalSeats,
        availableSeats: totalSeats,
        status: 'upcoming',
        imageUrl: imageUrl ? imageUrl.trim() : null,
        tags: tags || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      categoryId,
      venueId,
      startDate,
      endDate,
      ticketPrice,
      totalSeats,
      availableSeats,
      status,
      imageUrl,
      tags,
    } = body;

    // Check if event exists
    const existingEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validation
    if (title !== undefined && title.trim() === '') {
      return NextResponse.json(
        { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        {
          error: 'Start date must be before end date',
          code: 'INVALID_DATE_RANGE',
        },
        { status: 400 }
      );
    }

    if (ticketPrice !== undefined && ticketPrice < 0) {
      return NextResponse.json(
        {
          error: 'Ticket price must be greater than or equal to 0',
          code: 'INVALID_TICKET_PRICE',
        },
        { status: 400 }
      );
    }

    if (totalSeats !== undefined && totalSeats <= 0) {
      return NextResponse.json(
        {
          error: 'Total seats must be greater than 0',
          code: 'INVALID_TOTAL_SEATS',
        },
        { status: 400 }
      );
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined)
      updates.description = description ? description.trim() : null;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (venueId !== undefined) updates.venueId = venueId;
    if (startDate !== undefined) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (ticketPrice !== undefined) updates.ticketPrice = ticketPrice;
    if (totalSeats !== undefined) updates.totalSeats = totalSeats;
    if (availableSeats !== undefined) updates.availableSeats = availableSeats;
    if (status !== undefined) updates.status = status.trim();
    if (imageUrl !== undefined)
      updates.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (tags !== undefined) updates.tags = tags;

    const updatedEvent = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedEvent[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Event deleted successfully',
        eventId: deletedEvent[0].id,
        event: deletedEvent[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}