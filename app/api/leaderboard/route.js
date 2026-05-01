import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sort") || "coins"; // coins | time | rooms
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    let sortField;
    if (sortBy === "time") {
      sortField = { totaltime: -1 };
    } else if (sortBy === "rooms") {
      sortField = { roomCount: -1 };
    } else {
      sortField = { totalcoins: -1 };
    }

    let users;

    if (sortBy === "rooms") {
      users = await NewUser.aggregate([
        {
          $project: {
            name: 1,
            image: 1,
            totalcoins: 1,
            totaltime: 1,
            country: 1,
            role: 1,
            institute: 1,
            tags: 1,
            roomCount: { $size: { $ifNull: ["$rooms", []] } },
          },
        },
        { $sort: sortField },
        { $limit: limit },
      ]);
    } else {
      users = await NewUser.find(
        {},
        {
          name: 1,
          image: 1,
          totalcoins: 1,
          totaltime: 1,
          country: 1,
          role: 1,
          institute: 1,
          tags: 1,
          rooms: 1,
        }
      )
        .sort(sortField)
        .limit(limit)
        .lean();

      users = users.map((u) => ({
        ...u,
        roomCount: u.rooms?.length || 0,
        rooms: undefined,
      }));
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
