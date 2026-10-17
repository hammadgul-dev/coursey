"use client"

import {useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import toast from "react-hot-toast"
import {Loader2, Sparkles} from "lucide-react"
import {dummyOutline} from "@/data/courseEditor"

export default function AiOutline({onApply}: any) {
  let [topic, setTopic] = useState("")
  let [loading, setLoading] = useState(false)
  let [result, setResult] = useState<any>(null)

  let suggest = () => {
    if ((topic?.trim()?.length || 0) < 5) {
      toast.error("Enter a topic of at least 5 characters")
      return
    }
    setResult(null)
    setLoading(true)
    setTimeout(() => {
      setResult(dummyOutline)
      setLoading(false)
    }, 1200)
  }

  let apply = () => {
    onApply?.(result || [])
    setResult(null)
    setTopic("")
    toast.success("Outline applied to curriculum")
  }

  let discard = () => {
    setResult(null)
    toast("Outline discarded")
  }

  let total = (result || []).reduce(
    (n: number, m: any) => n + (m?.lessons?.length || 0),
    0,
  )

  return (
    <motion.section
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: "easeOut", delay: 0.1}}
      className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">2. AI Outline Assistant</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Generate a text-first course outline from your syllabus topic.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && suggest()}
          placeholder="e.g. Advanced Type System and Raft Consensus"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"
        />
        <button
          type="button"
          disabled={loading}
          onClick={suggest}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Generating" : "Suggest outline"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {result && (
          <motion.div
            key="result"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Generated structure ({result.length} modules, {total} lessons)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={discard}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium transition-all hover:border-rose-500 hover:text-rose-600 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={apply}
                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
                  >
                    Apply outline
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {result.map((m: any, i: number) => (
                  <motion.div
                    key={m?.title}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.25, delay: i * 0.07}}
                    className="rounded-xl border border-gray-200 bg-white p-3.5 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        M{i + 1}: {m?.title}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400 dark:text-zinc-500">
                        {m?.lessons?.length || 0} lessons
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {(m?.lessons || []).map((l: string, j: number) => (
                        <li
                          key={l}
                          className="text-xs text-gray-500 dark:text-zinc-400"
                        >
                          {i + 1}.{j + 1} {l}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
