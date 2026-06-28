import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useSpeechRecognition } from "./useSpeechRecognition"

class FakeSpeechRecognition {
  static instances: FakeSpeechRecognition[] = []
  lang = ""
  continuous = false
  interimResults = false
  onstart: (() => void) | null = null
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null = null
  onerror: (() => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn(() => this.onstart?.())
  stop = vi.fn(() => this.onend?.())

  constructor() {
    FakeSpeechRecognition.instances.push(this)
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  FakeSpeechRecognition.instances = []
  vi.stubGlobal("SpeechRecognition", FakeSpeechRecognition)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("useSpeechRecognition", () => {
  it("alerts and does not start when the browser has no SpeechRecognition support", () => {
    vi.unstubAllGlobals()
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {})
    const onTranscriptComplete = vi.fn()

    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete))
    act(() => result.current.startListening())

    expect(alertSpy).toHaveBeenCalledWith(
      "Speech Recognition is not supported in this browser.",
    )
    expect(result.current.isListening).toBe(false)
  })

  it("starts listening, forwards the final transcript on end, and clears it after", () => {
    const onTranscriptComplete = vi.fn()
    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete, "he-IL"))

    act(() => result.current.startListening())

    const recognition = FakeSpeechRecognition.instances[0]
    expect(recognition.lang).toBe("he-IL")
    expect(result.current.isListening).toBe(true)

    act(() => {
      recognition.onresult?.({ results: [{ 0: { transcript: "hello " } }, { 0: { transcript: "world" } }] })
    })

    act(() => recognition.onend?.())

    expect(onTranscriptComplete).toHaveBeenCalledWith("hello world")
    expect(result.current.isListening).toBe(false)
  })

  it("does not forward an empty transcript on end", () => {
    const onTranscriptComplete = vi.fn()
    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete))

    act(() => result.current.startListening())
    const recognition = FakeSpeechRecognition.instances[0]
    act(() => recognition.onend?.())

    expect(onTranscriptComplete).not.toHaveBeenCalled()
  })

  it("auto-stops after 5s of silence following start", () => {
    const onTranscriptComplete = vi.fn()
    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete))

    act(() => result.current.startListening())
    const recognition = FakeSpeechRecognition.instances[0]

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(recognition.stop).toHaveBeenCalled()
  })

  it("stops listening on recognition error", () => {
    const onTranscriptComplete = vi.fn()
    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete))

    act(() => result.current.startListening())
    const recognition = FakeSpeechRecognition.instances[0]

    act(() => recognition.onerror?.())

    expect(recognition.stop).toHaveBeenCalled()
  })

  it("toggleListening starts when idle and stops when listening", () => {
    const onTranscriptComplete = vi.fn()
    const { result } = renderHook(() => useSpeechRecognition(onTranscriptComplete))

    act(() => result.current.toggleListening())
    expect(result.current.isListening).toBe(true)

    const recognition = FakeSpeechRecognition.instances[0]
    act(() => result.current.toggleListening())

    expect(recognition.stop).toHaveBeenCalled()
  })
})
