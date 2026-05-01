import NewRoom from "@/database/model/room2";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";

// SSE endpoint — streams live room IDs in real-time
export async function GET() {
  await connectToDatabase();

  const encoder = new TextEncoder();
  let interval;
  let heartbeat;
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      let previousIds = "";

      const sendUpdate = async () => {
        if (closed) return;
        try {
          const liveRooms = await NewRoom.find(
            { isLive: true },
            { _id: 1 }
          ).lean();

          const currentIds = JSON.stringify(
            liveRooms.map((r) => r._id.toString()).sort()
          );

          // Only send if the live set has changed
          if (currentIds !== previousIds) {
            previousIds = currentIds;
            const data = `data: ${currentIds}\n\n`;
            if (!closed) controller.enqueue(encoder.encode(data));
          }
        } catch (err) {
          if (!closed) console.error("SSE live-stream error:", err);
        }
      };

      // Send initial snapshot immediately
      await sendUpdate();

      // Poll DB every 3 seconds and push changes
      interval = setInterval(sendUpdate, 3000);

      // Send heartbeat every 30s to keep the connection alive
      heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          // Connection closed
        }
      }, 30000);
    },
    cancel() {
      closed = true;
      clearInterval(interval);
      clearInterval(heartbeat);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
