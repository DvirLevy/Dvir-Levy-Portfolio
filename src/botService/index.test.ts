import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DAL } from "../utils/DAL"
import { useBotService } from "./index"

vi.mock("../utils/DAL", () => ({
  DAL: {
    getChatReply: vi.fn(),
    talkToStream: vi.fn(),
  },
}))

const webRTCState = {
  videoRef: { current: null as HTMLVideoElement | null },
  isConnecting: false,
  isConnected: true,
  isVideoVisible: false,
  setIsVideoVisible: vi.fn(),
  setVideoStarted: vi.fn(),
  videoStarted: false,
  streamId: "stream-1",
  sessionId: "session-1",
  closeConnections: vi.fn(),
}

vi.mock("./useWebRTC", () => ({
  useWebRTC: () => webRTCState,
}))

const speechState = {
  isListening: false,
  startListening: vi.fn(),
  stopListening: vi.fn(),
  toggleListening: vi.fn(),
}

vi.mock("./useSpeechRecognition", () => ({
  useSpeechRecognition: () => speechState,
}))

const speakMock = vi.fn()
const getVoicesMock = vi.fn().mockReturnValue([])

beforeEach(() => {
  vi.clearAllMocks()
  webRTCState.isConnected = true
  webRTCState.videoRef.current = {
    muted: true,
    paused: true,
    play: vi.fn().mockResolvedValue(undefined),
  } as unknown as HTMLVideoElement

  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      text: string
      lang = ""
      voice: unknown = null
      constructor(text: string) {
        this.text = text
      }
    },
  )
  vi.stubGlobal("speechSynthesis", { getVoices: getVoicesMock, speak: speakMock })
})

describe("useBotService askBot", () => {
  it("sends the talking-avatar reply to D-ID and sets the subtitle on success", async () => {
    vi.mocked(DAL.getChatReply).mockResolvedValue({ reply: "Hello there", language: "en-US" })
    vi.mocked(DAL.talkToStream).mockResolvedValue({
      ok: true,
      json: async () => ({ kind: "ok", duration: 4 }),
    } as Response)

    const { result } = renderHook(() => useBotService(true, "en-US"))

    await act(async () => {
      await result.current.askBot("what is this?")
    })

    expect(DAL.getChatReply).toHaveBeenCalledWith("what is this?", "en-US", false, false)
    expect(DAL.talkToStream).toHaveBeenCalledWith(
      "stream-1",
      "session-1",
      "Hello there",
      "en-US-AndrewNeural",
    )
    expect(webRTCState.setVideoStarted).toHaveBeenCalledWith(true)
    expect(result.current.subtitle).toBe("Hello there")
    expect(result.current.isThinking).toBe(false)
    expect(speakMock).not.toHaveBeenCalled()
  })

  it("picks the Hebrew voice when the reply language is Hebrew", async () => {
    vi.mocked(DAL.getChatReply).mockResolvedValue({ reply: "שלום", language: "he-IL" })
    vi.mocked(DAL.talkToStream).mockResolvedValue({
      ok: true,
      json: async () => ({ kind: "ok", duration: 2 }),
    } as Response)

    const { result } = renderHook(() => useBotService(true, "he-IL"))

    await act(async () => {
      await result.current.askBot("מה זה?")
    })

    expect(DAL.talkToStream).toHaveBeenCalledWith(
      "stream-1",
      "session-1",
      "שלום",
      "he-IL-AvriNeural",
    )
  })

  it("falls back to browser speech synthesis when D-ID talk fails", async () => {
    vi.mocked(DAL.getChatReply).mockResolvedValue({ reply: "Hello there", language: "en-US" })
    vi.mocked(DAL.talkToStream).mockResolvedValue({
      ok: false,
      json: async () => ({ kind: "Error" }),
    } as Response)

    const { result } = renderHook(() => useBotService(true, "en-US"))

    await act(async () => {
      await result.current.askBot("what is this?")
    })

    expect(speakMock).toHaveBeenCalledTimes(1)
    expect(webRTCState.setVideoStarted).not.toHaveBeenCalledWith(true)
    expect(result.current.isThinking).toBe(false)
  })

  it("does not call speech synthesis and just resets thinking on a D-ID SessionError", async () => {
    vi.mocked(DAL.getChatReply).mockResolvedValue({ reply: "Hello there", language: "en-US" })
    vi.mocked(DAL.talkToStream).mockResolvedValue({
      ok: false,
      json: async () => ({ kind: "SessionError" }),
    } as Response)

    const { result } = renderHook(() => useBotService(true, "en-US"))

    await act(async () => {
      await result.current.askBot("what is this?")
    })

    expect(speakMock).not.toHaveBeenCalled()
    expect(result.current.isThinking).toBe(false)
  })

  it("is a no-op when not connected", async () => {
    webRTCState.isConnected = false
    const { result } = renderHook(() => useBotService(true, "en-US"))

    await act(async () => {
      await result.current.askBot("what is this?")
    })

    expect(DAL.getChatReply).not.toHaveBeenCalled()
  })
})
