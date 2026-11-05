"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"

let labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]

function Stars({value, size = "text-base"}: {value: number; size?: string}) {
  return (
    <span className={`${size} tracking-tight`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= Math.round(value)
              ? "text-amber-400"
              : "text-gray-300 dark:text-gray-700"
          }
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function ReviewsSection({
  courseId,
  canReview,
  data,
}: {
  courseId: string
  canReview: boolean
  data: any
}) {
  let router = useRouter()
  let [rating, setRating] = useState<number>(data?.mine?.rating || 0)
  let [hover, setHover] = useState<number>(0)
  let [comment, setComment] = useState<string>(data?.mine?.comment || "")
  let [busy, setBusy] = useState(false)
  let [saved, setSaved] = useState(false)
  let [list, setList] = useState<any[]>(data?.reviews || [])
  let [page, setPage] = useState(1)
  let [loadingMore, setLoadingMore] = useState(false)

  let total = data?.total || 0
  let counts: number[] = data?.counts || [0, 0, 0, 0, 0]
  let hasMine = !!data?.mine
  let hasMore = list.length < total
  let shown = hover || rating

  useEffect(() => {
    setList(data?.reviews || [])
    setPage(1)
  }, [data])

  let submit = async () => {
    if (rating < 1) {
      toast.error("Please Select A Rating")
      return
    }
    setBusy(true)
    try {
      let res = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({rating, comment}),
      })
      let json = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(json?.error || "Something Went Wrong")
        return
      }
      toast.success(hasMine ? "Review Updated" : "Review Submitted")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (e) {
      toast.error("Something Went Wrong")
    } finally {
      setBusy(false)
    }
  }

  let loadMore = async () => {
    setLoadingMore(true)
    try {
      let res = await fetch(`/api/courses/${courseId}/reviews?page=${page + 1}`)
      let json = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(json?.error || "Something Went Wrong")
        return
      }
      let incoming: any[] = json?.reviews || []
      setList((prev) => {
        let ids = new Set(prev.map((p: any) => p.id))
        return [...prev, ...incoming.filter((r: any) => !ids.has(r.id))]
      })
      setPage(page + 1)
    } catch (e) {
      toast.error("Something Went Wrong")
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div>
      <motion.h2
        initial={{opacity: 0, y: 12}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.4}}
        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
      >
        Student Reviews
      </motion.h2>

      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin: "-60px"}}
        transition={{duration: 0.5}}
        className="mb-8 grid gap-6 rounded-2xl border border-gray-200 p-6 dark:border-gray-800 sm:grid-cols-[160px_1fr]"
      >
        <div className="text-center">
          <motion.p
            initial={{scale: 0.6, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{type: "spring", stiffness: 200, damping: 14}}
            className="text-5xl font-bold text-gray-900 dark:text-white"
          >
            {total > 0 ? (data?.average || 0).toFixed(1) : "0.0"}
          </motion.p>
          <Stars value={data?.average || 0} size="text-lg" />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} {total === 1 ? "Review" : "Reviews"}
          </p>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((n, i) => {
            let c = counts[n - 1] || 0
            let pct = 0
            if (total > 0) pct = Math.round((c / total) * 100)
            return (
              <div key={n} className="flex items-center gap-3 text-sm">
                <span className="w-8 text-gray-600 dark:text-gray-300">
                  {n} ★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <motion.div
                    initial={{width: 0}}
                    whileInView={{width: `${pct}%`}}
                    viewport={{once: true}}
                    transition={{duration: 0.8, delay: 0.15 + i * 0.1}}
                    className="h-full rounded-full bg-amber-400"
                  />
                </div>
                <span className="w-8 text-right text-gray-500 dark:text-gray-400">
                  {c}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {canReview && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-60px"}}
          transition={{duration: 0.5}}
          className="mb-8 rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
        >
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            {hasMine ? "Update Your Review" : "Rate This Course"}
          </h3>
          <div
            className="mb-4 flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                type="button"
                whileHover={{scale: 1.25, rotate: -8}}
                whileTap={{scale: 0.85}}
                animate={{scale: n === rating ? [1, 1.35, 1] : 1}}
                transition={{duration: 0.3}}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                className={`cursor-pointer text-3xl ${
                  n <= shown
                    ? "text-amber-400"
                    : "text-gray-300 dark:text-gray-700"
                }`}
              >
                ★
              </motion.button>
            ))}
            <div className="ml-3 h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {shown > 0 && (
                  <motion.span
                    key={shown}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.15}}
                    className="block text-sm font-medium text-indigo-600 dark:text-indigo-400"
                  >
                    {labels[shown]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Share Your Experience (Optional)"
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none transition-shadow duration-200 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {comment.length}/1000
            </span>
            <button
              onClick={submit}
              disabled={busy}
              className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                saved ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={busy ? "busy" : saved ? "saved" : "idle"}
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.15}}
                  className="block"
                >
                  {busy
                    ? "Saving..."
                    : saved
                      ? "✓ Saved"
                      : hasMine
                        ? "Update Review"
                        : "Submit Review"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      )}

      {list.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No Reviews Yet
        </p>
      )}

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {list.map((r: any, i: number) => (
            <motion.div
              key={r.id}
              layout
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-40px"}}
              exit={{opacity: 0, scale: 0.95}}
              transition={{duration: 0.4, delay: (i % 5) * 0.06}}
              className="rounded-2xl border border-gray-200 p-5 transition-colors duration-200 hover:border-indigo-300 dark:border-gray-800 dark:hover:border-indigo-500/40"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {(r.name || "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {r.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} size="text-sm" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {r.comment && (
                <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {r.comment}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="cursor-pointer rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
          >
            {loadingMore ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  )
}
