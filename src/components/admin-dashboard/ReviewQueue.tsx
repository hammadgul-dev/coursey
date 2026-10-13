"use client"

import {useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  ListChecks,
  X,
} from "lucide-react"
import {adminPending} from "@/data/adminData"

let outlineBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-400"
let primaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
let dangerBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-50 active:scale-95 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
let dangerSolidBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95"

export default function ReviewQueue() {
  let [items, setItems] = useState(adminPending as any[])
  let [open, setOpen] = useState(null as any)
  let [rejecting, setRejecting] = useState(null as any)
  let [reason, setReason] = useState("")

  let approve = (id: any) => {
    setItems((p: any) => p.filter((c: any) => c.id !== id))
    toast.success("Course approved and published")
  }

  let toggleReject = (id: any) => {
    setRejecting(rejecting === id ? null : id)
    setReason("")
  }

  let confirmReject = (id: any) => {
    if (reason.trim().length < 10) {
      toast.error("Please write a rejection reason (at least 10 characters)")
      return
    }
    setItems((p: any) => p.filter((c: any) => c.id !== id))
    setRejecting(null)
    setReason("")
    toast.success("Course rejected and feedback sent to instructor")
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{opacity: 0, y: 12}}
        animate={{opacity: 1, y: 0}}
        className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900"
      >
        <CheckCircle2 size={28} className="text-emerald-500" />
        <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-zinc-50">
          All caught up
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          No courses are waiting for review.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="min-w-0 md:max-h-[720px] md:overflow-y-auto md:pr-1">
      <div className="grid gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((c: any) => {
            return (
              <motion.div
                key={c.id}
                layout
                initial={{opacity: 0, y: 16}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, x: 48, scale: 0.97}}
                transition={{duration: 0.3, ease: "easeOut"}}
                className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                        {c.title}
                      </h3>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                        {c.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                      {c.instructor} · Submitted {c.submitted}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    <Clock size={12} />
                    {c.duration}
                  </span>
                </div>

                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600 dark:text-zinc-300">
                  {c.summary}
                </p>

                <div className="mt-3 flex items-center gap-3 text-xs text-gray-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText size={12} />
                    {c.lessons} lessons
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 ${c.checkpoints === 0 ? "font-medium text-red-600 dark:text-red-400" : ""}`}
                  >
                    <ListChecks size={12} />
                    {c.checkpoints} checkpoints
                  </span>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-zinc-800">
                  <button
                    onClick={() => setOpen(open === c.id ? null : c.id)}
                    className={`${outlineBtn} w-full`}
                  >
                    Curriculum
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${open === c.id ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleReject(c.id)}
                    className={`${dangerBtn} w-full`}
                  >
                    <X size={14} />
                    Reject
                  </button>
                  <button
                    onClick={() => approve(c.id)}
                    className={`${primaryBtn} w-full`}
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {open === c.id && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.25, ease: "easeOut"}}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {c.curriculum.map((m: any, i: number) => (
                          <div
                            key={i}
                            className="rounded-lg border border-gray-200 p-2.5 dark:border-zinc-800"
                          >
                            <p className="text-xs font-semibold text-gray-900 dark:text-zinc-50">
                              {m.title}
                            </p>
                            <ul className="mt-1.5 space-y-1">
                              {m.lessons.map((l: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                  {l}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {rejecting === c.id && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.25, ease: "easeOut"}}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-lg border border-red-200 p-3 dark:border-red-500/30">
                        <label className="text-xs font-semibold text-red-600 dark:text-red-400">
                          Rejection reason (required)
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          maxLength={500}
                          rows={3}
                          placeholder="Tell the instructor what to fix before resubmitting"
                          className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-xs text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                        />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-gray-400">
                            {reason.length}/500
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleReject(c.id)}
                              className={`${outlineBtn} px-2.5 py-1.5 text-xs`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => confirmReject(c.id)}
                              className={`${dangerSolidBtn} px-2.5 py-1.5 text-xs`}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
