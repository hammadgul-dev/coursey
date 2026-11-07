"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Sparkles,
  X,
} from "lucide-react"
import {request} from "@/lib/request"

let outlineBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-400"
let primaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
let dangerBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
let dangerSolidBtn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"

let fmt = (d: any) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default function ReviewQueue() {
  let router = useRouter()
  let [items, setItems] = useState([] as any[])
  let [loading, setLoading] = useState(true)
  let [open, setOpen] = useState(null as any)
  let [details, setDetails] = useState({} as any)
  let [detailBusy, setDetailBusy] = useState(null as any)
  let [openLesson, setOpenLesson] = useState(null as any)
  let [rejecting, setRejecting] = useState(null as any)
  let [reason, setReason] = useState("")
  let [busyId, setBusyId] = useState(null as any)

  useEffect(() => {
    let active = true
    let run = async () => {
      let res: any = await request(
        "/api/admin/courses?status=PENDING&limit=50",
        "GET",
      )
      if (!active) return
      if (res?.ok) {
        setItems(res?.data?.courses || [])
      } else {
        toast.error(res?.error || "Something Went Wrong")
      }
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
  }, [])

  let toggleOpen = async (id: string) => {
    if (open === id) {
      setOpen(null)
      return
    }
    setOpen(id)
    setOpenLesson(null)
    if (details[id]) return
    setDetailBusy(id)
    let res: any = await request(`/api/admin/courses/${id}`, "GET")
    setDetailBusy(null)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setDetails((p: any) => ({...p, [id]: res.data}))
  }

  let toggleReject = (id: string) => {
    setRejecting(rejecting === id ? null : id)
    setReason("")
  }

  let removeItem = (id: string) => {
    setItems((p: any) => p.filter((c: any) => c.id !== id))
    if (open === id) setOpen(null)
    if (rejecting === id) setRejecting(null)
  }

  let approve = async (id: string) => {
    setBusyId(id)
    let res: any = await request(`/api/admin/courses/${id}/publish`, "POST")
    setBusyId(null)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    removeItem(id)
    toast.success("Course Published")
    router.refresh()
  }

  let confirmReject = async (id: string) => {
    setBusyId(id)
    let res: any = await request(`/api/admin/courses/${id}/reject`, "POST", {
      reason: reason.trim(),
    })
    setBusyId(null)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    removeItem(id)
    setReason("")
    toast.success("Course Rejected")
    router.refresh()
  }

  if (loading) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-xs text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 sm:text-sm">
        Loading...
      </p>
    )
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
          All Caught Up
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          No courses are waiting for review.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="min-w-0 md:max-h-[720px] md:overflow-y-auto md:pr-1">
      <div className="grid items-start gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((c: any) => {
            let detail = details[c.id]
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
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                      {c.title || "Untitled"}
                    </h3>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {c.category || "General"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                    {c?.instructor?.name || "Unknown"} · Submitted{" "}
                    {fmt(c.submittedAt)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText size={12} />
                    {c.lessonsCount || 0} lessons
                  </span>
                  <span className="capitalize">
                    {(c.level || "").toLowerCase()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-400 dark:text-zinc-500">
                    <Sparkles size={12} />
                    AI Score: Coming Soon
                  </span>
                </div>

                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-zinc-800">
                  <button
                    onClick={() => toggleOpen(c.id)}
                    className={`${outlineBtn} w-full`}
                  >
                    {open === c.id ? "Hide Content" : "View Content"}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${open === c.id ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleReject(c.id)}
                    disabled={busyId === c.id}
                    className={`${dangerBtn} w-full`}
                  >
                    <X size={14} />
                    Reject
                  </button>
                  <button
                    onClick={() => approve(c.id)}
                    disabled={busyId === c.id}
                    className={`${primaryBtn} w-full`}
                  >
                    <Check size={14} />
                    {busyId === c.id && rejecting !== c.id
                      ? "Publishing..."
                      : "Approve"}
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
                        {detailBusy === c.id && (
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            Loading...
                          </p>
                        )}
                        {detail && (
                          <>
                            <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600 dark:text-zinc-300">
                              {detail.description || ""}
                            </p>
                            {(detail.learn || []).length > 0 && (
                              <ul className="space-y-1">
                                {(detail.learn || []).map(
                                  (l: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-xs text-gray-600 dark:text-zinc-400"
                                    >
                                      <Check
                                        size={12}
                                        className="mt-0.5 shrink-0 text-emerald-500"
                                      />
                                      {l}
                                    </li>
                                  ),
                                )}
                              </ul>
                            )}
                            {(detail.modules || []).map((m: any) => (
                              <div
                                key={m.id}
                                className="rounded-lg border border-gray-200 p-2.5 dark:border-zinc-800"
                              >
                                <p className="text-xs font-semibold text-gray-900 dark:text-zinc-50">
                                  {m.title}
                                </p>
                                <div className="mt-1.5 space-y-1">
                                  {(m.lessons || []).map((l: any) => (
                                    <div key={l.id}>
                                      <button
                                        onClick={() =>
                                          setOpenLesson(
                                            openLesson === l.id ? null : l.id,
                                          )
                                        }
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-left text-xs text-gray-600 transition-colors duration-200 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                                      >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                                        <span className="min-w-0 flex-1 truncate">
                                          {l.title}
                                        </span>
                                        <span className="shrink-0 text-[11px] text-gray-400">
                                          {(l.checkpoints || []).length} cp ·{" "}
                                          {l.readMinutes || 0} min
                                        </span>
                                      </button>
                                      {openLesson === l.id && (
                                        <div className="mt-1 rounded-md bg-gray-50 p-2 dark:bg-zinc-950">
                                          <p className="max-h-60 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-700 dark:text-zinc-300">
                                            {l.content || "No content"}
                                          </p>
                                          {(l.checkpoints || []).map(
                                            (k: any) => (
                                              <div
                                                key={k.id}
                                                className="mt-2 border-t border-gray-200 pt-2 text-xs dark:border-zinc-800"
                                              >
                                                <p className="font-medium text-gray-900 dark:text-zinc-50">
                                                  Q: {k.question}
                                                </p>
                                                <p className="mt-0.5 text-gray-600 dark:text-zinc-400">
                                                  A: {k.answer}
                                                </p>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
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
                          Rejection Reason (Required)
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
                              disabled={busyId === c.id}
                              className={`${dangerSolidBtn} px-2.5 py-1.5 text-xs`}
                            >
                              {busyId === c.id ? "Sending..." : "Send"}
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
