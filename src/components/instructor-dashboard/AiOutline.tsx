"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import toast from "react-hot-toast"
import {ChevronDown, Loader2, Sparkles} from "lucide-react"
import {levels} from "@/lib/editorOptions"
import {request} from "@/lib/request"
import AiButton from "@/components/instructor-dashboard/AiButton"

let inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"

let labelCls = "mb-1.5 block text-sm font-medium"

export default function AiOutline({
  courseId,
  hasModules,
  defaultTopic,
  defaultLevel,
}: any) {
  let router = useRouter()
  let [topic, setTopic] = useState(defaultTopic || "")
  let [level, setLevel] = useState(defaultLevel || "BEGINNER")
  let [audience, setAudience] = useState("")
  let [busy, setBusy] = useState("")
  let [preview, setPreview] = useState<any[]>([])

  let generate = async () => {
    if (busy) return
    if (topic.trim().length < 3) {
      toast.error("Topic Must Be At Least 3 Characters")
      return
    }
    setBusy("generate")
    let res: any = await request(
      `/api/instructor/courses/${courseId}/ai/outline`,
      "POST",
      {topic: topic.trim(), level, audience: audience.trim()},
    )
    setBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    let list: any[] = res?.data?.modules || []
    if (list.length === 0) {
      toast.error("Something Went Wrong")
      return
    }
    setPreview(list)
    toast.success("Outline Ready, Review And Apply")
  }

  let apply = async () => {
    if (busy || preview.length === 0) return
    if (!window.confirm("Add This Outline To Your Course?")) return
    setBusy("apply")
    let res: any = await request(
      `/api/instructor/courses/${courseId}/ai/outline/apply`,
      "POST",
      {modules: preview},
    )
    setBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setPreview([])
    toast.success("Outline Applied")
    router.refresh()
  }

  let lessonCount = preview.reduce(
    (n: number, m: any) => n + (m?.lessons?.length || 0),
    0,
  )

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">2. AI Outline Assistant</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Generate modules and lesson starters from your topic.
          </p>
        </div>
      </div>

      {!courseId && (
        <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
          Save The Draft First To Use The Outline Assistant.
        </p>
      )}

      {!!courseId && hasModules && preview.length === 0 && (
        <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
          Outline Assistant Works Only When The Course Has No Modules.
        </p>
      )}

      {!!courseId && (!hasModules || preview.length > 0) && (
        <div className="mt-5 space-y-4">
          <div>
            <label className={labelCls}>Course Topic</label>
            <input
              value={topic}
              maxLength={120}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Modern TypeScript Architecture"
              className={inputCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Level</label>
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={`${inputCls} cursor-pointer appearance-none pr-10`}
                >
                  {levels.map((l: any) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Audience (Optional)</label>
              <input
                value={audience}
                maxLength={120}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Students With Basic JavaScript"
                className={inputCls}
              />
            </div>
          </div>

          <AiButton
            label={preview.length > 0 ? "Generate Again" : "Generate Outline"}
            busyLabel="Generating"
            busy={busy === "generate"}
            disabled={!!busy || hasModules}
            onClick={generate}
          />

          {preview.length > 0 && (
            <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Preview: {preview.length} Modules, {lessonCount} Lessons.
                Nothing is saved until you apply.
              </p>
              {preview.map((m: any, i: number) => (
                <div key={i}>
                  <p className="text-sm font-semibold">
                    Module {i + 1}: {m?.title}
                  </p>
                  <ul className="mt-1.5 space-y-1.5 border-l border-gray-200 pl-3 dark:border-zinc-800">
                    {(m?.lessons || []).map((l: any, k: number) => (
                      <li key={k}>
                        <p className="text-sm font-medium">
                          {i + 1}.{k + 1} {l?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          {l?.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={apply}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy === "apply" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {busy === "apply" ? "Applying" : "Apply Outline"}
                </button>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => setPreview([])}
                  className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:text-indigo-400"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
