"use server";
import NewRoom from "@/database/model/room2";
import { getSession } from "@/lib/auth";
import connectToDatabase from "@/database/mongoose";
import { redirect } from "next/navigation";

export async function EditRoomAction({
  name,
  description,
  language,
  githubrepo,
  difficulty,
  estimatedTime,
  category,
  roomId,
}) {
  const session = await getSession();
  if (session) {
    await connectToDatabase();

    // Convert userId to ObjectId
    const oldRoom = await NewRoom.findById(roomId);

    if (oldRoom.userId.toString() === session.user.id) {
      oldRoom.name = name;
      oldRoom.description = description;
      oldRoom.language = language;
      oldRoom.githubrepo = githubrepo;
      oldRoom.difficulty = difficulty || "medium";
      oldRoom.estimatedTime = estimatedTime || "30min";
      oldRoom.category = category || "bug-fix";

      await oldRoom.save();

      redirect("/user/room");
    } else {
      throw new Error("User is not authourised");
    }
  } else {
    return "Please login first";
  }
}
