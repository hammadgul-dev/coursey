export let MODEL_HEAVY = "openai/gpt-oss-120b"
export let MODEL_LIGHT = "openai/gpt-oss-20b"
export let AI_TIMEOUT_MS = 30000
export let WINDOW_SECONDS = 86400

export let GLOBAL_CAPS: any = {
  [MODEL_HEAVY]: 80,
  [MODEL_LIGHT]: 120,
}

export let AI_FEATURES: any = {
  description: {
    limit: 5,
    model: MODEL_LIGHT,
    maxTokens: 1200,
    temperature: 0.6,
  },
  learn: {limit: 5, model: MODEL_LIGHT, maxTokens: 2000, temperature: 0.6},
  outline: {limit: 3, model: MODEL_HEAVY, maxTokens: 4000, temperature: 0.5},
  draft: {limit: 10, model: MODEL_HEAVY, maxTokens: 3500, temperature: 0.6},
  checkpoints: {
    limit: 10,
    model: MODEL_LIGHT,
    maxTokens: 1500,
    temperature: 0.4,
  },
  review: {limit: 3, model: MODEL_HEAVY, maxTokens: 2000, temperature: 0.3},
  cover: {limit: 5, model: MODEL_LIGHT, maxTokens: 500, temperature: 0.4},
  score: {limit: 30, model: MODEL_HEAVY, maxTokens: 2000, temperature: 0.3},
  chat: {limit: 20, model: MODEL_LIGHT, maxTokens: 1500, temperature: 0.4},
  summary: {limit: 10, model: MODEL_LIGHT, maxTokens: 1500, temperature: 0.3},
  quiz: {limit: 10, model: MODEL_HEAVY, maxTokens: 3000, temperature: 0.4},
}
