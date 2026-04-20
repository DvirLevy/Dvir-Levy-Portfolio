import { useState, useRef, useEffect, useCallback } from "react"
import { useWebRTC } from "./useWebRTC"
import { useSpeechRecognition } from "./useSpeechRecognition"
import { DAL } from "../utils/DAL"

export const useBotService = (isOpen: boolean, selectedLanguage: string = "en-US") => {
  const [isThinking, setIsThinking] = useState(false)
  const [botLanguage, setBotLanguage] = useState(selectedLanguage)
  const [subtitle, setSubtitle] = useState("")
  const [hasAudioBlocked, setHasAudioBlocked] = useState(false)

  const {
    videoRef,
    isConnecting,
    isConnected,
    isVideoVisible,
    setIsVideoVisible,
    setVideoStarted,
    videoStarted,
    streamId,
    sessionId,
    closeConnections,
  } = useWebRTC(isOpen)

  const videoBuffer: number = 12000

  const detectLanguage = (text: string) =>
    /[\u0590-\u05FF]/.test(text) ? "he-IL" : "en-US"
  const stopVideoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const askBot = useCallback(
    async (question: string, onRender = false, isMessage = false) => {
      if (!question || isThinking || !isOpen || !isConnected) return

      // Clear any pending video stop timer
      if (stopVideoTimeoutRef.current) {
        clearTimeout(stopVideoTimeoutRef.current)
        stopVideoTimeoutRef.current = null
      }

      setIsThinking(true)
      setSubtitle("")
      setHasAudioBlocked(false)

      // Aggressively ensure video is unmuted and playing
      if (videoRef.current) {
        videoRef.current.muted = false
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true
              setHasAudioBlocked(true)
              videoRef.current.play().catch(() => {})
            }
          })
        }
      }

      try {
        const startTime = Date.now()
        console.log(
          `[BotService] Asking LLM (${selectedLanguage}): "${question}"`,
        )

        const data = await DAL.getChatReply(
          question,
          selectedLanguage,
          onRender,
          isMessage,
        )
        // Wait to show subtitle until the avatar is actually triggered
        const llmDuration = (Date.now() - startTime) / 1000
        console.log(`[BotService] LLM Reply (${llmDuration.toFixed(1)}s): "${data.reply.substring(0, 50)}..."`)

        // Force English for all replies
        if (isOpen && isConnected && streamId && sessionId) {
          // Use server-returned language or fallback to detection
          const actualLanguage = data.language || detectLanguage(data.reply)
          setBotLanguage(actualLanguage)

          const voiceId = actualLanguage === "he-IL"
            ? "he-IL-AvriNeural"
            : "en-US-AndrewNeural"

          console.log(`[BotService] Sending to D-ID. Voice: ${voiceId} (Detected: ${actualLanguage})`)
          setIsVideoVisible(true)
          const didRes = await DAL.talkToStream(
            streamId,
            sessionId,
            data.reply,
            voiceId,
          )

          const didData = await didRes.json()
          if (didRes.ok && didData.kind !== "SessionError") {
            setVideoStarted(true)
            console.log(`[BotService] D-ID Talk SUCCESS.`, didData)
            // Set subtitle immediately — video will show when onPlaying fires (actual frames)
            setSubtitle(data.reply)

            // Calculate duration
            const wordCount = data.reply.split(/\s+/).length
            const estimatedDuration = Math.max(wordCount / 2.3, 5)
            const duration = didData.duration || estimatedDuration

            console.log(`[BotService] Est. Duration: ${duration}s. Words: ${wordCount}`)

            stopVideoTimeoutRef.current = setTimeout(
              () => {
                setVideoStarted(false)
                setIsVideoVisible(false)
                stopVideoTimeoutRef.current = null
              },
              // Increase the buffer by 8 seconds to account for D-ID backend generation times
              // plus WebRTC transit delay before the actual video starts playing
              duration * 1000 + videoBuffer,
            )
          } else {
            console.warn("[BotService] D-ID Talk failed or SessionError:", didData)

            // Re-throw if it's a critical error we want to catch below
            if (didData.kind === "SessionError") {
              throw new Error("D-ID Session expired")
            }

            // Fallback to browser speech if D-ID fails
            const utterance = new SpeechSynthesisUtterance(data.reply)
            utterance.lang = actualLanguage

            // Try to find a male voice in the browser list
            const voices = window.speechSynthesis.getVoices()
            const maleVoice = voices.find(v =>
              (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Andrew") || v.name.includes("Avri")) &&
              v.lang.startsWith(actualLanguage.split('-')[0])
            )

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
      selectedLanguage, // Added to dependency array
    ],
  )

  const { isListening, toggleListening, stopListening } =
    useSpeechRecognition(askBot, selectedLanguage)

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
    isVideoVisible,
    setIsVideoVisible,
    askBot,
    toggleListening: handleToggleListening,
    subtitle,
    botLanguage,
    hasAudioBlocked,
    setHasAudioBlocked,
  }
}
