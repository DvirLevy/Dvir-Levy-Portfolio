import { http, HttpResponse } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { server } from "@/test/mocks/server"
import type { DAL as DALType } from "./DAL"

const BACKEND_URL = "https://backend.test"

// DAL.ts reads import.meta.env.VITE_BACKEND_URL into a module-level constant
// at import time, so the env var must be stubbed before each (re-)import.
let DAL: typeof DALType
beforeEach(async () => {
  vi.resetModules()
  vi.stubEnv("VITE_BACKEND_URL", BACKEND_URL)
  ;({ DAL } = await import("./DAL"))
})

describe("DAL.createStream", () => {
  it("posts to create-stream with the hardcoded source url", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/did/create-stream`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ id: "stream-1" })
      }),
    )

    const res = await DAL.createStream("https://ignored.example/whatever.png")

    expect(res.status).toBe(200)
    expect(requestBody).toEqual({
      source_url:
        "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/dvir.png",
    })
  })
})

describe("DAL.submitIceCandidate", () => {
  it("posts the candidate payload to the stream's ice endpoint", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/did/ice/:streamId`, async ({ request, params }) => {
        expect(params.streamId).toBe("stream-1")
        requestBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )

    const candidateData = {
      candidate: "candidate:1 1 UDP",
      sdpMid: "0",
      sdpMLineIndex: 0,
      session_id: "session-1",
    }
    const result = await DAL.submitIceCandidate("stream-1", candidateData)

    expect(result).toEqual({ ok: true })
    expect(requestBody).toEqual(candidateData)
  })
})

describe("DAL.startStream", () => {
  it("posts the answer and session id to the start-stream endpoint", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/did/start-stream/:streamId`, async ({ request, params }) => {
        expect(params.streamId).toBe("stream-1")
        requestBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )

    const answer = { type: "answer", sdp: "v=0..." } as RTCSessionDescriptionInit
    const result = await DAL.startStream("stream-1", answer, "session-1")

    expect(result).toEqual({ ok: true })
    expect(requestBody).toEqual({ answer, session_id: "session-1" })
  })
})

describe("DAL.talkToStream", () => {
  it("posts a Microsoft TTS script to the talk endpoint", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/did/talk/:streamId`, async ({ request, params }) => {
        expect(params.streamId).toBe("stream-1")
        requestBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )

    const res = await DAL.talkToStream(
      "stream-1",
      "session-1",
      "hello there",
      "en-US-AndrewNeural",
    )

    expect(res.status).toBe(200)
    expect(requestBody).toEqual({
      script: {
        type: "text",
        input: "hello there",
        provider: { type: "microsoft", voice_id: "en-US-AndrewNeural" },
      },
      session_id: "session-1",
    })
  })
})

describe("DAL.deleteStream", () => {
  it("sends a DELETE with the session id and keepalive", async () => {
    let requestBody: unknown
    server.use(
      http.delete(`${BACKEND_URL}/api/did/stream/:streamId`, async ({ request, params }) => {
        expect(params.streamId).toBe("stream-1")
        requestBody = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )

    const res = await DAL.deleteStream("stream-1", "session-1")

    expect(res.status).toBe(200)
    expect(requestBody).toEqual({ session_id: "session-1" })
  })
})

describe("DAL.getChatReply", () => {
  it("posts the question/language/flags to the RAG ask endpoint", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/rag/ask`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ answer: "hi" })
      }),
    )

    const result = await DAL.getChatReply("what is this site?", "en", true, false)

    expect(result).toEqual({ answer: "hi" })
    expect(requestBody).toEqual({
      question: "what is this site?",
      language: "en",
      onRender: true,
      isMessage: false,
    })
  })

  it("defaults onRender and isMessage to false when omitted", async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BACKEND_URL}/api/rag/ask`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ answer: "hi" })
      }),
    )

    await DAL.getChatReply("what is this site?", "he")

    expect(requestBody).toEqual({
      question: "what is this site?",
      language: "he",
      onRender: false,
      isMessage: false,
    })
  })
})
