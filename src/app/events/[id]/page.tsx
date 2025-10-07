"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, IndianRupee, Clock, Star, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  availableSeats: number;
  totalSeats: number;
  status: string;
  imageUrl: string;
  tags: string[];
  venue?: {
    id: number;
    name: string;
    address: string;
    area: string;
    capacity: number;
    amenities: string[];
  };
  category?: {
    name: string;
    icon: string;
  };
  manager?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    fullName: string;
    avatarUrl: string;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const [eventRes, reviewsRes] = await Promise.all([
        fetch(`/api/events?id=${params.id}`),
        fetch(`/api/reviews?eventId=${params.id}&limit=10`),
      ]);

      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvent(data);
      }

      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    setBookingLoading(true);
    try {
      const userId = localStorage.getItem("profile_id");
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?.id,
          userId,
          numberOfTickets,
        }),
      });

      if (response.ok) {
        alert("Booking successful!");
        setShowBookingDialog(false);
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(error.error || "Booking failed");
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("An error occurred");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const totalAmount = numberOfTickets * event.ticketPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="relative h-96 w-full">
                <Image
                  src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                  alt={event.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{event.category?.name}</Badge>
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(event.startDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm">
                      {new Date(event.startDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(event.endDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start text-muted-foreground">
                  <MapPin className="mr-3 h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{event.venue?.name}</p>
                    <p className="text-sm">{event.venue?.address}</p>
                    <p className="text-sm">{event.venue?.area}, Pune</p>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Venue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Venue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{event.venue?.capacity} people</span>
                </div>
                {event.venue?.amenities && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Amenities:</span>
                    <div className="flex flex-wrap gap-2">
                      {event.venue.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews</CardTitle>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{averageRating}</span>
                      <span className="text-muted-foreground">({reviews.length})</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.user?.fullName}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold flex items-center">
                    {event.ticketPrice === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <>
                        <IndianRupee className="h-5 w-5" />
                        {event.ticketPrice.toLocaleString()}
                      </>
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Available Seats:
                  </span>
                  <span className="font-medium">{event.availableSeats}/{event.totalSeats}</span>
                </div>

                <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" disabled={event.availableSeats === 0}>
                      {event.availableSeats === 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Your Booking</DialogTitle>
                      <DialogDescription>
                        Enter the number of tickets you want to purchase
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tickets">Number of Tickets</Label>
                        <Input
                          id="tickets"
                          type="number"
                          min="1"
                          max={event.availableSeats}
                          value={numberOfTickets}
                          onChange={(e) => setNumberOfTickets(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Ticket Price:</span>
                          <span>₹{event.ticketPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{numberOfTickets}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleBooking} disabled={bookingLoading} className="w-full">
                        {bookingLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Confirm Booking (₹${totalAmount.toLocaleString()})`
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {event.manager && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Organized by:</p>
                      <p className="text-muted-foreground">{event.manager.fullName}</p>
                      <p className="text-muted-foreground">{event.manager.email}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}