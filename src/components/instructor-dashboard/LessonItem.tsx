"use client"

import {useRef, useState} from "react"
import {useRouter} from "next/navigation"
import {motion, AnimatePresence} from "framer-motion"
import toast from "react-hot-toast"
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Italic,
  Link2,
  List,
  ListChecks,
  Loader2,
  X,
} from "lucide-react"
import {request} from "@/lib/request"
import CheckpointEditor from "@/components/instructor-dashboard/CheckpointEditor"
import AiButton from "@/components/instructor-dashboard/AiButton"

let iconBtn =
  "cursor-pointer rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-indigo-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"

let titleInput =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium outline-none transition-all placeholder:text-gray-400 hover:border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder:text-zinc-600 dark:hover:border-zinc-700"

let tools = [
  {key: "bold", icon: Bold, pre: "**", post: "**", ph: "bold text"},
  {key: "italic", icon: Italic, pre: "*", post: "*", ph: "italic text"},
  {key: "code", icon: Code2, pre: "`", post: "`", ph: "code"},
  {key: "link", icon: Link2, pre: "[", post: "](https://)", ph: "link text"},
  {key: "list", icon: List, pre: "\n- ", post: "", ph: "list item"},
]

export default function LessonItem({
  lesson,
  label,
  index,
  total,
  locked,
  onMove,
}: any) {
  let router = useRouter()
  let taRef = useRef<any>(null)
  let [open, setOpen] = useState(false)
  let [adding, setAdding] = useState(false)
  let [busy, setBusy] = useState("")
  let [suggestions, setSuggestions] = useState<any[]>([])
  let [title, setTitle] = useState(lesson?.title || "")
  let [minutes, setMinutes] = useState(String(lesson?.readMinutes || 1))
  let [content, setContent] = useState(lesson?.content || "")

  let dirty =
    title !== (lesson?.title || "") ||
    (Number(minutes) || 1) !== (lesson?.readMinutes || 1) ||
    content !== (lesson?.content || "")

  let disabled = !!busy || !!locked
  let checkpoints = lesson?.checkpoints || []

  let applyFormat = (tool: any) => {
    let ta = taRef.current
    if (!ta) return
    let start = ta.selectionStart || 0
    let end = ta.selectionEnd || 0
    let picked = ta.value.slice(start, end) || tool.ph
    let next =
      ta.value.slice(0, start) +
      tool.pre +
      picked +
      tool.post +
      ta.value.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(
        start + tool.pre.length,
        start + tool.pre.length + picked.length,
      )
    })
  }

  let save = async () => {
    if (disabled) return
    setBusy("save")
    let body = {
      title: title.trim(),
      content,
      readMinutes: Number(minutes) || 1,
    }
    let res = await request(
      `/api/instructor/lessons/${lesson?.id}`,
      "PATCH",
      body,
    )
    setBusy("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Lesson Saved")
    setTitle(body.title)
    setMinutes(String(body.readMinutes))
    router.refresh()
  }

  let remove = async () => {
    if (disabled) return
    if (!window.confirm("Delete This Lesson?")) return
    setBusy("delete")
    let res = await request(`/api/instructor/lessons/${lesson?.id}`, "DELETE")
    setBusy("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Lesson Deleted")
    router.refresh()
  }

  let suggest = async () => {
    if (disabled) return
    if (dirty) {
      toast.error("Save Lesson First")
      return
    }
    if ((lesson?.content || "").trim().length < 100) {
      toast.error("Add Lesson Content First")
      return
    }
    setBusy("ai")
    let res: any = await request(
      `/api/instructor/lessons/${lesson?.id}/ai/checkpoints`,
      "POST",
      {count: 3},
    )
    setBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    let list = res?.data?.checkpoints || []
    setSuggestions(
      list.map((c: any, i: number) => ({
        key: Date.now() + "-" + i,
        question: c?.question || "",
        answer: c?.answer || "",
      })),
    )
    toast.success("Suggestions Ready")
  }

  let draft = async () => {
    if (disabled) return
    if (title.trim() !== (lesson?.title || "").trim()) {
      toast.error("Save Lesson First")
      return
    }
    if (content.trim().length > 0) {
      if (!window.confirm("Replace Current Content With AI Draft?")) return
    }
    setBusy("draft")
    let res: any = await request(
      `/api/instructor/lessons/${lesson?.id}/ai/draft`,
      "POST",
      {},
    )
    setBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    let text = res?.data?.content || ""
    if (!text) {
      toast.error("Something Went Wrong")
      return
    }
    setContent(text)
    toast.success("Draft Ready, Review And Save")
  }

  let dropSuggestion = (key: string) => {
    setSuggestions((prev: any[]) => prev.filter((s: any) => s.key !== key))
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-indigo-500 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="w-9 shrink-0 text-xs font-medium text-gray-400 dark:text-zinc-500">
          {label}
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson title"
          maxLength={120}
          className={`${titleInput} flex-1 basis-40`}
        />
        {dirty && (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            Unsaved
          </span>
        )}
        <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          <input
            type="number"
            min={1}
            max={600}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value.slice(0, 3))}
            className="w-12 rounded-md border border-gray-200 bg-transparent px-1.5 py-0.5 text-center text-xs outline-none transition-all hover:border-indigo-500 focus:border-indigo-500 dark:border-zinc-700"
          />
          min
        </div>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            disabled={disabled || index === 0}
            onClick={() => onMove?.(index, -1)}
            className={iconBtn}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled || index === total - 1}
            onClick={() => onMove?.(index, 1)}
            className={iconBtn}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={remove}
            className={`${iconBtn} hover:!bg-rose-50 hover:!text-rose-500 dark:hover:!bg-rose-500/10`}
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={iconBtn}
          >
            <motion.span
              animate={{rotate: open ? 180 : 0}}
              transition={{duration: 0.2}}
              className="block"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.25, ease: "easeInOut"}}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-gray-200 p-3 dark:border-zinc-800">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  {tools.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => applyFormat(t)}
                      className={iconBtn}
                    >
                      <t.icon className="h-4 w-4" />
                    </button>
                  ))}
                  <span className="ml-auto text-xs tabular-nums text-gray-400 dark:text-zinc-500">
                    {content.length} chars
                  </span>
                </div>
                <textarea
                  ref={taRef}
                  value={content}
                  maxLength={50000}
                  onChange={(e) => setContent(e.target.value)}
                  rows={9}
                  placeholder="Write the lesson in markdown..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm outline-none transition-all placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"
                />
                <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={disabled || !dirty}
                    onClick={save}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy === "save" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {busy === "save" ? "Saving" : "Save Lesson"}
                  </button>
                  <AiButton
                    label="Write Draft With AI"
                    busyLabel="Writing"
                    busy={busy === "draft"}
                    disabled={disabled}
                    onClick={draft}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {checkpoints.map((c: any) => (
                  <CheckpointEditor
                    key={c?.id}
                    lessonId={lesson?.id}
                    checkpoint={c}
                  />
                ))}
                {suggestions.map((s: any) => (
                  <CheckpointEditor
                    key={s.key}
                    lessonId={lesson?.id}
                    checkpoint={{question: s.question, answer: s.answer}}
                    onClose={() => dropSuggestion(s.key)}
                  />
                ))}
                {adding && (
                  <CheckpointEditor
                    lessonId={lesson?.id}
                    onClose={() => setAdding(false)}
                  />
                )}
                {!adding && (
                  <div className="flex w-full flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setAdding(true)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400"
                    >
                      <ListChecks className="h-4 w-4" />
                      Add Checkpoint
                    </button>
                    <AiButton
                      label="Suggest Checkpoints"
                      busyLabel="Thinking"
                      busy={busy === "ai"}
                      disabled={disabled || checkpoints.length >= 10}
                      onClick={suggest}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}