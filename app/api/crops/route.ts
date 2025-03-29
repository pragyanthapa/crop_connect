import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        farmer: {
          include: {
            user: true
          }
        }
      }
    });
    
    return NextResponse.json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error);
    return NextResponse.json(
      { error: "Failed to fetch crops" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description, price, quantity, location } = await req.json();

    // Validate required fields
    if (!name || !description || !price || !quantity || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get the farmer's ID from the session
    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    // Create the crop
    const crop = await prisma.crop.create({
      data: {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        location,
        farmerId: farmer.id,
      },
      include: {
        farmer: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Crop added successfully", crop },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 