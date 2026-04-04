import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, X, MessageCircleQuestion } from "lucide-react"
import { useBotService } from "@/botService"

export const PortfolioBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)

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
  } = useBotService(isOpen)

  // Daily auto-trigger & Manual Event trigger
  useEffect(() => {
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem("botLastShown")

    // Automatically popup on first visit of the day
    if (lastShown !== today) {
      localStorage.setItem("botLastShown", today)
      setTimeout(() => setIsOpen(true), 2500)
    }

    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-portfolio-bot", handleOpen)
    return () => window.removeEventListener("open-portfolio-bot", handleOpen)
  }, [])

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
          onClick={toggleListening}
          className={`relative w-64 h-64 rounded-full overflow-hidden border-[6px] transition-all duration-300 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center bg-zinc-900 ${
            isListening
              ? "border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.4)]"
              : isThinking
                ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                : "border-zinc-700 hover:border-zinc-500"
          }`}
        >
          {/* Static Placeholder while waiting using the perfect user-uploaded frame */}
          {!videoStarted && (
            <img
              src="/src/assets/dvir.png"
              alt="Dvir Avatar"
              className="w-full h-full object-cover object-center absolute top-0 left-0 z-10 opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Core Video Player */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover object-center relative z-20 transition-opacity duration-500 ${videoStarted ? "opacity-100" : "opacity-0"}`}
            autoPlay
            playsInline
            muted
            onPlaying={() => setVideoStarted(true)}
            onPlay={() => console.log("D-ID Video: Playing")}
            onPause={() => console.log("D-ID Video: Paused")}
            onEnded={() => console.log("D-ID Video: Ended")}
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
          className={`mt-6 text-sm font-medium tracking-wide transition-all duration-300 ${
            isListening
              ? "text-green-400"
              : isThinking
                ? "text-amber-400"
                : "text-zinc-500"
          }`}
        >
          {isConnecting
            ? "Connecting to Dvir's Neural Core..."
            : isThinking
              ? "Consulting internal Knowledge Base..."
              : isListening
                ? "Listening intently to your voice..."
                : isConnected
                  ? "Online. Ask me anything!"
                  : "System Offline"}
        </p>

        {/* Control Desk */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
          <Button
            variant="default"
            onClick={toggleListening}
            disabled={!isConnected || isThinking}
            className={`flex-1 min-w-[130px] rounded-full font-bold shadow-lg transition-all ${
              isListening
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
            disabled={!isConnected || isThinking || isListening}
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
