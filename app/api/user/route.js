import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const userDetails = await NewUser.findById(user);
    if (!userDetails) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user details" }, { status: 500 });
  }
}
