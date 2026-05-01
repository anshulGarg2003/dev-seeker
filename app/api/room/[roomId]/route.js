import NewRoom from "@/database/model/room2";
import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

// Function to connect to the database
const connectDB = async () => {
  try {
    await connectToDatabase(); // Connect to the MongoDB database
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error; // Throw the error to propagate it up the call stack
  }
};

// GET request handler
export async function GET(request, { params }) {
  await connectDB(); // Ensure database connection

  const { roomId } = params;

  try {
    const room = await NewRoom.findById(roomId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

// DELETE request handler
export async function DELETE(request, { params }) {
  await connectToDatabase(); // Ensure database connection

  const { roomId } = params;
  try {
    const roomToDelete = await NewRoom.findById(roomId);

    if (!roomToDelete) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const user = await NewUser.findById(roomToDelete.userId);

    if (user) {
      user.rooms.pull(roomToDelete._id);

      user.totalcoins += parseInt(process.env.ROOM_DELETE_COINS, 10);
      const newTransaction = {
        status: 200,
        name: roomToDelete.name.trim().substring(0, 10),
        time: new Date().toLocaleDateString("en-GB"),
        remaincoins: user.totalcoins,
      };

      if (user.transaction.length >= 10) {
        user.transaction.pop();
        // console.log("Removed the oldest transaction", user.transaction);
      }

      user.transaction.unshift(newTransaction);

      const newNotify = {
        code: 4,
        sendBy: user.name,
        data: roomToDelete.name,
        usefulId: user._id,
      };

      user.notification.unshift(newNotify);
      // console.log(user);
      await user.save();
    }

    await roomToDelete.deleteOne();

    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}

// PATCH request handler — update isLive status (used by sendBeacon on disconnect)
export async function PATCH(request, { params }) {
  await connectDB();
  const { roomId } = params;

  try {
    const body = await request.json();
    const room = await NewRoom.findById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (typeof body.isLive === "boolean") {
      room.isLive = body.isLive;
      await room.save();
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}
