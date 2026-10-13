"use client"

import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion, AnimatePresence} from "framer-motion"
import {AlertCircle, Eye, Pencil, Search, SearchX, Send} from "lucide-react"

let statusMap: any = {
  published: {
    label: "Published",
    cls: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    dot: "bg-indigo-600",
  },
  pending: {
    label: "Pending Review",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-500",
  },
  draft: {
    label: "Draft",
    cls: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400",
    dot: "bg-gray-400",
  },
}

let tabs = [
  {key: "all", label: "All"},
  {key: "draft", label: "Draft"},
  {key: "pending", label: "Pending"},
  {key: "published", label: "Published"},
  {key: "rejected", label: "Rejected"},
]

let cols =
  "md:grid md:grid-cols-[minmax(0,1fr)_140px_90px_150px_112px] md:items-center md:gap-4"

export default function CoursesTable({courses}: any) {
  let [list, setList] = useState(courses)
  let [tab, setTab] = useState("all")
  let [q, setQ] = useState("")

  let count = (k: string) =>
    k === "all" ? list.length : list.filter((c: any) => c.status === k).length

  let shown = list.filter(
    (c: any) =>
      (tab === "all" || c.status === tab) &&
      c.title.toLowerCase().includes(q.trim().toLowerCase()),
  )

  let submit = (c: any) => {
    setList((p: any) =>
      p.map((i: any) =>
        i.id === c.id
          ? {
              ...i,
              status: "pending",
              updated: "Submitted just now",
              feedback: "",
            }
          : i,
      ),
    )
    toast.success(
      c.status === "rejected"
        ? "Course resubmitted for review"
        : "Course submitted for review",
    )
  }

  return (
    <motion.section
      id="my-courses"
      className="scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-60px"}}
      transition={{duration: 0.5}}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            My Courses
          </h2>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            {list.length} courses
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-zinc-800 dark:bg-zinc-950 sm:w-fit">
            {tabs.map((t: any) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t.key
                    ? "text-white"
                    : "text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                }`}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="instructor-tab"
                    className="absolute inset-0 rounded-md bg-indigo-600"
                    transition={{type: "spring", stiffness: 400, damping: 32}}
                  />
                )}
                <span className="relative">
                  {t.label} ({count(t.key)})
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e: any) => setQ(e.target.value)}
              placeholder="Search title..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div
        className={`hidden border-y border-gray-200 bg-indigo-50/60 px-5 py-3 text-xs font-semibold text-gray-600 dark:border-zinc-800 dark:bg-indigo-500/5 dark:text-gray-400 ${cols}`}
      >
        <span>Course Title & Details</span>
        <span>Status</span>
        <span>Students</span>
        <span>Last Updated</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 md:border-t-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((c: any) => {
            let st = statusMap[c.status]
            return (
              <motion.div
                key={c.id}
                layout="position"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.98}}
                transition={{duration: 0.25}}
                className="border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
              >
                <div
                  className={`flex flex-col gap-3 px-4 py-4 sm:px-5 ${cols}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        c.status === "rejected"
                          ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                          : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      }`}
                    >
                      {c.code}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {c.title}
                      </h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {c.category}
                        </span>
                        {c.meta}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {c.students}
                    {c.students !== "—" && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                        {" "}
                        students
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {c.updated}
                  </p>

                  <div className="flex gap-1.5 md:justify-end">
                    {(c.status === "draft" || c.status === "rejected") && (
                      <button
                        onClick={() => submit(c)}
                        aria-label="Submit for review"
                        title="Submit for review"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        toast("Course editor will be available soon")
                      }
                      aria-label="Edit course"
                      title="Edit"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/courses/${c.id}`}
                      aria-label="Preview course"
                      title="Preview"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {c.status === "rejected" && c.feedback && (
                  <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    transition={{duration: 0.3}}
                    className="overflow-hidden"
                  >
                    <div className="mx-4 mb-4 flex gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800 dark:bg-red-500/10 dark:text-red-300 sm:mx-5">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Rejection feedback from admin:{" "}
                        </span>
                        {c.feedback}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {shown.length === 0 && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="flex flex-col items-center gap-2 px-4 py-14 text-center"
          >
            <SearchX className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              No courses found
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Try a different filter or search term.
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
