"use client";

import React, { useEffect, useState } from "react";
import { EditRoom } from "./edit-room";
import Loading from "@/Loading.json";
import Lottie from "@/components/LottieWrapper";

const page = (props) => {
  const [room, setRoom] = useState(null); // Initialize room state with null
  const [loading, setLoading] = useState(true);
  const { roomId } = props.params;

  useEffect(() => {
    let mounted = true; // Flag to track component mounted status

    const fetchRoom = async () => {
      if (!roomId) return; // Wait until roomId is available
      try {
        const response = await fetch(`/api/room/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            // Check if component is still mounted before updating state
            setRoom(data);
            setLoading(false);
          }
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

    return () => {
      mounted = false; // Cleanup function to set mounted to false on unmount
    };
  }, [roomId]);

  return (
    <div className="container mx-auto flex flex-col gap-8">
      <h1 className="p-2 pt-4 text-4xl font-bold">Edit Room </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={Loading} />
        </div>
      ) : (
        <div>
          <EditRoom roomInfo={room} />
        </div>
      )}
    </div>
  );
};

export default page;
