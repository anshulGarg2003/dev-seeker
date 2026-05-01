"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MyRoomCard } from "./MyRoomCard";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import Image from "next/image";

const Page = (props) => {
  const userId = props.params.userId;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [userId]);

  return (
    <div className="min-h-screen p-14 gap-4 flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={Loading} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-[60px] text-center">
            {rooms[0]?.userName}'s Rooms
          </p>
          {rooms.length === 0 ? (
            <div className="flex items-center flex-col gap-4">
              <Image src={"/empty.svg"} width="300" height="300" alt="Empty" />
              <p>No room is Created.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <MyRoomCard
                    key={room._id}
                    roomInfo={room}
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
