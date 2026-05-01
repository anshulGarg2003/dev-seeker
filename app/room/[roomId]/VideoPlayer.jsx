"use client";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  CallParticipantsList,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { AddCoin, OnAir, generateTokenAction } from "./action";
import { useRouter } from "next/navigation";
import Lottie from "@/components/LottieWrapper";
import Live from "@/Live.json";
import Waiting from "@/Waiting.json";
import { useCallContext } from "@/context/CallContext";
import AdmitPanel from "./AdmitPanel";
import { Users, Wifi, RefreshCw, AlertTriangle } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY;
const MAX_RETRIES = 3;

export default function VideoCall({ roomInfo, isCreator, onConnectionLost, onConnectionRestored }) {
  const session = useSession();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [callData, setCallData] = useState({});
  const [callStatus, setCallStatus] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retriesRef = useRef(0);
  const clientRef = useRef(null);
  const callRef = useRef(null);
  const { setRoomCreator, setCallSession, setRoomInfo, setHeaderRefresh } =
    useCallContext();
  const router = useRouter();

  const connectToCall = useCallback((userId, userName) => {
    // Cleanup previous
    const prevCall = callRef.current;
    const prevClient = clientRef.current;
    if (prevCall) prevCall.leave().catch(() => {});
    if (prevClient) prevClient.disconnectUser().catch(() => {});
    callRef.current = null;
    clientRef.current = null;

    if (!apiKey) {
      setConnectionError("Stream API key is not configured. Check NEXT_PUBLIC_GET_STREAM_API_KEY.");
      return;
    }

    const userIdStr = String(userId);

    const newClient = new StreamVideoClient({
      apiKey,
      user: { id: userIdStr, name: userName },
      tokenProvider: () => generateTokenAction(),
      options: {
        maxConnectUserRetries: 5,
        onConnectUserError: (err, allErrors) => {
          console.error("Stream connect error:", err, "All errors:", allErrors);
          setConnectionError(
            `Connection failed: ${err?.message || "Unable to reach Stream servers. Check your network."}`
          );
        },
      },
    });

    clientRef.current = newClient;
    setClient(newClient);

    const newCall = newClient.call("default", roomInfo);
    callRef.current = newCall;
    setCall(newCall);
    setConnectionError(null);
    retriesRef.current = 0;

    // Fire-and-forget join — UI renders immediately with the call object
    newCall
      .join({ create: true })
      .then(() => {
        console.log("Successfully joined the call");
        onConnectionRestored?.();
      })
      .catch((err) => {
        console.error("Failed to join call:", err);
        const msg = err?.message || String(err) || "Failed to join the room";
        setConnectionError(msg);
        onConnectionLost?.();
      });
  }, [roomInfo]);

  useEffect(() => {
    if (!roomInfo || !session?.data?.user) return;

    connectToCall(session.data.user.id, session.data.user.name);

    return () => {
      const c = callRef.current;
      const cl = clientRef.current;
      if (c) c.leave().catch(() => {});
      if (cl) cl.disconnectUser().catch(() => {});
      callRef.current = null;
      clientRef.current = null;
    };
  }, [session?.data?.user?.id, roomInfo, connectToCall]);

  // Listen for call errors and auto-reconnect
  useEffect(() => {
    if (!call) return;

    const handleError = async () => {
      if (!session?.data?.user) return;
      console.warn("Stream call error detected, attempting reconnect...");
      if (retriesRef.current >= MAX_RETRIES) {
        setConnectionError("Connection lost after multiple retries");
        setRetrying(false);
        onConnectionLost?.();
        return;
      }
      retriesRef.current += 1;
      setRetrying(true);
      const delay = Math.pow(2, retriesRef.current) * 1000;
      await new Promise((r) => setTimeout(r, delay));
      connectToCall(session.data.user.id, session.data.user.name);
      setRetrying(false);
    };

    call.on("call.error", handleError);
    return () => call.off("call.error", handleError);
  }, [call, session, connectToCall]);

  const handleManualReconnect = () => {
    if (!session?.data?.user) return;
    setRetrying(true);
    setConnectionError(null);
    retriesRef.current = 0;
    connectToCall(session.data.user.id, session.data.user.name);
    setRetrying(false);
  };

  useEffect(() => {
    setTotalCount(participantCount);
  }, [participantCount]);

  // Error / reconnecting state
  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-lg font-bold text-foreground">Connection Lost</h2>
          <p className="text-sm text-muted-foreground">{connectionError}</p>
        </div>
        <button
          onClick={handleManualReconnect}
          disabled={retrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
          {retrying ? "Reconnecting..." : "Reconnect"}
        </button>
      </div>
    );
  }

  if (retrying) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Reconnecting to room...</p>
      </div>
    );
  }

  return (
    client &&
    call && (
      <StreamVideo client={client} className="absolute">
        {/* Admit panel for creator */}
        {isCreator && <AdmitPanel roomId={roomInfo} />}

        {/* Live indicator */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-[50px]">
            <Lottie animationData={Live} />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 dark:bg-white/[0.03] border border-border dark:border-white/5">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-muted-foreground">
              {totalCount} in room
            </span>
          </div>
        </div>

        <StreamCall call={call}>
          <StreamTheme>
            <MyVideoUI
              setParticipantCount={setParticipantCount}
              setCallData={setCallData}
              setCallStatus={setCallStatus}
            />
            {totalCount > 1 ? (
              <>
                <SpeakerLayout />
                <CallControls
                  onLeave={async () => {
                    try {
                      const result = await AddCoin(roomInfo, callData);
                      if (result) {
                        setRoomCreator(result.CreatorId);
                        setCallSession(result.totalMin);
                      }
                    } catch (err) {
                      console.error("AddCoin error:", err);
                    }
                    setRoomInfo(roomInfo);
                    setHeaderRefresh((prev) => !prev);
                    router.push("/feedback");
                  }}
                />
                <CallParticipantsList onClose={() => undefined} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-6">
                {/* Pulsing rings */}
                <div className="relative">
                  <div className="absolute inset-0 w-52 h-52 rounded-full border border-violet-500/10 animate-pulse-slow" />
                  <div className="absolute inset-4 w-44 h-44 rounded-full border border-fuchsia-500/10 animate-pulse-slow [animation-delay:1s]" />
                  <div className="w-52 h-52 flex items-center justify-center">
                    <Lottie animationData={Waiting} />
                  </div>
                </div>

                <div className="text-center space-y-3 max-w-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h2 className="text-xl font-bold text-foreground">
                      You&apos;re live
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Waiting for other developers to join the room...
                  </p>
                  {isCreator && (
                    <p className="text-xs text-violet-400/70 font-medium">
                      Admit requests will appear in the top-right panel
                    </p>
                  )}
                </div>

                {/* Pulsing dots */}
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"
                      style={{ animationDelay: `${i * 300}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    )
  );
}

const MyVideoUI = ({ setParticipantCount, setCallData, setCallStatus }) => {
  const { useParticipantCount, useLocalParticipant, useCallState } =
    useCallStateHooks();

  const callSession = useLocalParticipant();
  const participantCount = useParticipantCount();
  const callstate = useCallState();

  useEffect(() => {
    setParticipantCount(participantCount);
    setCallData(callSession);
    setCallStatus(callstate);
  }, [participantCount, callSession, callstate]);

  return (
    <>
      <div>
        <div>Number of participants: {participantCount}</div>
      </div>
    </>
  );
};
