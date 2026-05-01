"use client";
import Lottie from "@/components/LottieWrapper";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "@/Loading.json";
import Link from "next/link";
import {
  Coins,
  CoinsIcon,
  Github,
  PencilIcon,
  PenTool,
  StarIcon,
  TimerIcon,
  Heart,
  Eye,
  ArrowRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Terminal,
  Activity,
  Code2,
  TrendingUp,
  Trash2,
  UserPlus,
  UserCheck,
  Award,
  Trophy,
} from "lucide-react";
import { splitTags } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import coins from "@/coins.json";
import {
  sendFriendsRequest,
  toggleFollow,
  getFollowStatus,
  computeAndSaveBadges,
  getBadgeDefinitions,
} from "./actions";
import toast from "react-hot-toast";
import ContributionMap from "@/components/ContributionMap";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const UserProfile = (props) => {
  const session = useSession();
  const userId = props.params.userId;
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [friendTag, setFriendTag] = useState("Send Friend Request");
  const [userBlogs, setUserBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [badges, setBadges] = useState([]);
  const [badgeDefs, setBadgeDefs] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setUserDetails(data);
        } else {
          setError("Failed to fetch user details");
        }
      } catch {
        setError("Error fetching user details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserDetails();
    return () => { isMounted = false; };
  }, [userId, requestLoading]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blog/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserBlogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch user blogs:", err);
      }
    };
    fetchBlogs();
  }, [userId]);

  // Fetch follow status
  useEffect(() => {
    if (!session?.data?.user) return;
    getFollowStatus(userId).then((data) => {
      setIsFollowing(data.isFollowing);
      setFollowerCount(data.followerCount);
      setFollowingCount(data.followingCount);
    }).catch(() => {});
  }, [userId, session?.data?.user]);

  // Compute badges
  useEffect(() => {
    if (!userDetails) return;
    computeAndSaveBadges(userId).then(setBadges).catch(() => {});
    getBadgeDefinitions().then(setBadgeDefs).catch(() => {});
  }, [userId, userDetails]);

  const handleFollow = async () => {
    if (!session?.data?.user) {
      toast.error("Sign in to follow users");
      return;
    }
    setFollowLoading(true);
    try {
      const result = await toggleFollow(userId);
      setIsFollowing(result.isFollowing);
      setFollowerCount(result.followerCount);
      toast.success(result.isFollowing ? "Following!" : "Unfollowed");
    } catch (err) {
      toast.error(err.message || "Failed to update follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleFriendRequest = async () => {
    setRequestLoading(true);
    const res = await sendFriendsRequest(userDetails);
    setRequestLoading(false);
    if (res == true) {
      toast.success("Request has been sent");
    } else toast.success("Request already sent");
  };

  useEffect(() => {
    const handleFriendFunc = () => {
      const userIdToCheck = session?.data?.user?.id;
      const isInFriends = userDetails?.friends.some(
        (friend) => friend.friendId.toString() === userIdToCheck
      );
      if (isInFriends) { setFriendTag("Already a friend"); return; }

      const isInFriendsRequests = userDetails?.friendsRequests.some(
        (request) => request.friendId.toString() === userIdToCheck
      );
      if (isInFriendsRequests) { setFriendTag("Request already sent"); return; }

      const isInFriendsRequestsSend = userDetails?.friendsRequestSend.some(
        (request) => request.friendId.toString() === userIdToCheck
      );
      if (isInFriendsRequestsSend) { setFriendTag("Request received"); return; }
    };
    handleFriendFunc();
  }, [userDetails, session]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie animationData={Loading} />
      </div>
    );
  if (error) return <div className="text-center py-20 text-muted-foreground">{error}</div>;

  const isOwner = userId === session?.data?.user?.id;
  const tags = splitTags(userDetails.tags || "");
  const memberSince = userDetails.createdAt
    ? new Date(userDetails.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "";

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* ─── Profile Hero ─── */}
        <section className="relative rounded-3xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm overflow-hidden mb-8">
          {/* Banner gradient */}
          <div className="h-36 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/20 to-cyan-500/20 relative">
            <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/60 dark:from-[#0a0c15] to-transparent" />

            {/* Edit button */}
            {isOwner && (
              <Link
                href="/user/edit"
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/20 transition-colors"
              >
                <PencilIcon className="w-4 h-4 text-white" />
              </Link>
            )}
          </div>

          <div className="px-8 pb-8">
            {/* Avatar + Name Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 relative z-10">
              <div className="relative">
                <Image
                  src={userDetails.image}
                  width={120}
                  height={120}
                  alt={userDetails.name}
                  className="rounded-2xl ring-4 ring-background dark:ring-[#0a0c15] shadow-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-background dark:ring-[#0a0c15]" title="Online" />
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {userDetails.name}
                </h1>
                <p className="text-muted-foreground text-sm font-mono mt-0.5">{userDetails.email}</p>
                {userDetails.bio && (
                  <p className="text-muted-foreground text-sm mt-2 max-w-xl leading-relaxed">{userDetails.bio}</p>
                )}

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {userDetails.country && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-300 text-xs font-mono border border-violet-400/10">
                      <MapPin className="w-3 h-3" /> {userDetails.country}
                    </span>
                  )}
                  {userDetails.role && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-600 dark:text-cyan-300 text-xs font-mono border border-cyan-400/10">
                      <Briefcase className="w-3 h-3" /> {userDetails.role}
                    </span>
                  )}
                  {userDetails.institute && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-fuchsia-500/10 dark:bg-fuchsia-500/5 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-mono border border-fuchsia-400/10">
                      <GraduationCap className="w-3 h-3" /> {userDetails.institute}
                    </span>
                  )}
                  {memberSince && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] text-muted-foreground text-xs font-mono border border-border dark:border-white/5">
                      <Terminal className="w-3 h-3" /> Joined {memberSince}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0 pt-2">
                {userDetails.github && (
                  <a
                    href={`https://github.com/${userDetails.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-card/60 dark:bg-white/[0.02] text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-colors"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {!isOwner && session?.data?.user && (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
                        isFollowing
                          ? "border border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/20"
                      }`}
                    >
                      {isFollowing ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                    </button>
                    <button
                      onClick={handleFriendRequest}
                      disabled={requestLoading || friendTag !== "Send Friend Request"}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-violet-600/20 disabled:opacity-60 transition-all"
                    >
                      <Users className="w-4 h-4" />
                      {requestLoading ? "Sending..." : friendTag}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Follower / Following counts */}
            <div className="flex gap-5 px-8 pb-2 mt-1">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-foreground">{followerCount}</span>
                <span className="text-muted-foreground text-xs">Followers</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-foreground">{followingCount}</span>
                <span className="text-muted-foreground text-xs">Following</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-foreground">{userDetails.friends?.length || 0}</span>
                <span className="text-muted-foreground text-xs">Friends</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: StarIcon, label: "Rating", value: userDetails.rating || 5, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/5" },
            { icon: TimerIcon, label: "Hours Helped", value: (userDetails.totaltime / 60).toFixed(1), color: "text-cyan-500", bg: "bg-cyan-500/10 dark:bg-cyan-500/5" },
            { icon: Code2, label: "Rooms", value: userDetails.rooms?.length || 0, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/5" },
            { icon: CoinsIcon, label: "Coins", value: userDetails.totalcoins, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/5" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-foreground font-mono">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Badges / Achievements ─── */}
        {badgeDefs.length > 0 && (
          <section className="mb-8 rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm p-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-500" /> Achievements
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {badges.length}/{badgeDefs.length}
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {badgeDefs.map((def) => {
                const earned = badges.includes(def.id);
                return (
                  <div
                    key={def.id}
                    className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      earned
                        ? "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 hover:bg-amber-500/10"
                        : "border-border dark:border-white/5 bg-muted/20 opacity-40 grayscale"
                    }`}
                    title={def.description}
                  >
                    <span className="text-2xl">{def.icon}</span>
                    <span
                      className={`text-xs font-semibold text-center leading-tight ${
                        earned ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {def.label}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {def.description}
                    </div>
                    {earned && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                        <Award className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── Tech Stack ─── */}
        {tags.length > 0 && tags[0] !== "" && (
          <section className="mb-8 rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm p-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-violet-500" /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/browse/?search=${tag.toLowerCase()}`}
                  className="px-3 py-1.5 rounded-lg bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-wider border border-violet-400/10 hover:bg-violet-500/20 hover:border-violet-400/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Contribution Map ─── */}
        <section className="mb-8 rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm p-6">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-500" /> Activity
          </h3>
          <ContributionMap activity={userDetails.activity || []} />
        </section>

        {/* ─── Two-column: Transactions + Friends/Blogs ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Left: Transactions (visible to owner only) */}
          {isOwner && (
            <div className="lg:col-span-2 rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 border-b border-border dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Lottie animationData={coins} className="w-8 h-8" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Seeker Coins</p>
                    <p className="text-xs text-muted-foreground">Transaction history</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-lg text-foreground">
                  {userDetails.totalcoins}
                  <CoinsIcon className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              <div className="divide-y divide-border dark:divide-white/5 max-h-[400px] overflow-y-auto">
                {userDetails.transaction.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No transactions yet</div>
                ) : (
                  userDetails.transaction.map((statement, index) => (
                    <div className="flex items-center justify-between px-6 py-3" key={index}>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          statement.status === 200 || statement.status === 210
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}>
                          {statement.name}
                          <span className="text-muted-foreground font-normal ml-1.5">
                            {statement.status === 200 ? "DELETE" : statement.status === 210 ? "SOLVE" : statement.status === 300 ? "CREATE" : "DISTURB"}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{statement.time}</p>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-sm font-bold text-foreground flex-shrink-0">
                        {statement.remaincoins}
                        <CoinsIcon className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-6 py-3 border-t border-border dark:border-white/5">
                <p className="text-xs text-muted-foreground font-mono">Last 10 transactions</p>
              </div>
            </div>
          )}

          {/* Right: Friends + Blogs */}
          <div className={`${isOwner ? "lg:col-span-3" : "lg:col-span-5"} flex flex-col gap-6`}>
            {/* Friends */}
            <div className="rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600/15 to-cyan-500/10 border-b border-border dark:border-white/5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" /> Friends
                </h3>
                <span className="text-xs font-mono font-bold text-muted-foreground">{userDetails.friends.length}</span>
              </div>

              <div className="p-5">
                {userDetails.friends.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No friends yet</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {userDetails.friends.slice(0, 8).map((item) => (
                      <Link href={`/user/${item.friendId}`} key={item.friendId.toString()} className="group flex flex-col items-center gap-2">
                        <div className="relative">
                          <Image
                            src={item.friendimage}
                            width={56}
                            height={56}
                            alt={item.friendname}
                            className="rounded-xl ring-2 ring-border dark:ring-white/5 group-hover:ring-violet-500/40 transition-all object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground group-hover:text-violet-500 transition-colors font-medium truncate max-w-[64px]">
                          {item.friendname.split(" ")[0]}
                        </p>
                      </Link>
                    ))}
                    {userDetails.friends.length > 8 && (
                      <Link href="/user/friends" className="flex flex-col items-center justify-center gap-2 group">
                        <div className="w-14 h-14 rounded-xl bg-violet-500/10 dark:bg-violet-500/5 border border-violet-400/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                          <span className="text-sm font-bold text-violet-500">+{userDetails.friends.length - 8}</span>
                        </div>
                        <p className="text-xs text-violet-500 font-mono">more</p>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Blogs */}
            <div className="rounded-2xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 border-b border-border dark:border-white/5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-fuchsia-500" /> Blogs
                </h3>
                <span className="text-xs font-mono font-bold text-muted-foreground">{userBlogs.length}</span>
              </div>

              <div className="p-5">
                {isOwner && (
                  <Link
                    href="/blog/create"
                    className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-violet-600/20 hover:scale-[1.02] transition-all"
                  >
                    <PenTool className="w-4 h-4" /> Write a Blog
                  </Link>
                )}

                {userBlogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No blogs published yet</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {userBlogs.slice(0, 5).map((blog) => (
                      <div
                        key={blog._id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border dark:border-white/5 bg-background/30 dark:bg-white/[0.01] hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition-all group"
                      >
                        <Link href={`/blog/${blog._id}`} className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-violet-500 transition-colors">
                            {blog.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{blog.excerpt}</p>
                        </Link>
                        <div className="flex items-center gap-3 ml-4 text-xs text-muted-foreground flex-shrink-0">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {blog.likes?.length || 0}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.views || 0}</span>
                          {isOwner && (
                            <>
                              <Link
                                href={`/blog/edit/${blog._id}`}
                                className="p-1.5 rounded-lg hover:bg-violet-500/10 text-muted-foreground hover:text-violet-500 transition-colors"
                                title="Edit blog"
                              >
                                <PencilIcon className="w-3.5 h-3.5" />
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                                    title="Delete blog"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete &quot;{blog.title}&quot;.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-rose-600 hover:bg-rose-700"
                                      onClick={async () => {
                                        try {
                                          const res = await fetch(`/api/blog/${blog._id}`, { method: "DELETE" });
                                          if (res.ok) {
                                            toast.success("Blog deleted");
                                            setUserBlogs((prev) => prev.filter((b) => b._id !== blog._id));
                                          } else {
                                            toast.error("Failed to delete");
                                          }
                                        } catch {
                                          toast.error("Failed to delete");
                                        }
                                      }}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {!isOwner && (
                            <ArrowRight className="w-3.5 h-3.5 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </div>
                    ))}
                    {userBlogs.length > 5 && (
                      <Link href="/blog" className="text-sm text-violet-500 hover:underline font-mono mt-1">
                        View all {userBlogs.length} blogs →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
