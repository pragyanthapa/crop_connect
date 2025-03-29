import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
        buyer: true,
      },
    });

    if (!user || !user.buyer) {
      return NextResponse.json(
        { error: "Buyer profile not found" },
        { status: 404 }
      );
    }

    const contracts = await prisma.contract.findMany({
      where: {
        buyerId: user.buyer.id,
      },
      include: {
        crop: {
          select: {
            name: true,
            quantity: true,
            price: true,
            farmer: {
              select: {
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
} 