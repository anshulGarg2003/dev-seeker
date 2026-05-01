"use server";

import NewRoom from "@/database/model/room2";
import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { getSession } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function generateTokenAction() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;
  const secret = process.env.GET_STREAM_SECRET;

  if (!apiKey || !secret) {
    throw new Error("Stream credentials not configured");
  }

  const userId = String(session.user.id);
  const now = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    {
      user_id: userId,
      iat: now,
      exp: now + 60 * 60, // 1 hour
    },
    secret
  );

  return token;
}

export async function AddCoin(roomInfo, callSession) {
  const session = await getSession();
  if (!roomInfo) {
    return;
  }

  await connectToDatabase();
  const Room = await NewRoom.findById(roomInfo);

  if (Room.userId.toString() === session?.user?.id) {
    return;
  }
  const startTime = callSession.joinedAt.seconds * 1000; // Convert to milliseconds
  const endTime = new Date().getTime(); // Current time in milliseconds

  const differenceInMilliseconds = endTime - startTime;

  // Convert milliseconds to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

  let existingUser = await NewUser.findById(session?.user?.id);

  if (!existingUser) {
    throw new Error("User not found");
  }
  existingUser.totaltime += differenceInMinutes;

  if (differenceInMinutes < 1) {
    await existingUser.save();
    return { CreatorId: Room.userId, totalMin: differenceInMinutes };
  }

  existingUser.totalcoins +=
    parseInt(process.env.ROOM_HELP_REWARD_RATE, 10) *
    Math.ceil(differenceInMinutes);
  const newTransaction = {
    status: 210,
    name: Room.name.trim().substring(0, 10),
    time: new Date().toLocaleDateString("en-GB"),
    remaincoins: existingUser.totalcoins,
  };

  existingUser.transaction.unshift(newTransaction);

  if (existingUser.transaction.length > 10) {
    existingUser.transaction.shift();
  }

  await existingUser.save();
  return { CreatorId: Room.userId, totalMin: differenceInMinutes };
}

export async function OnAir(roomId, isPageVisible) {
  try {
    await connectToDatabase();
    const room = await NewRoom.findById(roomId); // Await the findById method
    // console.log(room);

    if (!room) {
      throw new Error("Room doesn't exist!!");
    }

    room.isLive = isPageVisible;

    await room.save(); // Await the save method

    return;
  } catch (err) {
    console.error("Error updating room status:", err); // Log the error
  }
}
