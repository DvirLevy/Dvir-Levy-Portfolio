import { useState, useRef, useEffect, useCallback } from "react";
import { DAL } from "../utils/DAL";

export const useWebRTC = (isOpen: boolean) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const connectionStateRef = useRef({ isConnecting: false, isConnected: false });
  const SOURCE_IMAGE_URL = "dvir.png";

  const closeConnections = useCallback(async () => {
    // Stop any ongoing connection attempts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Capture IDs before clearing refs
    const currentStreamId = streamIdRef.current;
    const currentSessionId = sessionIdRef.current;
    
    if (currentStreamId && currentSessionId) {
      console.log(`Cleaning up D-ID session: ${currentStreamId}`);
      DAL.deleteStream(currentStreamId, currentSessionId).catch(() => { });
      
      // Always unconditionally wipe localStorage when tearing down a stream
      localStorage.removeItem("did_stream_id");
      localStorage.removeItem("did_session_id");
      localStorage.removeItem("did_session_timestamp");
    }

    streamIdRef.current = null;
    sessionIdRef.current = null;
    connectionStateRef.current = { isConnecting: false, isConnected: false };
    setIsConnected(false);
    setIsConnecting(false);
    setVideoStarted(false);
  }, [videoRef]);

  const connectDID = useCallback(async () => {
    if (connectionStateRef.current.isConnecting || connectionStateRef.current.isConnected || !isOpen) return;

    // Create a new abort controller for this connection attempt
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    connectionStateRef.current.isConnecting = true;
    setIsConnecting(true);

    try {
      // 1. Clean up any orphaned session from previous unclosed sessions (e.g. tab refresh)
      const oldStreamId = localStorage.getItem("did_stream_id");
      const oldSessionId = localStorage.getItem("did_session_id");

      if (
        oldStreamId && oldStreamId !== "undefined" && 
        oldSessionId && oldSessionId !== "undefined"
      ) {
        // Fire and forget to ensure no hanging streams are billed
        DAL.deleteStream(oldStreamId, oldSessionId).catch(() => { });
      }
      
      // Clear storage before starting new request
      localStorage.removeItem("did_stream_id");
      localStorage.removeItem("did_session_id");
      localStorage.removeItem("did_session_timestamp");

      const createResponse = await DAL.createStream(SOURCE_IMAGE_URL);

      if (!createResponse.ok) {
        console.error("D-ID Stream Creation Failed. Status:", createResponse.status);
        connectionStateRef.current.isConnecting = false;
        setIsConnecting(false);
        return;
      }

      const createData = await createResponse.json();

      // Check if aborted while waiting for API
      if (abortController.signal.aborted || !isOpen) {
        if (createData.id && createData.session_id) {
          DAL.deleteStream(createData.id, createData.session_id).catch(() => { });
        }
        return;
      }

      // 2nd Issue Fix: DO NOT SAVE IF ID IS MISSING (PREVENTS "undefined" bug)
      if (!createData.id || !createData.session_id) {
        console.error("D-ID Missing IDs in response:", createData);
        connectionStateRef.current.isConnecting = false;
        setIsConnecting(false);
        return;
      }

      streamIdRef.current = createData.id;
      sessionIdRef.current = createData.session_id;

      // Save to localStorage immediately
      localStorage.setItem("did_stream_id", createData.id);
      localStorage.setItem("did_session_id", createData.session_id);
      localStorage.setItem("did_session_timestamp", Date.now().toString());

      const pc = new RTCPeerConnection({ iceServers: createData.ice_servers });
      peerConnectionRef.current = pc;
      
      // Listen for disconnection to auto-reconnect later
      pc.addEventListener("connectionstatechange", () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
          connectionStateRef.current.isConnected = false;
          setIsConnected(false);
        }
      });

      pc.addEventListener("icecandidate", async (event) => {
        if (event.candidate && streamIdRef.current && !abortController.signal.aborted) {
          await DAL.submitIceCandidate(streamIdRef.current, {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            session_id: sessionIdRef.current,
          });
        }
      });

      pc.addEventListener("track", (event) => {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.onloadedmetadata = async () => {
            try {
              if (videoRef.current) await videoRef.current.play();
            } catch (e) {
              if (videoRef.current) {
                videoRef.current.muted = true;
                await videoRef.current.play().catch(() => { });
              }
            }
          };
        }
      });

      await pc.setRemoteDescription(createData.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (abortController.signal.aborted || !isOpen) {
        closeConnections();
        return;
      }

      // Start the media pipeline from the cloud
      if (streamIdRef.current && sessionIdRef.current) {
        await DAL.startStream(streamIdRef.current, answer, sessionIdRef.current);
      }

      if (abortController.signal.aborted || !isOpen) {
        closeConnections();
        return;
      }

      connectionStateRef.current.isConnected = true;
      connectionStateRef.current.isConnecting = false;
      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error("Connection failed:", err);
        connectionStateRef.current.isConnecting = false;
        setIsConnecting(false);
      }
    }
  }, [isOpen, closeConnections]);

  useEffect(() => {
    if (isOpen) {
      connectDID();
    } else {
      closeConnections();
    }
  }, [isOpen, connectDID, closeConnections]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnections();
    };
  }, [closeConnections]);

  // Reliable cleanup on window close or refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (streamIdRef.current && sessionIdRef.current) {
        // Fire and forget, DAL.deleteStream uses keepalive: true
        DAL.deleteStream(streamIdRef.current, sessionIdRef.current).catch(() => { });
        localStorage.removeItem("did_stream_id");
        localStorage.removeItem("did_session_id");
        localStorage.removeItem("did_session_timestamp");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    videoRef,
    isConnecting,
    isConnected,
    videoStarted,
    setVideoStarted,
    streamId: streamIdRef.current,
    sessionId: sessionIdRef.current,
    closeConnections,
  };
};
