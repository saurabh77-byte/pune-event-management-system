import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (email) {
      const userProfiles = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, email));
      return NextResponse.json(userProfiles, { status: 200 });
    }

    if (id) {
      const userProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, id))
        .limit(1);
      return NextResponse.json(userProfile[0] || null, { status: 200 });
    }

    const allProfiles = await db.select().from(profiles);
    return NextResponse.json(allProfiles, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, phone, role, avatarUrl } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      );
    }

    // Generate a unique ID
    const id = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newProfile = await db
      .insert(profiles)
      .values({
        id,
        email,
        fullName,
        phone: phone || null,
        role: role || "user",
        avatarUrl: avatarUrl || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}