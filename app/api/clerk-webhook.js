"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  const clerkSecret = process.env.CLERK_WEBHOOK_SECRET;
  const signature = request.headers.get("clerk-signature");

  //lets  verify the webhook signature
  if (!signature || signature !== clerkSecret) {
    return NextResponse.json(
      { error: "Unauthorized webhook request" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const { id, first_name, last_name, email_addresses } = body;

  if (!id || !email_addresses || email_addresses.length === 0) {
    return NextResponse.json(
      { error: "Invalid user data received" },
      { status: 400 }
    );
  }

  const email = email_addresses[0].email_address;

  try {
    // Check if the user already exists
    const existingUser = await prisma.clerk.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists in database" },
        { status: 200 }
      );
    }

    // Created a user in the database
    const newUser = await prisma.user.create({
      data: {
        name: `${first_name} ${last_name}`.trim(),
        email: email,
        clerkId: id, // Now Save Clerk user ID
      },
    });

    return NextResponse.json(
      { message: "User added to database", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
