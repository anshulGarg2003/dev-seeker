import Testimonal from "@/database/model/Testimonal";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  try {
    const feedbacks = await Testimonal.find({});
    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Testimonals" },
      { status: 500 }
    );
  }
}
