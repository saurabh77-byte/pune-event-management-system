"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Calendar, Users, MapPin, TrendingUp, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  availableSeats: number;
  totalSeats: number;
  ticketPrice: number;
  venue?: { name: string; area: string };
}

interface Venue {
  id: number;
  name: string;
  area: string;
  capacity: number;
  pricePerHour: number;
}

interface Booking {
  id: number;
  numberOfTickets: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  event?: { title: string };
  user?: { fullName: string; email: string };
}

export default function ManagerDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const id = localStorage.getItem("profile_id");
    setProfileId(id);
    if (id) {
      fetchData(id);
    }
  }, []);

  const fetchData = async (managerId: string) => {
    try {
      setLoading(true);
      const [eventsRes, venuesRes, bookingsRes] = await Promise.all([
        fetch(`/api/events?managerId=${managerId}`),
        fetch(`/api/venues?managerId=${managerId}`),
        fetch(`/api/bookings?limit=50`),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      if (venuesRes.ok) {
        const venuesData = await venuesRes.json();
        setVenues(venuesData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        // Filter bookings for manager's events
        const eventIds = events.map(e => e.id);
        const managerBookings = bookingsData.filter((b: Booking) => 
          eventIds.includes(b.event?.id as any)
        );
        setBookings(managerBookings);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalBookings = bookings.length;
  const upcomingEvents = events.filter(e => e.status === "upcoming").length;

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">Manage your events, venues, and bookings</p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/manager/venues/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Venue
              </Link>
            </Button>
            <Button asChild>
              <Link href="/manager/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">{upcomingEvents} upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venues.length}</div>
              <p className="text-xs text-muted-foreground">Active venues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>Manage and monitor your events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No events created yet</p>
                <Button asChild>
                  <Link href="/manager/events/create">Create Your First Event</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 5).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{event.venue?.name}</TableCell>
                      <TableCell>
                        {event.availableSeats}/{event.totalSeats}
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Venues */}
        <Card>
          <CardHeader>
            <CardTitle>Your Venues</CardTitle>
            <CardDescription>Manage your event venues</CardDescription>
          </CardHeader>
          <CardContent>
            {venues.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No venues added yet</p>
                <Button asChild>
                  <Link href="/manager/venues/create">Add Your First Venue</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {venues.map((venue) => (
                  <Card key={venue.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <CardDescription>{venue.area}, Pune</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacity:</span>
                          <span className="font-medium">{venue.capacity} people</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">₹{venue.pricePerHour}/hr</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}