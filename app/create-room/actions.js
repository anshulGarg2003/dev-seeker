"use server";
import NewRoom from "@/database/model/room2";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose"; // Import mongoose to use ObjectId
import connectToDatabase from "@/database/mongoose";
import NewUser from "@/database/model/user2";
import { logActivity } from "@/lib/activity";

export async function CreateRoomAction({
  name,
  description,
  language,
  githubrepo,
  difficulty,
  estimatedTime,
  category,
}) {
  // console.log({ name, description, language, githubrepo });
  const session = await getSession();
  if (session) {
    await connectToDatabase();

    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);

    let existingUser = await NewUser.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.totalcoins < parseInt(process.env.ROOM_CREATE_COINS, 10)) {
      throw new Error("You don't have sufficient Coins.");
    }

    const newRoom = await NewRoom.create({
      name,
      description,
      language,
      githubrepo,
      difficulty: difficulty || "medium",
      estimatedTime: estimatedTime || "30min",
      category: category || "bug-fix",
      userId: userId,
      userName: session.user.name,
      userProfile: session.user.image,
    });
    const savedroom = await newRoom.save();
    const savedRoomId = new mongoose.Types.ObjectId(savedroom._id);

    existingUser.rooms.push(savedRoomId);

    // Log activity for contribution map
    await logActivity(userId);

    existingUser.totalcoins -= parseInt(process.env.ROOM_CREATE_COINS, 10);
    const newTransaction = {
      status: 300,
      name: name.trim().substring(0, 10),
      time: new Date().toLocaleDateString("en-GB"),
      remaincoins: existingUser.totalcoins,
    };

    if (existingUser.transaction.length >= 10) {
      existingUser.transaction.pop();
      // console.log("Removed the oldest transaction", existingUser.transaction);
    }
    existingUser.transaction.unshift(newTransaction);

    const newNotify = {
      code: 3,
      sendBy: session.user.name,
      data: name,
      usefulId: session.user.id,
    };

    existingUser.notification.unshift(newNotify);

    const notify = {
      code: 1,
      sendBy: session.user.name,
      data: name,
      usefulId: session.user.id,
    };

    const friendsUpdatePromises = existingUser.friends.map(async (friend) => {
      await NewUser.findByIdAndUpdate(friend.friendId, {
        $push: {
          notification: {
            $each: [notify],
            $position: 0, // Push to the top of the array
          },
        },
      });
    });

    // Wait for all promises to resolve
    await Promise.all(friendsUpdatePromises);

    await existingUser.save();

    revalidatePath("/browse");
  } else {
    return "Please login first";
  }
}
