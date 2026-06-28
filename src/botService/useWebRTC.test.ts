import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FakeRTCPeerConnection, stubMediaDevices } from "@/test/mocks/webrtc"
import { DAL } from "../utils/DAL"
import { useWebRTC } from "./useWebRTC"

vi.mock("../utils/DAL", () => ({
  DAL: {
    createStream: vi.fn(),
    submitIceCandidate: vi.fn(),
    startStream: vi.fn(),
    talkToStream: vi.fn(),
    deleteStream: vi.fn(),
  },
}))

const okCreateResponse = (overrides: Record<string, unknown> = {}) => ({
  ok: true,
  status: 200,
  json: async () => ({
    id: "stream-1",
    session_id: "session-1",
    offer: { type: "offer", sdp: "fake-offer-sdp" },
    ice_servers: [],
    ...overrides,
  }),
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
  localStorage.clear()
  FakeRTCPeerConnection.reset()
  vi.stubGlobal("RTCPeerConnection", FakeRTCPeerConnection)
  stubMediaDevices()
  localStorage.setItem("mic_permission_requested", "true")
  vi.mocked(DAL.deleteStream).mockResolvedValue(new Response(null, { status: 200 }))
  vi.mocked(DAL.startStream).mockResolvedValue({ ok: true })
})

describe("useWebRTC connect flow", () => {
  it("connects, persists ids to localStorage, and negotiates the peer connection", async () => {
    vi.mocked(DAL.createStream).mockResolvedValue(okCreateResponse())

    const { result } = renderHook(() => useWebRTC(true))

    await waitFor(() => expect(result.current.isConnected).toBe(true))

    expect(localStorage.getItem("did_stream_id")).toBe("stream-1")
    expect(localStorage.getItem("did_session_id")).toBe("session-1")
    expect(DAL.startStream).toHaveBeenCalledWith(
      "stream-1",
      { type: "answer", sdp: "fake-answer-sdp" },
      "session-1",
    )

    const pc = FakeRTCPeerConnection.instances[0]
    expect(pc.remoteDescription).toEqual({ type: "offer", sdp: "fake-offer-sdp" })
  })

  it("forwards ICE candidates for the active stream", async () => {
    vi.mocked(DAL.createStream).mockResolvedValue(okCreateResponse())
    vi.mocked(DAL.submitIceCandidate).mockResolvedValue({ ok: true })

    const { result } = renderHook(() => useWebRTC(true))
    await waitFor(() => expect(result.current.isConnected).toBe(true))

    const pc = FakeRTCPeerConnection.instances[0]
    act(() => {
      pc.dispatch("icecandidate", {
        candidate: { candidate: "candidate:1 1 UDP", sdpMid: "0", sdpMLineIndex: 0 },
      })
    })

    await waitFor(() =>
      expect(DAL.submitIceCandidate).toHaveBeenCalledWith("stream-1", {
        candidate: "candidate:1 1 UDP",
        sdpMid: "0",
        sdpMLineIndex: 0,
        session_id: "session-1",
      }),
    )
  })

  it("retries createStream once when the backend reports a 403 (session pool full)", async () => {
    vi.useFakeTimers()
    vi.mocked(DAL.createStream)
      .mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({}) })
      .mockResolvedValueOnce(okCreateResponse())

    const { result } = renderHook(() => useWebRTC(true))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })

    expect(result.current.isConnected).toBe(true)
    expect(DAL.createStream).toHaveBeenCalledTimes(2)
  })

  it("cleans up an orphaned session from a previous tab before connecting", async () => {
    localStorage.setItem("did_stream_id", "old-stream")
    localStorage.setItem("did_session_id", "old-session")
    vi.mocked(DAL.createStream).mockResolvedValue(okCreateResponse())

    const { result } = renderHook(() => useWebRTC(true))

    await waitFor(() => expect(result.current.isConnected).toBe(true), { timeout: 3000 })
    expect(DAL.deleteStream).toHaveBeenCalledWith("old-stream", "old-session")
  })
})

describe("useWebRTC teardown", () => {
  it("deletes the stream and clears localStorage when closed", async () => {
    vi.mocked(DAL.createStream).mockResolvedValue(okCreateResponse())

    const { result, rerender } = renderHook(({ isOpen }) => useWebRTC(isOpen), {
      initialProps: { isOpen: true },
    })
    await waitFor(() => expect(result.current.isConnected).toBe(true))

    rerender({ isOpen: false })

    await waitFor(() => expect(result.current.isConnected).toBe(false), { timeout: 3000 })
    expect(DAL.deleteStream).toHaveBeenCalledWith("stream-1", "session-1")
    expect(localStorage.getItem("did_stream_id")).toBeNull()
  })
})
