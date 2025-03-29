import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/auth";

export async function DELETE(
  request: Request,
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

    // Check if the crop belongs to this farmer
    const crop = await prisma.crop.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!crop) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    if (crop.farmerId !== user.farmer.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this crop" },
        { status: 403 }
      );
    }

    // Delete the crop
    await prisma.crop.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Crop deleted successfully" });
  } catch (error) {
    console.error("Error deleting crop:", error);
    return NextResponse.json(
      { error: "Failed to delete crop" },
      { status: 500 }
    );
  }
} 