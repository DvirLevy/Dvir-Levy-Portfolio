# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (mode=development, port 8080)
- `npm run build` — production build
- `npm run build:dev` — build with development mode env vars
- `npm run lint` — run ESLint over the repo
- `npm run format` — run Prettier (write mode)
- `npm run preview` — preview a production build locally
- `npm run docker` — run the already-built `portfolio-app` image on port 3000 (build it first: `docker build -t portfolio-app .`)

There is no test suite/runner configured in this repo (no `test` script, no test files). "Automated testing" referenced in the README is an external cloud-triggered E2E pipeline, not something run locally — see `PopupAutomationRunner.tsx` / `LambdaService.regressionTest`.

## Architecture

This is a Vite + React + TypeScript single-page portfolio site (shadcn-ui + Tailwind), deployed statically to Netlify (CI builds `dist/` on merge to `main`) and alternatively containerized via the included `Dockerfile` (multi-stage: Node build → nginx static serve, config in `nginx.conf`).

All backend functionality is external — there is no server code in this repo. The frontend talks to two separate backend surfaces, both behind Vite env vars (`VITE_*`, see `.env`/`.env.development`):

1. **AWS Lambda functions** (`src/utils/lambdaService.ts`, class `LambdaService`) — static API-Gateway-fronted Lambdas called directly from the browser with `x-api-key` headers:
   - `EmailServiceLambda` — sends "Get in touch" emails
   - `DataAnalytics` — fires analytics events (`AwsRouts.DOWNLOAD` / `AwsRouts.PORTFOLIO`)
   - `regressionTest` — triggers the cloud E2E regression suite for a given repo (used by `PopupAutomationRunner.tsx`)

2. **A custom backend at `VITE_BACKEND_URL`** (`src/utils/DAL.ts`, object `DAL`) — proxies the D-ID talking-avatar API and a RAG chat endpoint:
   - `createStream` / `submitIceCandidate` / `startStream` / `talkToStream` / `deleteStream` — D-ID WebRTC video avatar session lifecycle
   - `getChatReply` — hits `/api/rag/ask`, the LLM-backed Q&A endpoint behind the chatbot

### The avatar chatbot (`PortfolioBotWidget`)

The most architecturally involved piece of the app is the talking-avatar chat widget, split across `src/botService/`:

- `useWebRTC.ts` — owns the D-ID WebRTC session: creates the stream via `DAL`, negotiates the `RTCPeerConnection` (offer/answer/ICE), persists `streamId`/`sessionId` to `localStorage` for crash/refresh recovery, and tears the session down on close/unmount/`beforeunload`. Includes retry logic for 403 (session-pool-full) responses and cleanup of orphaned sessions from prior tabs.
- `useSpeechRecognition.ts` — browser speech-to-text input, feeds recognized text into `askBot`.
- `index.ts` (`useBotService`) — orchestrates the above: sends user questions to `DAL.getChatReply` (the RAG endpoint), then forwards the LLM's reply text to `DAL.talkToStream` so D-ID renders it as avatar speech, with a browser `SpeechSynthesisUtterance` fallback if D-ID fails. Manages subtitle timing and a manual timeout (`videoBuffer`) to hide the video once speech is expected to have finished, since D-ID doesn't push an explicit "done speaking" event.
- `PortfolioBotWidget.tsx` (in `src/components/`) is the UI shell: a `Dialog` with the avatar circle, language selector (English/Hebrew, with RTL handling), voice and text input, and status text reflecting connection/thinking/listening state.

Language handling is bilingual (en-US / he-IL) end-to-end: UI strings are inline-ternaried per language, voice IDs are chosen per language (`en-US-AndrewNeural` / `he-IL-AvriNeural`), and Hebrew text triggers RTL layout and a different marquee animation direction for the subtitle.

### Path aliases

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`). Always use the `@/` alias for imports outside the same directory, matching existing code.
