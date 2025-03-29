import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user with their farmer profile
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        farmer: true,
      },
    });

    if (!user || !user.farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    // Get all crops for this farmer
    const crops = await prisma.crop.findMany({
      where: { farmerId: user.farmer.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(crops);
  } catch (error) {
    console.error("Error fetching farmer's crops:", error);
    return NextResponse.json(
      { error: "Failed to fetch crops" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        farmer: true,
      },
    });

    if (!user || !user.farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, quantity, imageUrl, location } = body;

    // Validate required fields
    if (!name || !description || !price || !quantity || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create the crop
    const crop = await prisma.crop.create({
      data: {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        imageUrl: imageUrl || null,
        location: {
          address: location.address,
          coordinates: location.coordinates || null
        },
        farmerId: user.farmer.id,
      },
    });

    return NextResponse.json(crop);
  } catch (error) {
    console.error("Error creating crop:", error);
    return NextResponse.json(
      { error: "Failed to create crop" },
      { status: 500 }
    );
  }
} 