import { useState, useRef, useCallback } from "react";

export const useSpeechRecognition = (onTranscriptComplete: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef("");

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition is not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    finalTranscriptRef.current = "";

    recognition.onstart = () => {
      setIsListening(true);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => stopListening(), 5000);
    };

    recognition.onresult = (event: any) => {
      let current = "";
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      finalTranscriptRef.current = current;

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => stopListening(), 2500);
    };

    recognition.onerror = () => stopListening();

    recognition.onend = () => {
      const text = finalTranscriptRef.current.trim();
      setIsListening(false);
      if (text.length > 0) {
        onTranscriptComplete(text);
        finalTranscriptRef.current = "";
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscriptComplete, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
    toggleListening,
  };
};
