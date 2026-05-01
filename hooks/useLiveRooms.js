"use client";
import { useEffect, useState, useRef } from "react";

/**
 * Hook that connects to the live-stream SSE endpoint
 * and returns a Set of room IDs that are currently live.
 */
export function useLiveRooms() {
  const [liveRoomIds, setLiveRoomIds] = useState(new Set());
  const retryCount = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    let eventSource = null;
    let retryTimeout = null;

    const connect = () => {
      eventSource = new EventSource("/api/room/live-stream");

      eventSource.onmessage = (event) => {
        try {
          const ids = JSON.parse(event.data);
          setLiveRoomIds(new Set(ids));
          retryCount.current = 0; // Reset on success
        } catch {}
      };

      eventSource.onerror = () => {
        eventSource.close();
        // Reconnect with exponential backoff
        if (retryCount.current < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount.current), 30000);
          retryCount.current += 1;
          retryTimeout = setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  return liveRoomIds;
}
