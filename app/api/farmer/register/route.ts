import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, username, password, location, experience, farmSize, cropTypes } = await request.json();

    // Validate required fields
    if (!name || !username || !password || !location || !experience || !farmSize || !cropTypes) {
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and farmer profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          location,
          role: "FARMER",
        },
      });

      // Create farmer profile
      const farmer = await tx.farmer.create({
        data: {
          userId: user.id,
          experience: Number(experience),
          farmSize: Number(farmSize),
          cropTypes: cropTypes.split(",").map((crop: string) => crop.trim()),
        },
        include: {
          user: {
            select: {
              name: true,
              username: true,
              location: true,
            },
          },
        },
      });

      return { user, farmer };
    });

    return NextResponse.json(
      { message: "Registration successful", user: result.user, farmer: result.farmer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering farmer:", error);
    return NextResponse.json(
      { error: "Error registering farmer" },
      { status: 500 }
    );
  }
} 