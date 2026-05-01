"use server";
import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { getSession } from "@/lib/auth";
export async function UpdateUser(values) {
  const session = await getSession();
  if (!session) {
    throw new Error("Your session has expired");
  }
  const userId = session.user.id;

  await connectToDatabase();

  try {
    const oldUser = await NewUser.findById(userId);

    oldUser.name = values.name;
    oldUser.github = values.github;
    oldUser.bio = values.bio;
    oldUser.tags = values.tags;
    oldUser.country = values.country;
    oldUser.role = values.role;
    oldUser.institute = values.institute;

    await oldUser.save();

    return;
  } catch (err) {
    throw new Error("Error in updating the user");
  }
}
