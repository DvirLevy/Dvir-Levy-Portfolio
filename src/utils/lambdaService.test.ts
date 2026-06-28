import { http, HttpResponse } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { server } from "@/test/mocks/server"
import { AwsRouts, LambdaService } from "./lambdaService"

const EMAIL_URL = "https://lambda.test/email"
const ANALYTICS_URL = "https://lambda.test/analytics"
const REGRESSION_URL = "https://lambda.test/regression"

beforeEach(() => {
  vi.stubEnv("VITE_EMAIL_SERVICE_LAMBDA", EMAIL_URL)
  vi.stubEnv("VITE_API_KEY_EMAIL_SERVICE", "email-key")
  vi.stubEnv("VITE_DATA_ANALYTICS_URL", ANALYTICS_URL)
  vi.stubEnv("VITE_API_KEY_ANALYTICS", "analytics-key")
  vi.stubEnv("VITE_AUTHOMATION_URL_TRIGER", REGRESSION_URL)
  vi.stubEnv("VITE_API_KEY_REGRESSION", "regression-key")
})

describe("LambdaService.EmailServiceLambda", () => {
  it("posts the form data with the email api key header", async () => {
    let requestBody: unknown
    let apiKeyHeader: string | null = null
    server.use(
      http.post(EMAIL_URL, async ({ request }) => {
        apiKeyHeader = request.headers.get("x-api-key")
        requestBody = await request.json()
        return HttpResponse.json({ sent: true })
      }),
    )

    const result = await LambdaService.EmailServiceLambda({ name: "Dvir" })

    expect(result).toEqual({ sent: true })
    expect(apiKeyHeader).toBe("email-key")
    expect(requestBody).toEqual({ name: "Dvir" })
  })

  it("throws when the lambda responds with an error status", async () => {
    server.use(http.post(EMAIL_URL, () => new HttpResponse(null, { status: 500 })))

    await expect(LambdaService.EmailServiceLambda({})).rejects.toThrow(
      "Lambda responded with an error",
    )
  })
})

describe("LambdaService.DataAnalytics", () => {
  it("posts to the route-specific analytics endpoint with the analytics api key", async () => {
    let apiKeyHeader: string | null = null
    server.use(
      http.post(`${ANALYTICS_URL}/${AwsRouts.PORTFOLIO}`, async ({ request }) => {
        apiKeyHeader = request.headers.get("x-api-key")
        return HttpResponse.json({ tracked: true })
      }),
    )

    const result = await LambdaService.DataAnalytics({ awsRoute: AwsRouts.PORTFOLIO })

    expect(result).toEqual({ tracked: true })
    expect(apiKeyHeader).toBe("analytics-key")
  })
})

describe("LambdaService.regressionTest", () => {
  it("sends only the repo when no email is provided", async () => {
    let requestBody: unknown
    server.use(
      http.post(REGRESSION_URL, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ triggered: true })
      }),
    )

    await LambdaService.regressionTest("dvir-portfolio")

    expect(requestBody).toEqual({ repo: "dvir-portfolio" })
  })

  it("includes the email when provided", async () => {
    let requestBody: unknown
    server.use(
      http.post(REGRESSION_URL, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ triggered: true })
      }),
    )

    await LambdaService.regressionTest("dvir-portfolio", "dvirlh1@gmail.com")

    expect(requestBody).toEqual({ repo: "dvir-portfolio", email: "dvirlh1@gmail.com" })
  })
})
