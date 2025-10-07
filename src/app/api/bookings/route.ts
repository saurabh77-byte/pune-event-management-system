import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, events, profiles, venues } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single booking by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const booking = await db
        .select({
          id: bookings.id,
          eventId: bookings.eventId,
          userId: bookings.userId,
          numberOfTickets: bookings.numberOfTickets,
          totalAmount: bookings.totalAmount,
          bookingStatus: bookings.bookingStatus,
          paymentStatus: bookings.paymentStatus,
          bookingDate: bookings.bookingDate,
          createdAt: bookings.createdAt,
          event: {
            id: events.id,
            title: events.title,
            startDate: events.startDate,
            endDate: events.endDate,
            imageUrl: events.imageUrl,
            ticketPrice: events.ticketPrice,
            venueId: events.venueId,
          },
          user: {
            id: profiles.id,
            fullName: profiles.fullName,
            email: profiles.email,
            phone: profiles.phone,
          },
          venue: {
            id: venues.id,
            name: venues.name,
            address: venues.address,
            city: venues.city,
            area: venues.area,
          },
        })
        .from(bookings)
        .leftJoin(events, eq(bookings.eventId, events.id))
        .leftJoin(profiles, eq(bookings.userId, profiles.id))
        .leftJoin(venues, eq(events.venueId, venues.id))
        .where(eq(bookings.id, parseInt(id)))
        .limit(1);

      if (booking.length === 0) {
        return NextResponse.json(
          { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(booking[0], { status: 200 });
    }

    // List bookings with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    const bookingStatus = searchParams.get('bookingStatus');
    const paymentStatus = searchParams.get('paymentStatus');

    let query = db
      .select({
        id: bookings.id,
        eventId: bookings.eventId,
        userId: bookings.userId,
        numberOfTickets: bookings.numberOfTickets,
        totalAmount: bookings.totalAmount,
        bookingStatus: bookings.bookingStatus,
        paymentStatus: bookings.paymentStatus,
        bookingDate: bookings.bookingDate,
        createdAt: bookings.createdAt,
        event: {
          id: events.id,
          title: events.title,
          startDate: events.startDate,
          endDate: events.endDate,
          imageUrl: events.imageUrl,
          ticketPrice: events.ticketPrice,
          venueId: events.venueId,
        },
        user: {
          id: profiles.id,
          fullName: profiles.fullName,
          email: profiles.email,
          phone: profiles.phone,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          address: venues.address,
          city: venues.city,
          area: venues.area,
        },
      })
      .from(bookings)
      .leftJoin(events, eq(bookings.eventId, events.id))
      .leftJoin(profiles, eq(bookings.userId, profiles.id))
      .leftJoin(venues, eq(events.venueId, venues.id));

    // Apply filters
    const conditions = [];
    if (userId) {
      conditions.push(eq(bookings.userId, userId));
    }
    if (eventId) {
      if (isNaN(parseInt(eventId))) {
        return NextResponse.json(
          { error: 'Valid event ID is required', code: 'INVALID_EVENT_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(bookings.eventId, parseInt(eventId)));
    }
    if (bookingStatus) {
      conditions.push(eq(bookings.bookingStatus, bookingStatus));
    }
    if (paymentStatus) {
      conditions.push(eq(bookings.paymentStatus, paymentStatus));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { eventId, userId, numberOfTickets } = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required', code: 'MISSING_EVENT_ID' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!numberOfTickets || numberOfTickets <= 0) {
      return NextResponse.json(
        {
          error: 'Number of tickets must be greater than 0',
          code: 'INVALID_TICKET_COUNT',
        },
        { status: 400 }
      );
    }

    // Validate event exists and get event details
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(eventId)))
      .limit(1);

    if (event.length === 0) {
      return NextResponse.json(
        { error: 'Event not found', code: 'EVENT_NOT_FOUND' },
        { status: 400 }
      );
    }

    const eventData = event[0];

    // Check if enough seats are available
    if (eventData.availableSeats < numberOfTickets) {
      return NextResponse.json(
        {
          error: `Not enough seats available. Only ${eventData.availableSeats} seats remaining.`,
          code: 'INSUFFICIENT_SEATS',
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = numberOfTickets * eventData.ticketPrice;

    // Create booking
    const currentTimestamp = new Date().toISOString();
    const newBooking = await db
      .insert(bookings)
      .values({
        eventId: parseInt(eventId),
        userId,
        numberOfTickets,
        totalAmount,
        bookingStatus: 'pending',
        paymentStatus: 'pending',
        bookingDate: currentTimestamp,
        createdAt: currentTimestamp,
      })
      .returning();

    // Update event's available seats
    await db
      .update(events)
      .set({
        availableSeats: eventData.availableSeats - numberOfTickets,
        updatedAt: currentTimestamp,
      })
      .where(eq(events.id, parseInt(eventId)));

    // Fetch complete booking details with event information
    const bookingWithDetails = await db
      .select({
        id: bookings.id,
        eventId: bookings.eventId,
        userId: bookings.userId,
        numberOfTickets: bookings.numberOfTickets,
        totalAmount: bookings.totalAmount,
        bookingStatus: bookings.bookingStatus,
        paymentStatus: bookings.paymentStatus,
        bookingDate: bookings.bookingDate,
        createdAt: bookings.createdAt,
        event: {
          id: events.id,
          title: events.title,
          startDate: events.startDate,
          endDate: events.endDate,
          imageUrl: events.imageUrl,
          ticketPrice: events.ticketPrice,
          venueId: events.venueId,
        },
        user: {
          id: profiles.id,
          fullName: profiles.fullName,
          email: profiles.email,
          phone: profiles.phone,
        },
        venue: {
          id: venues.id,
          name: venues.name,
          address: venues.address,
          city: venues.city,
          area: venues.area,
        },
      })
      .from(bookings)
      .leftJoin(events, eq(bookings.eventId, events.id))
      .leftJoin(profiles, eq(bookings.userId, profiles.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(eq(bookings.id, newBooking[0].id))
      .limit(1);

    return NextResponse.json(bookingWithDetails[0], { status: 201 });
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
    const { bookingStatus, paymentStatus } = body;

    // Validate status values
    const validBookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    const validPaymentStatuses = ['pending', 'paid', 'refunded'];

    if (bookingStatus && !validBookingStatuses.includes(bookingStatus)) {
      return NextResponse.json(
        {
          error: `Invalid booking status. Must be one of: ${validBookingStatuses.join(', ')}`,
          code: 'INVALID_BOOKING_STATUS',
        },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
          code: 'INVALID_PAYMENT_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if booking exists and get current data
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentBooking = existingBooking[0];

    // If booking is being cancelled, restore seats to event
    if (
      bookingStatus === 'cancelled' &&
      currentBooking.bookingStatus !== 'cancelled'
    ) {
      const event = await db
        .select()
        .from(events)
        .where(eq(events.id, currentBooking.eventId))
        .limit(1);

      if (event.length > 0) {
        await db
          .update(events)
          .set({
            availableSeats: event[0].availableSeats + currentBooking.numberOfTickets,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(events.id, currentBooking.eventId));
      }
    }

    // Update booking
    const updates: any = {};
    if (bookingStatus !== undefined) {
      updates.bookingStatus = bookingStatus;
    }
    if (paymentStatus !== undefined) {
      updates.paymentStatus = paymentStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updatedBooking = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (updatedBooking.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update booking', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedBooking[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}