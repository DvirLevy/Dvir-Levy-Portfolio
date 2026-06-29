# Welcome to my Portfolio project

## Project info

**URL**: https://Dvir-Levy.netlify.app

A personal portfolio site featuring a talking-avatar AI chatbot (powered by D-ID + a custom RAG backend) that answers questions about my work in English and Hebrew.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- AWS (EC2)
- WebRTC
- D-ID
- OpenAI
- RAG (Retrieval-Augmented Generation)

## Getting started

```sh
npm install
npm run dev      # starts the dev server on http://localhost:8080
```

Other scripts:

- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run test` — run the unit test suite (Vitest)
- `npm run preview` — preview a production build locally
- `npm run docker` — run the already-built `portfolio-app` Docker image on port 3000

See [CLAUDE.md](./CLAUDE.md) for a deeper architecture overview (backend surfaces, the avatar chatbot internals, path aliases).

## Testing

- **Unit tests** — Vitest + Testing Library cover the data layer (`DAL`, `LambdaService`) and the avatar chatbot hooks (`useWebRTC`, `useSpeechRecognition`, `useBotService`). Run with `npm run test`.
- **End-to-end** — a cloud-triggered, cross-browser (Chromium, Firefox, WebKit) regression suite, run on demand and reported back into the app (see `PopupAutomationRunner.tsx`).

## What Cloud technologies are used for this project?

- AWS Lambda, for sending the "Get in touch" emails and firing analytics events
- All assets are stored in AWS S3
- A custom backend proxies the D-ID talking-avatar API and a RAG chat endpoint

## CI/CD

- GitHub Actions runs the unit test suite and a production build on every pull request into `main` and on every push to `main` (see `.github/workflows/ci.yml`).
- The site is deployed on Netlify: once a pull request is approved and merged into `main`, an automated pipeline runs `npm run build` and deploys the output from the `dist` directory.
    