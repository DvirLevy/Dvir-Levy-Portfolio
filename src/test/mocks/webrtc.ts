import { vi } from "vitest"

type Listener = (...args: unknown[]) => void

export class FakeRTCPeerConnection {
  static instances: FakeRTCPeerConnection[] = []

  connectionState: RTCPeerConnectionState = "new"
  localDescription: RTCSessionDescriptionInit | null = null
  remoteDescription: RTCSessionDescriptionInit | null = null
  private listeners: Record<string, Listener[]> = {}

  constructor(public config?: RTCConfiguration) {
    FakeRTCPeerConnection.instances.push(this)
  }

  addEventListener(event: string, cb: Listener) {
    ;(this.listeners[event] ??= []).push(cb)
  }

  removeEventListener() {}

  dispatch(event: string, payload?: unknown) {
    this.listeners[event]?.forEach((cb) => cb(payload))
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    this.remoteDescription = desc
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    return { type: "answer", sdp: "fake-answer-sdp" }
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit) {
    this.localDescription = desc
  }

  close() {
    this.connectionState = "closed"
  }

  static reset() {
    FakeRTCPeerConnection.instances = []
  }
}

export function stubMediaDevices(getUserMedia = vi.fn().mockResolvedValue({
  getTracks: () => [{ stop: vi.fn() }],
})) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  })
  return getUserMedia
}
