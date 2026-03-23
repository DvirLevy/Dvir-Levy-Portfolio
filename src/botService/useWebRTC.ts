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

  const SOURCE_IMAGE_URL = "s3://d-id-images-prod/google-oauth2|100268267952939492273/img_IztA4oF90ZkkXB1zmjC4y/dvir.png";

  const closeConnections = useCallback(async () => {
    // Stop any ongoing connection attempts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (streamIdRef.current && sessionIdRef.current) {
      // Don't wait for deleteStream as we want to clear state immediately
      DAL.deleteStream(streamIdRef.current, sessionIdRef.current).catch(() => {});
    }

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    streamIdRef.current = null;
    sessionIdRef.current = null;

    setIsConnected(false);
    setIsConnecting(false);
    setVideoStarted(false);
  }, []);

  const connectDID = useCallback(async () => {
    if (isConnecting || isConnected || !isOpen) return;

    // Create a new abort controller for this connection attempt
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsConnecting(true);

    try {
      const createData = await DAL.createStream(SOURCE_IMAGE_URL);

      // Check if aborted while waiting for API
      if (abortController.signal.aborted || !isOpen) {
        if (createData.id && createData.session_id) {
            DAL.deleteStream(createData.id, createData.session_id).catch(() => {});
        }
        return;
      }

      if (createData.kind === "Forbidden" || createData.message) {
        console.error("D-ID Error: ", createData);
        setIsConnecting(false);
        return;
      }

      streamIdRef.current = createData.id;
      sessionIdRef.current = createData.session_id;

      const pc = new RTCPeerConnection({ iceServers: createData.ice_servers });
      peerConnectionRef.current = pc;

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
                await videoRef.current.play().catch(() => {});
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

      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error("Connection failed:", err);
        setIsConnecting(false);
      }
    }
  }, [isOpen, isConnecting, isConnected, closeConnections]);

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
