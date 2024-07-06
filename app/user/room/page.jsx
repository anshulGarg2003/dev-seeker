"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MyRoomCard } from "./MyRoomCard";
import toast from "react-hot-toast";
import { DeleteRoom } from "./action";
import { RoomCard } from "@/components/RoomCard";
import CreateRoomButton from "@/components/Create-Form-Button";
import Lottie from "lottie-react";
import Loading from "@/Loading.json";
import Image from "next/image";

const page = () => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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
    const res = await DeleteRoom(roomId);
    if (res) {
      setRefresh((prev) => !prev);
      toast.success("Delete Sucessfully");
    }
  };

  return (
    <div className="min-h-screen p-14 gap-4 flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={Loading} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-gray-500 text-[60px]">Your Rooms</p>
          {rooms.length == 0 ? (
            <div className="flex items-center flex-col gap-4">
              <Image src={"/empty.svg"} width="300" height="300" alt="Empty" />
              <p>You haven't create any room.</p>
              <CreateRoomButton />
            </div>
          ) : (
            <>
              <CreateRoomButton />
              <div className="grid grid-cols-3 gap-4">
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

export default page;
