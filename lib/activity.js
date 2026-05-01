import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";

/**
 * Log an activity for a user on today's date.
 * Increments the count if an entry for today already exists, otherwise creates one.
 */
export async function logActivity(userId) {
  await connectToDatabase();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Try to increment existing entry for today
  const result = await NewUser.updateOne(
    { _id: userId, "activity.date": today },
    { $inc: { "activity.$.count": 1 } }
  );

  // If no entry for today, push a new one
  if (result.matchedCount === 0 || result.modifiedCount === 0) {
    await NewUser.updateOne(
      { _id: userId, "activity.date": { $ne: today } },
      { $push: { activity: { date: today, count: 1 } } }
    );
  }
}
