import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, X, MessageCircleQuestion, VolumeX, Globe, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBotService } from "@/botService"
import dvirImage from "@/assets/dvir.png"

export const PortfolioBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingIntro, setPendingIntro] = useState(false)
  const [language, setLanguage] = useState("en-US")
  const [textInput, setTextInput] = useState("")
  // const [isVideoVisable, setIsVideoVisable] = useState(false)

  // Isolate messy imperative API logic exactly into the custom hook
  const {
    videoRef,
    isConnecting,
    isConnected,
    isListening,
    isThinking,
    videoStarted,
    setVideoStarted,
    setIsVideoVisible,
    isVideoVisible,
    askBot,
    toggleListening,
    subtitle,
    botLanguage,
    hasAudioBlocked,
    setHasAudioBlocked,
  } = useBotService(isOpen, language)

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

    const handleOpen = () => {
      setIsOpen(true)
      // setPendingIntro(true)
    }
    window.addEventListener("open-portfolio-bot", handleOpen)
    return () => {
      clearTimeout(popupTimer)
      window.removeEventListener("open-portfolio-bot", handleOpen)
    }
  }, [])

  // Trigger the intro the moment the avatar connects, if permission was granted
  useEffect(() => {
    if (isConnected && pendingIntro) {
      videoRef.current.play().catch(() => { })
      askBot("Who are you?", true)
      setPendingIntro(false)
    }
  }, [isConnected, pendingIntro, askBot, language])

  const handleSendText = () => {
    if (textInput.trim() && isConnected && !isThinking && !isListening) {
      askBot(textInput.trim(), false, true)
      setTextInput("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-white rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">AI Portfolio Assistant</DialogTitle>
        <DialogDescription className="sr-only">
          Interact with Dvir's AI avatar to learn more about his work and
          experience.
        </DialogDescription>

        <div className="absolute top-4 left-4 z-50">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[110px] bg-zinc-900/50 border-zinc-700 text-xs h-8 rounded-full focus:ring-0">
              <Globe className="w-3 h-3 mr-2 text-zinc-400" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="en-US">English</SelectItem>
              <SelectItem value="he-IL">עברית</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            className={`w-full h-full object-cover object-center relative z-20 transition-opacity duration-300 ${videoStarted ? "opacity-100" : "opacity-0"}`}
            autoPlay
            playsInline
            muted
            onCanPlay={() => console.log('D-ID Video: Can Play')}
            onPlaying={() => console.log('D-ID Video: Playing')}
            onPlay={() => console.log("D-ID Video: Playing")}
            onPause={() => console.log("D-ID Video: Paused")}
            onEnded={() => { console.log("D-ID Video: Ended") }}
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
            ? (language === "he-IL" ? "מתחבר לאווטאר של דביר..." : "Connecting to Dvir's Avatar...")
            : isThinking
              ? (language === "he-IL" ? "מתייעץ עם מאגר הידע..." : "Consulting internal Knowledge Base...")
              : isListening
                ? (language === "he-IL" ? "אני מקשיב..." : "I'm listening...")
                : isConnected
                  ? (language === "he-IL" ? "מחובר. שאל אותי כל דבר!" : "Online. Ask me anything!")
                  : (language === "he-IL" ? "לא מחובר" : "Offline")}
        </p>

        {/* Dynamic Answer — visible as soon as subtitle is set to prevent synchronization lag */}
        <div className={`mt-6 w-[90%] overflow-hidden relative h-6 transition-all duration-100 ${isVideoVisible ? "opacity-100" : "opacity-0"}`}>
          <p
            key={`${subtitle}-${botLanguage}`}
            data-language={botLanguage}
            className="absolute text-sm font-medium tracking-wide text-zinc-200 whitespace-nowrap"
            style={{
              animation: isVideoVisible //try video started
                ? `${botLanguage?.startsWith("he") ? "marquee-ltr" : "marquee-rtl"} ${Math.max(15, Math.ceil(subtitle.length / 10))}s linear infinite`
                : "none",
            }}
          >
            {subtitle || " "}
          </p>
        </div>

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
            {isListening
              ? (language === "he-IL" ? "הפסק להקשיב" : "STOP LISTENING")
              : (language === "he-IL" ? "שאל אותי" : "ASK ME")}
          </Button>

          <Button
            variant="secondary"
            onClick={() => askBot(language === "he-IL" ? "מי אתה?" : "Who are you?")}
            disabled={!isConnected || isThinking || isListening || videoStarted}
            className="flex-1 min-w-[130px] rounded-full font-semibold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-lg transition-colors"
          >
            <MessageCircleQuestion className="w-4 h-4 mr-1.5" />
            {language === "he-IL" ? "מי אני?" : "WHO AM I?"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="flex-none rounded-full px-4 border border-zinc-800 bg-zinc-900/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 shadow-lg transition-all"
          >
            <X className="w-4 h-4 mr-1.5" />
            {language === "he-IL" ? "סגור" : "CLOSE"}
          </Button>
        </div>

        {/* Text Input Area */}
        <div className="relative w-full mt-6 group">
          <Input
            type="text"
            placeholder={
              language === "he-IL" ? "הקלד שאלה פה..." : "Type your question..."
            }
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendText()
              }
            }}
            disabled={!isConnected || isThinking || isListening}
            dir={language === "he-IL" ? "rtl" : "ltr"}
            className="w-full bg-zinc-900/40 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-2xl h-14 pl-5 pr-14 text-zinc-100 placeholder:text-zinc-600 transition-all duration-300 backdrop-blur-sm"
          />
          <Button
            size="icon"
            onClick={handleSendText}
            disabled={
              !isConnected || isThinking || isListening || !textInput.trim()
            }
            className="absolute top-2 right-2 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 active:scale-90 shadow-lg shadow-emerald-900/20"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
