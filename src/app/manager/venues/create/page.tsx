"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const PUNE_AREAS = [
  "Kothrud", "Hinjewadi", "Viman Nagar", "Kalyani Nagar", "Aundh",
  "Wakad", "Baner", "Shivajinagar", "Koregaon Park", "Hadapsar",
  "Deccan", "Camp", "Kharadi", "Pimpri", "Chinchwad"
];

const COMMON_AMENITIES = [
  "AC", "Parking", "WiFi", "Catering", "Audio System", "Projector",
  "Stage", "Dance Floor", "Green Room", "Bar", "Pool", "Garden"
];

export default function CreateVenuePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    capacity: "",
    pricePerHour: "",
    amenities: [] as string[],
    images: [] as string[],
  });
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const managerId = localStorage.getItem("profile_id");
      if (!managerId) {
        alert("Manager ID not found");
        return;
      }

      const response = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          area: formData.area,
          capacity: parseInt(formData.capacity),
          pricePerHour: parseFloat(formData.pricePerHour),
          managerId,
          amenities: formData.amenities,
          images: formData.images,
        }),
      });

      if (response.ok) {
        router.push("/manager/dashboard");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create venue");
      }
    } catch (error) {
      console.error("Error creating venue:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return null;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/manager/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New Venue</CardTitle>
            <CardDescription>Register your venue for events in Pune</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Royal Gardens Convention Center"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 DP Road, Near MIT College"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <select
                    id="area"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                  >
                    <option value="">Select area</option>
                    {PUNE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (people) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Price Per Hour (₹) *</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                  placeholder="25000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COMMON_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Venue Images</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo..."
                  />
                  <Button type="button" onClick={addImage}>Add</Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="text-sm flex-1 truncate">{img}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Venue...
                  </>
                ) : (
                  "Create Venue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}