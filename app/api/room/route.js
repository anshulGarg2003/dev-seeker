import NewRoom from "@/database/model/room2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  try {
    const rooms = await NewRoom.find({ completed: false }).sort({ createdAt: -1 });
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
