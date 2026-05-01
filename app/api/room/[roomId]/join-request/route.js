import JoinRequest from "@/database/model/joinRequest";
import NewRoom from "@/database/model/room2";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET — creator: all pending requests; regular user: their own request status
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = params;
  await connectToDatabase();

  const room = await NewRoom.findById(roomId).lean();
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const isCreator = room.userId.toString() === session.user.id;

  if (isCreator) {
    // Return all pending requests for this room
    const requests = await JoinRequest.find({
      roomId,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      role: "creator",
      requests: JSON.parse(JSON.stringify(requests)),
    });
  }

  // Regular user — return their own request
  const myRequest = await JoinRequest.findOne({
    roomId,
    userId: session.user.id,
  }).lean();

  return NextResponse.json({
    role: "participant",
    request: myRequest ? JSON.parse(JSON.stringify(myRequest)) : null,
  });
}

// POST — non-creator requests to join
export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = params;
  await connectToDatabase();

  const room = await NewRoom.findById(roomId).lean();
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // Creator doesn't need to request
  if (room.userId.toString() === session.user.id) {
    return NextResponse.json({ status: "approved" });
  }

  // Upsert — if rejected, allow re-request
  const existing = await JoinRequest.findOne({
    roomId,
    userId: session.user.id,
  });

  if (existing) {
    if (existing.status === "approved") {
      return NextResponse.json({ status: "approved" });
    }
    if (existing.status === "pending") {
      return NextResponse.json({ status: "pending" });
    }
    // Re-request after rejection
    existing.status = "pending";
    await existing.save();
    return NextResponse.json({ status: "pending" });
  }

  await JoinRequest.create({
    roomId,
    userId: session.user.id,
    userName: session.user.name,
    userImage: session.user.image,
    status: "pending",
  });

  return NextResponse.json({ status: "pending" }, { status: 201 });
}

// PATCH — creator approves or rejects a request
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = params;
  await connectToDatabase();

  const room = await NewRoom.findById(roomId).lean();
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.userId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Only the room creator can manage requests" }, { status: 403 });
  }

  const body = await request.json();
  const { requestId, action } = body;

  if (!requestId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const joinReq = await JoinRequest.findById(requestId);
  if (!joinReq || joinReq.roomId.toString() !== roomId) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  joinReq.status = action === "approve" ? "approved" : "rejected";
  await joinReq.save();

  return NextResponse.json({ status: joinReq.status });
}
