const BACKEND_URL = "http://localhost:8000"
// const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
const HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
}
export const DAL = {
  createStream: async (sourceUrl: string) => {
    return await fetch(`${BACKEND_URL}/api/did/create-stream`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ source_url: sourceUrl }),
    })
  },

  submitIceCandidate: async (streamId: string, candidateData: any) => {
    const res = await fetch(`${BACKEND_URL}/api/did/ice/${streamId}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(candidateData),
    })
    return res.json()
  },

  startStream: async (
    streamId: string,
    answer: RTCSessionDescriptionInit,
    sessionId: string,
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/did/start-stream/${streamId}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ answer, session_id: sessionId }),
    })
    return res.json()
  },

  talkToStream: async (
    streamId: string,
    sessionId: string,
    scriptText: string,
    voiceId: string,
  ) => {
    const res = await fetch(`${BACKEND_URL}/api/did/talk/${streamId}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        script: {
          type: "text",
          input: scriptText,
          provider: { type: "microsoft", voice_id: voiceId },
        },
        session_id: sessionId,
      }),
    })
    return res
  },

  deleteStream: async (streamId: string, sessionId: string) => {
    const res = await fetch(`${BACKEND_URL}/api/did/stream/${streamId}`, {
      method: "DELETE",
      headers: HEADERS,
      body: JSON.stringify({ session_id: sessionId }),
      keepalive: true, // Crucial for reliable cleanup on beforeunload
    })
    return res // Some DELETE requests might not return JSON
  },

  getChatReply: async (message: string, language: string) => {
    const res = await fetch(`${BACKEND_URL}/api/rag/ask`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ question: message, language }),
    })
    return res.json()
  },
}
