import {Redis} from "@upstash/redis"
import {AI_FEATURES, GLOBAL_CAPS, WINDOW_SECONDS} from "@/lib/aiLimits"

let redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

function waitText(seconds: number) {
  if (seconds >= 3600) {
    let hours = Math.ceil(seconds / 3600)
    if (hours === 1) return "1 Hour"
    return hours + " Hours"
  }
  let minutes = Math.max(1, Math.ceil(seconds / 60))
  if (minutes === 1) return "1 Minute"
  return minutes + " Minutes"
}

export async function checkAiLimit(feature: string, userId: string) {
  let cfg = AI_FEATURES[feature]
  if (!cfg || !userId)
    return {allowed: false, busy: false, message: "Invalid Request"}

  let key = "ai:" + feature + ":" + userId
  let count = await redis.incr(key)
  let ttl = await redis.ttl(key)
  if (ttl < 0) {
    await redis.expire(key, WINDOW_SECONDS)
    ttl = WINDOW_SECONDS
  }
  if (count > cfg.limit) {
    return {
      allowed: false,
      busy: false,
      message: "AI Limit Reached, Try Again In " + waitText(ttl),
    }
  }

  let day = new Date().toISOString().slice(0, 10)
  let globalKey = "ai:global:" + cfg.model + ":" + day
  let globalCount = await redis.incr(globalKey)
  if (globalCount === 1) await redis.expire(globalKey, 90000)
  if (globalCount > (GLOBAL_CAPS[cfg.model] || 0)) {
    await redis.decr(key)
    return {
      allowed: false,
      busy: true,
      message: "AI Service Busy, Try Again Later",
    }
  }

  return {allowed: true, busy: false, message: ""}
}
