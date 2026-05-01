"use server";
import Testimonal from "@/database/model/Testimonal";
import connectToDatabase from "@/database/mongoose";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";
import NewRoom from "@/database/model/room2";

export const sendFeedback = async (feedback, star) => {
  const session = await getSession();
  if (session) {
    await connectToDatabase();
    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const NewTestimonal = await Testimonal.create({
      feedback,
      star,
      userId: userId,
      userName: session.user.name,
      userProfile: session.user.image,
    });
    await NewTestimonal.save();
    return true;
  } else {
    return false;
  }
};

export const sendComplete = async (roomInfo) => {
  const session = await getSession();
  if (session) {
    await connectToDatabase();

    // Convert userId to ObjectId
    const oldRoom = await NewRoom.findById(roomInfo);

    if (oldRoom.userId.toString() === session.user.id) {
      oldRoom.completed = true;

      await oldRoom.save();
      return;
    } else {
      throw new Error("User is not authourised");
    }
  } else {
    return "Please login first";
  }
};
