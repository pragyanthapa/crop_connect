import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    // Check if the crop belongs to this farmer
    const crop = await prisma.crop.findFirst({
      where: {
        id: params.id,
        farmerId: farmer.id,
      },
    });

    if (!crop) {
      return NextResponse.json(
        { error: "Crop not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the crop
    await prisma.crop.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Crop deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const crop = await prisma.crop.findUnique({
      where: { id: params.id },
      include: {
        farmer: {
          include: {
            user: true
          }
        }
      }
    });

    if (!crop) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(crop);
  } catch (error) {
    console.error("Error fetching crop:", error);
    return NextResponse.json(
      { error: "Failed to fetch crop" },
      { status: 500 }
    );
  }
} 