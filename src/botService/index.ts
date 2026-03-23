import { useState, useRef, useEffect, useCallback } from "react";
import { useWebRTC } from "./useWebRTC";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { DAL } from "../utils/DAL";

export const useBotService = (isOpen: boolean) => {
  const [isThinking, setIsThinking] = useState(false);
  const hasAskedInitQuestion = useRef(false);

  const {
    videoRef,
    isConnecting,
    isConnected,
    videoStarted,
    setVideoStarted,
    streamId,
    sessionId,
    closeConnections,
  } = useWebRTC(isOpen);

  const detectLanguage = (text: string) => (/[\u0590-\u05FF]/.test(text) ? "he-IL" : "en-US");
  const stopVideoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const askBot = useCallback(async (question: string) => {
    if (!question || isThinking || !isOpen || !isConnected) return;

    // Clear any pending video stop timer
    if (stopVideoTimeoutRef.current) {
      clearTimeout(stopVideoTimeoutRef.current);
      stopVideoTimeoutRef.current = null;
    }

    setIsThinking(true);

    // Ensure video is playing and unmuted if needed
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
      if (videoRef.current.muted) {
        videoRef.current.muted = false;
        if (videoRef.current.paused) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }
    }

    try {
      const detectedLang = detectLanguage(question);
      const data = await DAL.getChatReply(question, detectedLang);

      // Check if still open and connected after async call
      if (isOpen && isConnected && streamId && sessionId) {
        const maleVoiceId = detectedLang === "he-IL" ? "he-IL-AvriNeural" : "en-US-ChristopherNeural";
        const didRes = await DAL.talkToStream(streamId, sessionId, data.reply, maleVoiceId);

        const didData = await didRes.json();
        if (didRes.ok && didData.kind !== "SessionError") {
          // Show video when avatar starts talking
          setVideoStarted(true);

          // Wait for duration + 1s before hiding video
          const duration = didData.duration || 5; // Default 5s if duration missing
          stopVideoTimeoutRef.current = setTimeout(() => {
            setVideoStarted(false);
            stopVideoTimeoutRef.current = null;
          }, (duration * 1000) + 1000);

        } else if (didData.kind === "SessionError" || !didRes.ok) {
          // Fallback to browser speech if D-ID fails or session error
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.lang = detectedLang;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Error in askBot:", err);
    } finally {
      setIsThinking(false);
    }
  }, [isOpen, isConnected, isThinking, streamId, sessionId, videoRef, setVideoStarted]);

  const { isListening, toggleListening, stopListening } = useSpeechRecognition(askBot);

  // Auto-pitch if it's the first time connected and widget is still open
  useEffect(() => {
    if (isConnected && isOpen && !hasAskedInitQuestion.current) {
      hasAskedInitQuestion.current = true;
      askBot("Who are you?");
    }
  }, [isConnected, isOpen, askBot]);

  // Reset init question flag when closed
  useEffect(() => {
    if (!isOpen) {
      hasAskedInitQuestion.current = false;
      stopListening();
      if (stopVideoTimeoutRef.current) {
        clearTimeout(stopVideoTimeoutRef.current);
        stopVideoTimeoutRef.current = null;
      }
    }
  }, [isOpen, stopListening]);

  const handleToggleListening = useCallback(() => {
    if (videoRef.current && videoRef.current.muted) videoRef.current.muted = false;
    if (isThinking) return;
    toggleListening();
  }, [isThinking, toggleListening, videoRef]);

  return {
    videoRef,
    isConnecting,
    isConnected,
    isListening,
    isThinking,
    videoStarted,
    setVideoStarted,
    askBot,
    toggleListening: handleToggleListening,
  };
};
