import "server-only"
import {AI_FEATURES, AI_TIMEOUT_MS} from "@/lib/aiLimits"
import {fail, serverError} from "@/lib/api"

let GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
let GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"

export class AiError extends Error {
  status: number
  constructor(message: string, status: number = 502) {
    super(message)
    this.status = status
    this.name = "AiError"
  }
}

export function aiErrorResponse(e: any) {
  if (e instanceof AiError) return fail(e.message, e.status)
  return serverError()
}

function getConfig(model: string) {
  let provider = process.env.AI_PROVIDER || "groq"
  if (provider === "gemini") {
    return {
      url: GEMINI_URL,
      key: process.env.GEMINI_API_KEY || "",
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      groq: false,
    }
  }
  return {url: GROQ_URL, key: process.env.GROQ_API_KEY || "", model, groq: true}
}

async function callAi(
  feature: string,
  messages: any[],
  stream: boolean,
  json: boolean,
) {
  let cfg = AI_FEATURES[feature]
  if (!cfg) throw new AiError("AI Service Unavailable", 500)
  let c = getConfig(cfg.model)
  if (!c.key) throw new AiError("AI Service Unavailable", 500)

  let body: any = {
    model: c.model,
    messages,
    temperature: cfg.temperature ?? 0.5,
    stream,
  }
  if (c.groq) {
    body.max_completion_tokens = cfg.maxTokens
    if (c.model.startsWith("openai/gpt-oss")) body.reasoning_effort = "low"
  } else {
    body.max_tokens = cfg.maxTokens
  }
  if (json) body.response_format = {type: "json_object"}

  let controller = new AbortController()
  let timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    let res = await fetch(c.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + c.key,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      let detail = await res.text().catch(() => "")
      console.error("AI Provider Error", res.status, detail.slice(0, 300))
      if (res.status === 429)
        throw new AiError("AI Service Busy, Try Again Later", 429)
      throw new AiError("AI Service Unavailable", 502)
    }

    if (stream) return res

    let data: any = await res.json()
    return data?.choices?.[0]?.message?.content || ""
  } catch (e: any) {
    if (e instanceof AiError) throw e
    if (e?.name === "AbortError") throw new AiError("AI Request Timed Out", 504)
    throw new AiError("AI Service Unavailable", 502)
  } finally {
    clearTimeout(timer)
  }
}

export async function aiText(feature: string, system: string, user: string) {
  let text: any = await callAi(
    feature,
    [
      {role: "system", content: system},
      {role: "user", content: user},
    ],
    false,
    false,
  )
  if (!text) throw new AiError("AI Response Invalid", 502)
  return String(text)
}

export async function aiJson(
  feature: string,
  system: string,
  user: string,
  schema: any,
) {
  for (let attempt = 0; attempt < 2; attempt++) {
    let text: any = await callAi(
      feature,
      [
        {role: "system", content: system},
        {role: "user", content: user},
      ],
      false,
      true,
    )
    let clean = String(text || "")
      .replace(/```json|```/g, "")
      .trim()
    try {
      let parsed = schema.safeParse(JSON.parse(clean))
      if (parsed.success) return parsed.data
    } catch {}
  }
  throw new AiError("AI Response Invalid", 502)
}

export async function aiStream(
  feature: string,
  system: string,
  messages: any[],
) {
  let res: any = await callAi(
    feature,
    [{role: "system", content: system}, ...messages],
    true,
    false,
  )
  let reader: any = res.body?.getReader()
  if (!reader) throw new AiError("AI Service Unavailable", 502)

  let decoder = new TextDecoder()
  let encoder = new TextEncoder()
  let buffer = ""

  return new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          let {done, value} = await reader.read()
          if (done) {
            controller.close()
            return
          }
          buffer += decoder.decode(value, {stream: true})
          let lines = buffer.split("\n")
          buffer = lines.pop() || ""
          let out = ""
          for (let line of lines) {
            let t = line.trim()
            if (!t.startsWith("data:")) continue
            let payload = t.slice(5).trim()
            if (payload === "[DONE]") continue
            try {
              let j: any = JSON.parse(payload)
              out += j?.choices?.[0]?.delta?.content || ""
            } catch {}
          }
          if (out) {
            controller.enqueue(encoder.encode(out))
            return
          }
        }
      } catch {
        controller.close()
      }
    },
    cancel() {
      reader.cancel()
    },
  })
}
