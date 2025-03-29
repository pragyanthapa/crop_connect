import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const { status } = await request.json();

    // Check if contract exists and belongs to farmer's crop
    const contract = await prisma.contract.findFirst({
      where: {
        id: params.id,
        crop: {
          farmerId: user.farmer.id,
        },
      },
      include: {
        crop: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Update contract status
    const updatedContract = await prisma.contract.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    // If contract is accepted, update crop quantity
    if (status === "accepted") {
      await prisma.crop.update({
        where: {
          id: contract.cropId,
        },
        data: {
          quantity: {
            decrement: contract.crop.quantity,
          },
        },
      });
    }

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
} 