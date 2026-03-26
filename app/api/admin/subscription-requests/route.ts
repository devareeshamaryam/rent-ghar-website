 import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import SubscriptionRequest from "@/models/SubscriptionRequest";
import { verifyToken } from "@/lib/jwt";

// GET /api/admin/subscription-requests — Admin sab requests dekhe
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string; role: string } | null;
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const requests = await SubscriptionRequest.find({ status }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/admin/subscription-requests — Admin approve/reject kare
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token) as { id: string; role: string } | null;
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const { requestId, status } = await req.json();

    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const updated = await SubscriptionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Request nahi mila" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Request ${status === "approved" ? "approve" : "reject"} ho gayi!`,
      request: updated,
    });
  } catch (error) {
    console.error("Admin approve error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}