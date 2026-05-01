import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { userId } = params;
  try {
    const room = await NewUser.findById(userId);
    if (!room) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
