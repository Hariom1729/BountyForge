import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "MAINTAINER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, bountyId } = await req.json();

    if (!amount || !bountyId) {
      return NextResponse.json({ error: "Missing amount or bountyId" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay works in subunits (paise)
      currency: "USD",
      receipt: `receipt_bounty_${bountyId}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // Save initial pending payment
    const payment = await prisma.payment.create({
      data: {
        amount: amount,
        status: "PENDING",
        payerId: session.user.id,
        receiverId: session.user.id, // Temporary until claimed
      },
    });

    await prisma.escrowTransaction.create({
      data: {
        amount: amount,
        status: "HELD",
        paymentId: payment.id,
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
