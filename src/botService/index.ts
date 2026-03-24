import { useState, useRef, useEffect, useCallback } from "react";
import { useWebRTC } from "./useWebRTC";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { DAL } from "../utils/DAL";

export const useBotService = (isOpen: boolean) => {
  const [isThinking, setIsThinking] = useState(false);

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

    // Aggressively ensure video is unmuted and playing
    if (videoRef.current) {
      videoRef.current.muted = false;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
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

          // Wait for duration + 5s (generous buffer) before hiding video
          const wordCount = data.reply.split(/\s+/).length;
          const estimatedDuration = Math.max(wordCount / 2.3, 5); // ~140 words per minute
          const duration = didData.duration || estimatedDuration; 
          
          console.log(`D-ID Talk. Duration: ${duration}s (EST: ${estimatedDuration.toFixed(1)}s). Buffer: 10s`);
          
          stopVideoTimeoutRef.current = setTimeout(() => {
            setVideoStarted(false);
            stopVideoTimeoutRef.current = null;
          }, (duration * 1000) + 10000);

        } else if (didData.kind === "SessionError" || !didRes.ok) {
          console.warn("D-ID Talk failed, using fallback voice.");
          // Fallback to browser speech if D-ID fails or session error
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.lang = detectedLang;
          
          // Try to find a male voice for fallback
          const voices = window.speechSynthesis.getVoices();
          const maleVoice = voices.find(v => v.lang.startsWith(detectedLang.split('-')[0]) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy')));
          if (maleVoice) utterance.voice = maleVoice;

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


  // Reset init question flag when closed
  useEffect(() => {
    if (!isOpen) {
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
