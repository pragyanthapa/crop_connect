import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, username, password, role, location } = await request.json();

    // Validate required fields
    if (!name || !username || !password || !role || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
        location,
      },
    });

    // If user is a farmer, create farmer profile
    if (role === "FARMER") {
      await prisma.farmer.create({
        data: {
          userId: user.id,
        },
      });
    }

    // If user is a buyer, create buyer profile
    if (role === "BUYER") {
      await prisma.buyer.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
} 