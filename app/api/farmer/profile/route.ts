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

    // First check if user has the FARMER role
    if (session.user.role !== "FARMER") {
      return NextResponse.json(
        { error: "User is not a farmer" },
        { status: 403 }
      );
    }

    // Get the farmer's profile
    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
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

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found. Please complete your registration." },
        { status: 404 }
      );
    }

    return NextResponse.json(farmer);
  } catch (error) {
    console.error("Error checking farmer profile:", error);
    return NextResponse.json(
      { error: "Failed to check farmer profile" },
      { status: 500 }
    );
  }
} 