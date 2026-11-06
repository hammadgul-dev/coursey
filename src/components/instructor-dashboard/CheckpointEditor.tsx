"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import toast from "react-hot-toast"
import {ListChecks, Loader2} from "lucide-react"
import {request} from "@/lib/request"

let cpInput =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"

export default function CheckpointEditor({lessonId, checkpoint, onClose}: any) {
  let router = useRouter()
  let isNew = !checkpoint?.id
  let [question, setQuestion] = useState(checkpoint?.question || "")
  let [answer, setAnswer] = useState(checkpoint?.answer || "")
  let [busy, setBusy] = useState("")

  let dirty =
    isNew ||
    question !== (checkpoint?.question || "") ||
    answer !== (checkpoint?.answer || "")

  let save = async () => {
    if (busy) return
    setBusy("save")
    let body = {question: question.trim(), answer: answer.trim()}
    let res: any = null
    if (isNew) {
      res = await request(
        `/api/instructor/lessons/${lessonId}/checkpoints`,
        "POST",
        body,
      )
    }
    if (!isNew) {
      res = await request(
        `/api/instructor/checkpoints/${checkpoint?.id}`,
        "PATCH",
        body,
      )
    }
    setBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    if (isNew) {
      toast.success("Checkpoint Added")
      onClose?.()
    }
    if (!isNew) {
      toast.success("Checkpoint Saved")
      setQuestion(body.question)
      setAnswer(body.answer)
    }
    router.refresh()
  }

  let remove = async () => {
    if (busy) return
    if (isNew) {
      onClose?.()
      return
    }
    if (!window.confirm("Delete This Checkpoint?")) return
    setBusy("delete")
    let res = await request(
      `/api/instructor/checkpoints/${checkpoint?.id}`,
      "DELETE",
    )
    setBusy("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Checkpoint Deleted")
    router.refresh()
  }

  return (
    <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <ListChecks className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        {isNew ? "New Checkpoint" : "Checkpoint"}
      </p>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">
          Question
        </label>
        <input
          value={question}
          maxLength={500}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this lesson"
          className={cpInput}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">
          Answer
        </label>
        <textarea
          value={answer}
          maxLength={1000}
          rows={3}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Shown to the student when they reveal the answer"
          className={`${cpInput} resize-none`}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!!busy || !dirty}
          onClick={save}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "save" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isNew ? "Add Checkpoint" : "Save Checkpoint"}
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={remove}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:border-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400"
        >
          {busy === "delete" && (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          )}
          {isNew ? "Cancel" : "Delete"}
        </button>
      </div>
    </div>
  )
}
