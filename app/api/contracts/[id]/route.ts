import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
}

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
        buyer: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { status } = await request.json();

    // Validate status
    const validStatuses = ["PENDING", "ACCEPTED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if contract exists and belongs to either farmer or buyer
    const contract = await prisma.contract.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            crop: {
              farmerId: user.farmer?.id,
            },
          },
          {
            buyerId: user.buyer?.id,
          },
        ],
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
        { error: "Contract not found or unauthorized" },
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
    if (status === "ACCEPTED") {
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contract = await prisma.contract.findUnique({
      where: {
        id: params.id,
      },
      include: {
        crop: {
          select: {
            name: true,
            price: true,
            quantity: true,
            location: true,
            farmer: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    location: true,
                  }
                }
              }
            }
          },
        },
        buyer: {
          select: {
            user: {
              select: {
                name: true,
                location: true,
              }
            }
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Check if the user is authorized to view this contract
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        buyer: true,
        farmer: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAuthorized = 
      (user.buyer && contract.buyerId === user.buyer.id) ||
      (user.farmer && contract.crop.farmer.id === user.farmer.id);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locationData = contract.crop.location as unknown as LocationData;

    // Transform the response to match the expected format
    const transformedContract = {
      id: contract.id,
      status: contract.status,
      quantity: contract.crop.quantity,
      deliveryDate: contract.deliveryDate,
      buyerLocation: {
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        address: contract.buyer.user.location,
      },
      farmerLocation: {
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        address: contract.crop.farmer.user.location,
      },
      crop: {
        name: contract.crop.name,
        price: contract.crop.price,
      },
      buyer: {
        name: contract.buyer.user.name,
      },
      farmer: {
        name: contract.crop.farmer.user.name,
      },
    };

    return NextResponse.json(transformedContract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
      { status: 500 }
    );
  }
} 