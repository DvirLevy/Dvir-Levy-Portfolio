import { useState, useRef, useEffect, useCallback } from "react"
import { useWebRTC } from "./useWebRTC"
import { useSpeechRecognition } from "./useSpeechRecognition"
import { DAL } from "../utils/DAL"

export const useBotService = (isOpen: boolean) => {
  const [isThinking, setIsThinking] = useState(false)

  const {
    videoRef,
    isConnecting,
    isConnected,
    videoStarted,
    setVideoStarted,
    streamId,
    sessionId,
    closeConnections,
  } = useWebRTC(isOpen)

  const detectLanguage = (text: string) =>
    /[\u0590-\u05FF]/.test(text) ? "he-IL" : "en-US"
  const stopVideoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const askBot = useCallback(
    async (question: string) => {
      if (!question || isThinking || !isOpen || !isConnected) return

      // Clear any pending video stop timer
      if (stopVideoTimeoutRef.current) {
        clearTimeout(stopVideoTimeoutRef.current)
        stopVideoTimeoutRef.current = null
      }

      setIsThinking(true)

      // Aggressively ensure video is unmuted and playing
      if (videoRef.current) {
        videoRef.current.muted = false
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true
              videoRef.current.play().catch(() => {})
            }
          })
        }
      }

      try {
        const startTime = Date.now()
        console.log(`[BotService] Asking LLM: "${question}"`)
        
        const data = await DAL.getChatReply(question, "en-US")
        const llmDuration = (Date.now() - startTime) / 1000
        console.log(`[BotService] LLM Reply (${llmDuration.toFixed(1)}s): "${data.reply.substring(0, 50)}..."`)

          // Force English for all replies
        if (isOpen && isConnected && streamId && sessionId) {
          const maleVoiceId = "en-US-AndrewNeural"
          
          console.log(`[BotService] Sending to D-ID. Voice: ${maleVoiceId}`)
          const didRes = await DAL.talkToStream(
            streamId,
            sessionId,
            data.reply,
            maleVoiceId,
          )

          const didData = await didRes.json()
          if (didRes.ok && didData.kind !== "SessionError") {
            console.log(`[BotService] D-ID Talk SUCCESS.`, didData)
            // Show video when avatar starts talking
            setVideoStarted(true)

            // Calculate duration
            const wordCount = data.reply.split(/\s+/).length
            const estimatedDuration = Math.max(wordCount / 2.3, 5) 
            const duration = didData.duration || estimatedDuration

            console.log(`[BotService] Est. Duration: ${duration}s. Words: ${wordCount}`)

            stopVideoTimeoutRef.current = setTimeout(
              () => {
                setVideoStarted(false)
                stopVideoTimeoutRef.current = null
              },
              duration * 1000 + 10000,
            )
          } else {
            console.warn("[BotService] D-ID Talk failed or SessionError:", didData)
            
            // Re-throw if it's a critical error we want to catch below
            if (didData.kind === "SessionError") {
              throw new Error("D-ID Session expired")
            }

            // Fallback to browser speech if D-ID fails
            const utterance = new SpeechSynthesisUtterance(data.reply)
            utterance.lang = "en-US"
            
            // Try to find a male voice in the browser list
            const voices = window.speechSynthesis.getVoices()
            const maleVoice = voices.find(v => (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Andrew")) && v.lang.startsWith("en"))
            
            if (maleVoice) {
              utterance.voice = maleVoice
            }
            
            window.speechSynthesis.speak(utterance)
          }
        }
      } catch (err) {
        console.error("[BotService] Error in askBot:", err)
      } finally {
        setIsThinking(false)
      }
    },
    [
      isOpen,
      isConnected,
      isThinking,
      streamId,
      sessionId,
      videoRef,
      setVideoStarted,
    ],
  )

  const { isListening, toggleListening, stopListening } =
    useSpeechRecognition(askBot)

  // Reset init question flag when closed
  useEffect(() => {
    if (!isOpen) {
      stopListening()
      if (stopVideoTimeoutRef.current) {
        clearTimeout(stopVideoTimeoutRef.current)
        stopVideoTimeoutRef.current = null
      }
    }
  }, [isOpen, stopListening])

  const handleToggleListening = useCallback(() => {
    if (videoRef.current && videoRef.current.muted)
      videoRef.current.muted = false
    if (isThinking || videoStarted) return
    toggleListening()
  }, [isThinking, videoStarted, toggleListening, videoRef])

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
  }
}
