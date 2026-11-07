"use client"

import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {Eye, Search, Trash2} from "lucide-react"
import {request} from "@/lib/request"

let tabs = [
  {key: "", label: "All"},
  {key: "PUBLISHED", label: "Published"},
  {key: "REJECTED", label: "Rejected"},
  {key: "REMOVED", label: "Removed"},
]

let badge = {
  PUBLISHED:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  REJECTED: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  REMOVED: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400",
  PENDING:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  DRAFT:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
} as any

let cols = "md:grid-cols-[2.2fr_1.2fr_1fr_0.8fr_1fr_auto]"

let fmt = (d: any) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default function CoursesManager({counts}: {counts: any}) {
  let router = useRouter()
  let [courses, setCourses] = useState([] as any[])
  let [tab, setTab] = useState("")
  let [query, setQuery] = useState("")
  let [search, setSearch] = useState("")
  let [page, setPage] = useState(1)
  let [totalPages, setTotalPages] = useState(1)
  let [loading, setLoading] = useState(true)
  let [confirmId, setConfirmId] = useState(null as any)
  let [busyId, setBusyId] = useState(null as any)
  let reqId = useRef(0)

  let sig = JSON.stringify(counts || {})

  let total =
    (counts?.draft || 0) +
    (counts?.pending || 0) +
    (counts?.published || 0) +
    (counts?.rejected || 0) +
    (counts?.removed || 0)

  let count = (k: string) => {
    if (k === "") return total
    return counts?.[k.toLowerCase()] || 0
  }

  useEffect(() => {
    let t = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let id = ++reqId.current
    let run = async () => {
      setLoading(true)
      let url = `/api/admin/courses?page=${page}&limit=10`
      if (tab) url += `&status=${tab}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      let res: any = await request(url, "GET")
      if (id !== reqId.current) return
      if (res?.ok) {
        setCourses(res?.data?.courses || [])
        setTotalPages(res?.data?.totalPages || 1)
      } else {
        toast.error(res?.error || "Something Went Wrong")
      }
      setLoading(false)
    }
    run()
  }, [tab, search, page, sig])

  let changeTab = (k: string) => {
    setTab(k)
    setPage(1)
    setConfirmId(null)
  }

  let removeCourse = async (id: string) => {
    setBusyId(id)
    let res: any = await request(`/api/admin/courses/${id}/remove`, "POST")
    setBusyId(null)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setConfirmId(null)
    toast.success("Course Removed")
    router.refresh()
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={100}
            placeholder="Search by course or instructor"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              className={`relative shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
                tab === t.key
                  ? "text-white"
                  : "text-gray-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="courses-tab"
                  transition={{type: "spring", stiffness: 400, damping: 32}}
                  className="absolute inset-0 rounded-lg bg-indigo-600"
                />
              )}
              <span className="relative">
                {t.label} ({count(t.key)})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div
          className={`hidden gap-4 border-b border-gray-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-zinc-800 dark:text-zinc-400 md:grid ${cols}`}
        >
          <span>Course</span>
          <span>Instructor</span>
          <span>Status</span>
          <span>Students</span>
          <span>Published</span>
          <span className="w-16 text-right">Actions</span>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {courses.map((c: any) => (
            <motion.div
              key={c.id}
              layout
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, x: -24}}
              transition={{duration: 0.25, ease: "easeOut"}}
              className="border-b border-gray-100 transition-colors duration-200 last:border-b-0 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
            >
              <div
                className={`grid grid-cols-2 items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-5 sm:py-4 ${cols}`}
              >
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-50">
                    {c.title || "Untitled"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400 md:hidden">
                    {c?.instructor?.name || "Unknown"}
                  </p>
                  {c.status === "REJECTED" && c.rejectionReason && (
                    <p className="mt-1 line-clamp-2 text-xs text-red-600 dark:text-red-400">
                      {c.rejectionReason}
                    </p>
                  )}
                </div>
                <p className="hidden text-sm text-gray-600 dark:text-zinc-400 md:block">
                  {c?.instructor?.name || "Unknown"}
                </p>
                <div>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${badge[c.status] || ""}`}
                  >
                    {(c.status || "").toLowerCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-300">
                  {c.studentsCount
                    ? c.studentsCount.toLocaleString("en-US")
                    : "—"}
                  <span className="text-xs text-gray-400 md:hidden">
                    {" "}
                    students
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                  {fmt(c.publishedAt)}
                </p>
                <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1 md:w-16">
                  {c.status === "PUBLISHED" && (
                    <>
                      <Link
                        href={`/courses/${c.id}`}
                        aria-label="Preview Course"
                        className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() =>
                          setConfirmId(confirmId === c.id ? null : c.id)
                        }
                        aria-label="Remove Course"
                        className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {confirmId === c.id && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.2}}
                    className="overflow-hidden"
                  >
                    <div className="mx-3 mb-3 flex flex-col gap-3 rounded-lg border border-red-200 p-3 dark:border-red-500/30 sm:mx-5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-red-600 dark:text-red-400 sm:text-sm">
                        This course will be hidden from all students. Remove it?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 sm:flex-none sm:text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => removeCourse(c.id)}
                          disabled={busyId === c.id}
                          className="flex-1 cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:text-sm"
                        >
                          {busyId === c.id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && courses.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            Loading...
          </p>
        )}

        {!loading && courses.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            No Courses Found
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            Page {page} Of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
