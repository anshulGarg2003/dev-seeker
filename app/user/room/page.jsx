"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MyRoomCard } from "./MyRoomCard";
import toast from "react-hot-toast";
import { DeleteRoom } from "./action";
import CreateRoomButton from "@/components/Create-Form-Button";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import Image from "next/image";
import { useCallContext } from "@/context/CallContext";

const Page = () => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const { setHeaderRefresh } = useCallContext();

  useEffect(() => {
    const fetchRoom = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/room/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
          setLoading(false);
        } else {
          console.error("Failed to fetch room");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [userId, refresh]);

  const handleRoomDelete = async (roomId) => {
    await toast.promise(DeleteRoom(roomId), {
      loading: "Deleting the room",
      success: "Delete Successfully",
      error: "Error while Deleting",
    });
    setRefresh((prev) => !prev);
    setHeaderRefresh((prev) => !prev);
  };
  return (
    <div className="min-h-screen p-14 gap-4 flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={Loading} />
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-[80%]">
          <p className="text-muted-foreground text-[60px]">Your Rooms</p>
          {rooms.length == 0 ? (
            <div className="flex items-center flex-col gap-4">
              <Image src={"/empty.svg"} width="300" height="300" alt="Empty" />
              <p>You haven't create any room.</p>
              <CreateRoomButton />
            </div>
          ) : (
            <>
              <CreateRoomButton />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <MyRoomCard
                    key={room._id}
                    roomInfo={room}
                    onDelete={() => handleRoomDelete(room)}
                    loading={loading} // Pass delete handler
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
