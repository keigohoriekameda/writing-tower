import OpenAI from "openai"

/** Single attempt with a hard timeout: the student retries explicitly, so no hidden SDK retries multiply cost. */
export function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20_000, maxRetries: 0 })
}
