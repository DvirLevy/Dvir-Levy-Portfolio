import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, X, MessageCircleQuestion, VolumeX } from "lucide-react"
import { useBotService } from "@/botService"
import dvirImage from "@/assets/dvir.png"

export const PortfolioBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingIntro, setPendingIntro] = useState(false)

  // Isolate messy imperative API logic exactly into the custom hook
  const {
    videoRef,
    isConnecting,
    isConnected,
    isListening,
    isThinking,
    videoStarted,
    setVideoStarted,
    askBot,
    toggleListening,
    subtitle,
    hasAudioBlocked,
    setHasAudioBlocked,
  } = useBotService(isOpen)

  const onPlayHandler = () => {
    console.log("D-ID Video: Playing")

  }

  // Auto-trigger & Manual Event trigger
  useEffect(() => {
    // Always popup on every visit
    const popupTimer = setTimeout(() => {
      setIsOpen(true)
      setPendingIntro(true)
    }, 2500)

    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-portfolio-bot", handleOpen)
    return () => window.removeEventListener("open-portfolio-bot", handleOpen)
  }, [])

  // Trigger the intro the moment the avatar connects, if permission was granted
  useEffect(() => {
    if (isConnected && pendingIntro) {
      askBot("Who are you?")
      setPendingIntro(false)
    }
  }, [isConnected, pendingIntro, askBot])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-white rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">AI Portfolio Assistant</DialogTitle>
        <DialogDescription className="sr-only">
          Interact with Dvir's AI avatar to learn more about his work and
          experience.
        </DialogDescription>

        {/* Modern Interactive Video Container */}
        <div
          onClick={(e) => {
            if (hasAudioBlocked && videoRef.current) {
              e.stopPropagation()
              videoRef.current.muted = false
              setHasAudioBlocked(false)
            } else {
              toggleListening()
            }
          }}
          className={`relative w-64 h-64 rounded-full overflow-hidden border-[6px] transition-all duration-300 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center bg-zinc-900 ${isListening
            ? "border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.4)]"
            : isThinking
              ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              : "border-zinc-700 hover:border-zinc-500"
            }`}
        >
          {/* Static Placeholder while waiting using the perfect user-uploaded frame */}
          {!videoStarted && (
            <img
              src={dvirImage}
              alt="Dvir Levy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-100 transition-opacity duration-500"
            />
          )}

          {hasAudioBlocked && (
            <div className="absolute inset-0 z-40 bg-black/60 flex flex-col items-center justify-center rounded-full">
               <VolumeX className="w-10 h-10 text-white mb-2 animate-pulse drop-shadow-md" />
               <span className="text-white text-xs font-bold px-3 py-1 bg-zinc-900/80 rounded-full shadow-lg border border-zinc-700">Tap to Unmute</span>
            </div>
          )}

          {/* Core Video Player */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover object-center relative z-20 transition-opacity duration-500 ${videoStarted ? "opacity-100" : "opacity-0"}`}
            autoPlay
            playsInline
            muted
            onPlaying={() => setVideoStarted(true)}
            onPlay={() => onPlayHandler}
            onPause={() => console.log("D-ID Video: Paused")}
            onEnded={() => {
              console.log("D-ID Video: Ended")
              setVideoStarted(false)
            }}
            onError={(e) => {
              const video = e.target as HTMLVideoElement;
              console.error("D-ID Video Error Details:", {
                code: video.error?.code,
                message: video.error?.message,
              });
            }}
          />

          {isConnecting && (
            <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center">
              <span className="animate-pulse font-semibold tracking-wider text-xs">
                BOOTING AI
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Status Text */}
        <p
          className={`mt-6 text-sm font-medium tracking-wide transition-all duration-300 ${isListening
            ? "text-green-400"
            : isThinking
              ? "text-amber-400"
              : "text-zinc-500"
            }`}
        >
          {isConnecting
            ? "Connecting to Dvir's Avatar..."
            : isThinking
              ? "Consulting internal Knowledge Base..."
              : isListening
                ? "I'm listening..."
                : isConnected
                  ? "Online. Ask me anything!"
                  : "Offline"}
        </p>

        {/* Dynamic Answer */}
        <div className={`mt-6 w-[90%] overflow-hidden relative h-6 transition-all duration-300 ${videoStarted ? "opacity-100" : "opacity-0"}`}>
          <p
            className="absolute text-sm font-medium tracking-wide text-zinc-200 whitespace-nowrap"
            style={{
              animation: (subtitle && videoStarted) ? `marquee ${Math.max(15, Math.ceil(subtitle.length / 10))}s linear infinite` : "none",
            }}
          >
            {subtitle || " "}
          </p>
        </div>

        <style>{`
          @keyframes marquee {
            0% { left: 100%; transform: translateX(0); }
            100% { left: 0; transform: translateX(-100%); }
          }
        `}</style>

        {/* Control Desk */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
          <Button
            variant="default"
            onClick={toggleListening}
            disabled={!isConnected || isThinking || videoStarted}
            className={`flex-1 min-w-[130px] rounded-full font-bold shadow-lg transition-all ${isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
          >
            <Mic className="w-5 h-5 mr-1.5" />
            {isListening ? "STOP LISTENING" : "ASK ME"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => askBot("Who are you?")}
            disabled={!isConnected || isThinking || isListening || videoStarted}
            className="flex-1 min-w-[130px] rounded-full font-semibold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-lg transition-colors"
          >
            <MessageCircleQuestion className="w-4 h-4 mr-1.5" />
            WHO AM I?
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="flex-none rounded-full px-4 border border-zinc-800 bg-zinc-900/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 shadow-lg transition-all"
          >
            <X className="w-4 h-4 mr-1.5" />
            CLOSE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
