// const BACKEND_URL = "http://localhost:3000"
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`
const HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
}
export const DAL = {
  createStream: async (sourceUrl: string) => {
    sourceUrl = "https://dvir-portfolio-asset-s3.s3.eu-north-1.amazonaws.com/assets/projects/dvir.png"
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

  getChatReply: async (message: string, language: string, onRender: boolean = false) => {
    console.log(onRender)
    // if (message.toLowerCase() === "who are you?") {
    //   // setTimeout(() => {
    //   return {
    //     reply: `Hi, I’m Dvir’s AI assistant — his most advanced AI project:).
    //                 Dvir is a AI Software Engineer specializing in LLMs, Rag systems, and scalable AI architectures. He builds AI systems end-to-end — from retrieval pipelines and vector databases to backend services and cloud infrastructure.
    //                 Dvir designed and developed a full Rag-based system. look at me!
    //                 I’m powered by a vector database, running on AWS with EC2, Docker, Postgres, and N-ginx.
    //                 Dvir combines strong backend engineering with AI expertise to deliver scalable, production-ready solutions.
    //                 Ask me anything to explore what he can build.`,
    //     sources: [],
    //   }
    //   // }, 5000)
    // }
    // else {

    const res = await fetch(`${BACKEND_URL}/api/rag/ask`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ question: message, language, onRender }),
    })
    return res.json()
    // }
  },
}
