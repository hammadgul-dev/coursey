"use client"

import {useState} from "react"
import toast from "react-hot-toast"
import {X} from "lucide-react"
import {request} from "@/lib/request"
import AiButton from "@/components/instructor-dashboard/AiButton"

let scoreCls = (n: number) => {
  if (n >= 80) return "text-emerald-500"
  if (n >= 60) return "text-amber-500"
  return "text-rose-500"
}

function Block({title, items, dot}: any) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((x: string, i: number) => (
          <li key={i} className="flex gap-2 text-sm">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
            />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AiReview({courseId}: any) {
  let [busy, setBusy] = useState(false)
  let [review, setReview] = useState<any>(null)

  let run = async () => {
    if (busy || !courseId) return
    setBusy(true)
    let res: any = await request(
      `/api/instructor/courses/${courseId}/ai/review`,
      "POST",
    )
    setBusy(false)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    let data = res?.data?.review
    if (!data) {
      toast.error("Something Went Wrong")
      return
    }
    setReview(data)
    toast.success("Review Ready")
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">AI Review</h3>
        <AiButton
          label={review ? "Review Again" : "Run AI Review"}
          busyLabel="Reviewing"
          busy={busy}
          disabled={busy}
          onClick={run}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
        Advisory only. Reviews your saved draft, so save changes first.
      </p>

      {review && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-zinc-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-semibold tabular-nums ${scoreCls(review?.score || 0)}`}
              >
                {review?.score || 0}
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400">
                / 100
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReview(null)}
              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700 active:scale-95 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm">{review?.summary || ""}</p>
          <Block
            title="Strengths"
            items={review?.strengths || []}
            dot="bg-emerald-500"
          />
          <Block
            title="Issues"
            items={review?.issues || []}
            dot="bg-rose-500"
          />
          <Block
            title="Suggestions"
            items={review?.suggestions || []}
            dot="bg-indigo-500"
          />
        </div>
      )}
    </div>
  )
}
