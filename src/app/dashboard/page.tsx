"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Calendar, MapPin, Ticket, IndianRupee, Loader2 } from "lucide-react";
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
import Image from "next/image";

interface Booking {
  id: number;
  numberOfTickets: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  bookingDate: string;
  event?: {
    id: number;
    title: string;
    startDate: string;
    imageUrl: string;
  };
  venue?: {
    name: string;
    area: string;
  };
}

export default function UserDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("profile_id");
      const response = await fetch(`/api/bookings?userId=${userId}&limit=50`);

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const totalSpent = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const upcomingBookings = bookings.filter(
    b => b.bookingStatus === "confirmed" && new Date(b.event?.startDate || "") > new Date()
  ).length;

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
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
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your event bookings</p>
          </div>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">Confirmed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">On events</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>All your event bookings in one place</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button asChild>
                  <Link href="/events">Explore Events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={booking.event?.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                            alt={booking.event?.title || "Event"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link 
                                href={`/events/${booking.event?.id}`}
                                className="font-semibold text-lg hover:text-primary transition"
                              >
                                {booking.event?.title}
                              </Link>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="mr-2 h-4 w-4" />
                                {new Date(booking.event?.startDate || "").toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="mr-2 h-4 w-4" />
                                {booking.venue?.name}, {booking.venue?.area}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={getStatusColor(booking.bookingStatus)}>
                                {booking.bookingStatus}
                              </Badge>
                              <Badge variant={booking.paymentStatus === "paid" ? "default" : "secondary"} className="ml-2">
                                {booking.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Tickets: <span className="font-medium text-foreground">{booking.numberOfTickets}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Total: <span className="font-medium text-foreground">₹{booking.totalAmount.toLocaleString()}</span>
                              </span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${booking.event?.id}`}>View Event</Link>
                            </Button>
                          </div>
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