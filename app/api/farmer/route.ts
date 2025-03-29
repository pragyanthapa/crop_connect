import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ["name", "description", "price", "quantity", "latitude", "longitude"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get farmer ID from session
    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    // Create crop with location data
    const crop = await prisma.crop.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
        location: {
          create: {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
          }
        },
        farmerId: farmer.id,
      },
    });

    return NextResponse.json(crop, { status: 201 });
  } catch (error) {
    console.error("Error creating crop:", error);
    return NextResponse.json(
      { error: "Error creating crop" },
      { status: 500 }
    );
  }
}
