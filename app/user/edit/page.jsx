"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { EditProfile } from "./edit-profile-form";

const Page = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setUserInfo(data);
        } else {
          if (isMounted) setError("Failed to fetch user details");
        }
      } catch {
        if (isMounted) setError("Error fetching user details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserDetails();
    return () => { isMounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-400 font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-violet-400 hover:underline">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <EditProfile profileInfo={userInfo} />;
};

export default Page;
