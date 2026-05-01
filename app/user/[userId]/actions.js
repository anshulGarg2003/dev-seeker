"use server";

import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { getSession } from "@/lib/auth";

// ─── Badge Definitions ───
const BADGE_DEFINITIONS = [
  {
    id: "first-room",
    label: "First Room",
    description: "Created your first room",
    icon: "🚀",
    check: (user, roomCount) => roomCount >= 1,
  },
  {
    id: "room-master",
    label: "Room Master",
    description: "Created 10 rooms",
    icon: "🏠",
    check: (user, roomCount) => roomCount >= 10,
  },
  {
    id: "hour-one",
    label: "First Hour",
    description: "Contributed 1 hour of help",
    icon: "⏱️",
    check: (user) => user.totaltime >= 60,
  },
  {
    id: "10-hours",
    label: "10 Hours",
    description: "Contributed 10 hours of help",
    icon: "🔥",
    check: (user) => user.totaltime >= 600,
  },
  {
    id: "50-hours",
    label: "50 Hours",
    description: "Contributed 50 hours of help",
    icon: "💎",
    check: (user) => user.totaltime >= 3000,
  },
  {
    id: "5-star",
    label: "5-Star Dev",
    description: "Achieved a 5-star rating",
    icon: "⭐",
    check: (user) => user.rating >= 5,
  },
  {
    id: "coin-collector",
    label: "Coin Collector",
    description: "Earned 500 coins",
    icon: "🪙",
    check: (user) => user.totalcoins >= 500,
  },
  {
    id: "coin-hoarder",
    label: "Coin Hoarder",
    description: "Earned 2000 coins",
    icon: "💰",
    check: (user) => user.totalcoins >= 2000,
  },
  {
    id: "social-butterfly",
    label: "Social Butterfly",
    description: "Made 5 friends",
    icon: "🦋",
    check: (user) => user.friends?.length >= 5,
  },
  {
    id: "popular",
    label: "Popular",
    description: "Gained 10 followers",
    icon: "📣",
    check: (user) => user.followers?.length >= 10,
  },
  {
    id: "streak-7",
    label: "Week Streak",
    description: "Active for 7 days",
    icon: "📅",
    check: (user) => user.activity?.length >= 7,
  },
];

export async function computeAndSaveBadges(userId) {
  await connectToDatabase();
  const user = await NewUser.findById(userId);
  if (!user) return [];

  const roomCount = user.rooms?.length || 0;
  const earned = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (badge.check(user, roomCount)) {
      earned.push(badge.id);
    }
  }

  // Only save if badges changed
  const current = user.badges || [];
  const changed =
    earned.length !== current.length ||
    earned.some((b) => !current.includes(b));

  if (changed) {
    user.badges = earned;
    await user.save();
  }

  return earned;
}

export async function getBadgeDefinitions() {
  return BADGE_DEFINITIONS.map(({ id, label, description, icon }) => ({
    id,
    label,
    description,
    icon,
  }));
}

// ─── Follow / Unfollow ───

export async function toggleFollow(targetUserId) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const myId = session.user.id;
  if (myId === targetUserId) throw new Error("Cannot follow yourself");

  await connectToDatabase();

  const [me, target] = await Promise.all([
    NewUser.findById(myId),
    NewUser.findById(targetUserId),
  ]);

  if (!me || !target) throw new Error("User not found");

  const alreadyFollowing = me.following.some(
    (id) => id.toString() === targetUserId
  );

  if (alreadyFollowing) {
    // Unfollow
    me.following = me.following.filter(
      (id) => id.toString() !== targetUserId
    );
    target.followers = target.followers.filter(
      (id) => id.toString() !== myId
    );
  } else {
    // Follow
    me.following.push(targetUserId);
    target.followers.push(myId);

    // Send notification
    target.notification.unshift({
      code: 2,
      sendBy: session.user.name,
      data: "Follow",
      usefulId: myId,
    });
  }

  await Promise.all([me.save(), target.save()]);

  return {
    isFollowing: !alreadyFollowing,
    followerCount: target.followers.length + (alreadyFollowing ? -1 : 1),
  };
}

export async function getFollowStatus(targetUserId) {
  const session = await getSession();
  if (!session) return { isFollowing: false, followerCount: 0, followingCount: 0 };

  await connectToDatabase();

  const [me, target] = await Promise.all([
    NewUser.findById(session.user.id).select("following"),
    NewUser.findById(targetUserId).select("followers following"),
  ]);

  if (!me || !target) return { isFollowing: false, followerCount: 0, followingCount: 0 };

  return {
    isFollowing: me.following.some((id) => id.toString() === targetUserId),
    followerCount: target.followers?.length || 0,
    followingCount: target.following?.length || 0,
  };
}

// ─── Friend Request (existing) ───

export const sendFriendsRequest = async (userDetails) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Your session has expired");
  }


  await connectToDatabase();

  const userIdToCheck = session?.user?.id;
  const sendToUser = await NewUser.findById(userDetails._id);
  const sendByUser = await NewUser.findById(userIdToCheck);

  if (!sendToUser) {
    throw new Error("User not found");
  }

  // Check if the userIdToCheck is in currUser.friends
  const isInFriends = sendToUser.friends.some((friend) =>
    friend.friendId.equals(userIdToCheck)
  );

  // Check if the userIdToCheck is in currUser.friendsRequests
  const isInFriendsRequests = sendToUser.friendsRequests.some((request) =>
    request.friendId.equals(userIdToCheck)
  );

  if (!isInFriends && !isInFriendsRequests) {
    const sendTofriend = {
      friendId: session?.user?.id,
      friendname: session?.user?.name,
      friendimage: session?.user?.image,
    };
    const sendByfriend = {
      friendId: userDetails._id,
      friendname: userDetails.name,
      friendimage: userDetails.image,
    };

    const notify = {
      code: 2,
      sendBy: session?.user?.name,
      data: "Friend",
      usefulId: session?.user?.id,
    };

    sendToUser.notification.unshift(notify);
    sendToUser.friendsRequests.push(sendTofriend);
    sendByUser.friendsRequestSend.push(sendByfriend);

    await sendToUser.save();
    await sendByUser.save();
    return true;
  }
  return false;
};
