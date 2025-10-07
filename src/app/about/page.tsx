"use client";

import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Award, TrendingUp, MapPin, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EventHub Pune</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your trusted platform for discovering and managing events in Pune
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Story */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                EventHub Pune was born from a simple idea: to make discovering and attending events 
                in Pune easier and more enjoyable for everyone. We noticed that while Pune has a vibrant 
                cultural scene with countless events happening every day, finding and booking these events 
                was often fragmented and complicated.
              </p>
              <p className="mb-4">
                Our platform brings together event organizers and attendees in one seamless experience. 
                Whether you're looking for a concert, conference, workshop, or cultural festival, 
                EventHub Pune makes it simple to find, book, and manage your event experience.
              </p>
              <p>
                Today, we're proud to serve thousands of users and hundreds of event managers across 
                Pune, helping create memorable experiences and bringing the community together through 
                amazing events.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              To connect people with unforgettable experiences by making event discovery and 
              management accessible, simple, and enjoyable for everyone in Pune. We believe in 
              the power of events to bring communities together, create lasting memories, and 
              enrich lives.
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Why Choose EventHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Comprehensive Event Listings</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Browse through a wide variety of events across all categories - from music 
                  concerts and tech conferences to cultural festivals and workshops.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Verified Organizers</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  All event managers on our platform are verified professionals committed to 
                  delivering high-quality events and excellent attendee experiences.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Easy Event Management</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  For event organizers, we provide powerful tools to create, manage, and promote 
                  events with real-time booking and attendance tracking.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Local Focus</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Dedicated exclusively to Pune, we provide the most comprehensive and up-to-date 
                  event listings across all areas of the city.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">EventHub by Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Events Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-90">Verified Venues</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Happy Attendees</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-sm opacity-90">Event Managers</div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Email:</strong> contact@eventhubpune.com
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong className="text-foreground">Address:</strong> 
                <br />
                EventHub Pune Headquarters
                <br />
                Baner, Pune, Maharashtra 411045
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}