import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/auth";

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

    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
    });

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    const crop = await prisma.crop.findUnique({
      where: { id: params.id },
    });

    if (!crop) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    if (crop.farmerId !== farmer.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this crop" },
        { status: 403 }
      );
    }

    await prisma.crop.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Crop deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 