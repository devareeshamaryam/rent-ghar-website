 import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import { verifyToken } from "@/lib/jwt";

// POST /api/subscription-requests
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string; name: string; email: string } | null;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const { planId, planName, planPrice } = await req.json();

    if (!planId || !planName || !planPrice) {
      return NextResponse.json({ error: "Plan details are required" }, { status: 400 });
    }

    const existing = await SubscriptionRequest.findOne({
      userId: decoded.id,
      planId,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json(
        { error: "Aapki request already pending hai. Admin approval ka wait karein." },
        { status: 409 }
      );
    }

    const request = await SubscriptionRequest.create({
      userId: decoded.id,
      userName: decoded.name,
      userEmail: decoded.email,
      planId,
      planName,
      planPrice,
      status: "pending",
    });

    return NextResponse.json({ message: "Request submit ho gayi!", request }, { status: 201 });
  } catch (error) {
    console.error("Subscription request error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/subscription-requests
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string } | null;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const requests = await SubscriptionRequest.find({
      userId: decoded.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}