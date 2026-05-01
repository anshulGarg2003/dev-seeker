"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Adjust import as necessary
import toast from "react-hot-toast";

const CreateRoomButton = () => {
  const { data: session } = useSession();

  const handleClick = (e) => {
    if (!session) {
      e.preventDefault(); // Prevent navigation
      toast.error("Login First");
    }
  };

  return (
    <div className="flex justify-between items-center px-10">
      <h2 className="text-lg font-semibold text-foreground">Having a problem in anything?</h2>
      <Button onClick={handleClick} className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/20 border-0 px-6">
        {session ? (
          <Link href="/create-room">Create Room</Link>
        ) : (
          "Create Room"
        )}
      </Button>
    </div>
  );
};

export default CreateRoomButton;
