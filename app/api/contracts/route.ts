import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { cropId, quantity, deliveryDate, notes } = await req.json();

    // Validate required fields
    if (!cropId || !quantity || !deliveryDate) {
      return NextResponse.json(
        { error: "Crop, quantity, and delivery date are required" },
        { status: 400 }
      );
    }

    // Get the buyer's ID from the session
    const buyer = await prisma.buyer.findUnique({
      where: { userId: session.user.id },
    });

    if (!buyer) {
      return NextResponse.json(
        { error: "Buyer profile not found" },
        { status: 404 }
      );
    }

    // Get the crop and validate quantity
    const crop = await prisma.crop.findUnique({
      where: { id: cropId },
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

    if (crop.quantity < Number(quantity)) {
      return NextResponse.json(
        { error: "Requested quantity exceeds available quantity" },
        { status: 400 }
      );
    }

    // Create the contract
    const contract = await prisma.contract.create({
      data: {
        buyerId: buyer.id,
        cropId: crop.id,
        status: "Pending",
        deliveryDate: new Date(deliveryDate),
        notes: notes || "",
      },
      include: {
        buyer: {
          include: {
            user: true
          }
        },
        crop: {
          include: {
            farmer: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Contract created successfully", contract },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contract creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 