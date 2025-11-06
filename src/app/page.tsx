"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, IndianRupee, Search, TrendingUp, Award, Star } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  ticketPrice: number;
  availableSeats: number;
  imageUrl: string;
  venue?: {
    name: string;
    area: string;
  };
  category?: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        fetch("/api/events?limit=6&status=upcoming"),
        fetch("/api/categories"),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setFeaturedEvents(data);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing Venues 
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              From concerts to conferences, find and book the best venue happening in your city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                <Link href="/events">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/sign-up">
                  Become an Event Manager
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Wide Selection</CardTitle>
                <CardDescription>
                  Browse through hundreds of events across all categories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Trusted Organizers</CardTitle>
                <CardDescription>
                  All events managed by verified and professional organizers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Simple and secure booking process with instant confirmation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find venues that match your interests</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/events?category=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center h-full">
                  <CardHeader>
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Parties</h2>
              <p className="text-muted-foreground text-lg">Popular events happening soon in Pune</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/events">View All</Link>
            </Button>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No featured events available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-white text-black">
                        {event.category?.name}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.venue?.name}, {event.venue?.area}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm">
                          <Users className="mr-1 h-4 w-4" />
                          {event.availableSeats} seats
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                          {event.ticketPrice === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <>
                              <IndianRupee className="h-4 w-4" />
                              {event.ticketPrice.toLocaleString()}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Own Venues?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of venue managers  who are creating amazing experiences
          </p>
          <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
            <Link href="/sign-up">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6" />
                <span className="text-xl font-bold">Venue Oragnization</span>
              </div>
              <p className="text-gray-400">
                Your one-stop platform for discovering and booking events in Pune
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white">Browse Events</Link></li>
                <li><Link href="/venues" className="hover:text-white">Venues</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Organizers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/sign-up" className="hover:text-white">Create Account</Link></li>
                <li><Link href="/manager/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Pune, Maharashtra</li>
                <li>contact@eventhub.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Venue Oraganization. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}