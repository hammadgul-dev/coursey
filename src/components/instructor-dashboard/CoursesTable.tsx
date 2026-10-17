"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion, AnimatePresence} from "framer-motion"
import {AlertCircle, Eye, Pencil, Search, SearchX, Send} from "lucide-react"
import {useRouter} from "next/navigation"

let statusMap: Record<string, {label: string; cls: string; dot: string}> = {
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
  "grid min-w-[760px] grid-cols-[minmax(0,1fr)_140px_90px_150px_112px] items-center gap-4"

export default function CoursesTable({courses}: {courses: any[]}) {
  let [list, setList] = useState(courses)
  let [tab, setTab] = useState("all")
  let [q, setQ] = useState("")
  let router = useRouter()

  useEffect(() => {
    setList(courses)
  }, [courses])

  let count = (key: string) =>
    key === "all"
      ? list.length
      : list.filter((course: any) => course.status === key).length

  let shown = list.filter(
    (course: any) =>
      (tab === "all" || course.status === tab) &&
      (course.title ?? "").toLowerCase().includes(q.trim().toLowerCase()),
  )

  let editCourse = (c: any) => {
    if (c?.status === "pending" || c?.status === "published") {
      toast.error("Only draft or rejected courses can be edited")
      return
    }
    router.push(`/instructor-dashboard/create-course?id=${c?.id}`)
  }

  let submit = (course: any) => {
    setList((previous: any[]) =>
      previous.map((item: any) =>
        item.id === course.id
          ? {
              ...item,
              status: "pending",
              updated: "Submitted just now",
              feedback: "",
            }
          : item,
      ),
    )

    toast.success(
      course.status === "rejected"
        ? "Course resubmitted for review"
        : "Course submitted for review",
    )
  }

  return (
    <motion.section
      id="my-courses"
      className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-60px"}}
      transition={{duration: 0.5}}
    >
      <div className="flex min-w-0 flex-col gap-4 p-3 sm:p-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
              My Courses
            </h2>

            <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {list.length} courses
            </span>
          </div>

          <div className="relative w-full sm:w-52 sm:shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search title..."
              aria-label="Search courses by title"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="mx-auto flex w-max min-w-full justify-between gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-zinc-800 dark:bg-zinc-950 sm:w-fit sm:min-w-0 sm:justify-center">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                  tab === item.key
                    ? "text-white"
                    : "text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                }`}
              >
                {tab === item.key && (
                  <motion.span
                    layoutId="instructor-tab"
                    className="absolute inset-0 rounded-md bg-indigo-600"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}

                <span className="relative z-10">
                  {item.label} ({count(item.key)})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-0 border-t border-gray-200 dark:border-zinc-800">
        <div className="w-full overflow-x-auto">
          <div
            className={`${cols} border-b border-gray-200 bg-indigo-50/60 px-5 py-3 text-xs font-semibold text-gray-600 dark:border-zinc-800 dark:bg-indigo-500/5 dark:text-gray-400`}
          >
            <span>Course Title & Details</span>
            <span>Status</span>
            <span>Students</span>
            <span>Last Updated</span>
            <span className="text-right">Actions</span>
          </div>

          {shown.length > 0 ? (
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((course: any) => {
                let status = statusMap[course.status] ?? statusMap.draft

                return (
                  <motion.div
                    key={course.id}
                    layout="position"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.98}}
                    transition={{duration: 0.25}}
                    className="min-w-0 border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    <div className={`${cols} px-5 py-4`}>
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-11 sm:w-11 ${
                            course.status === "rejected"
                              ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          }`}
                        >
                          {course.code}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {course.title}
                          </h3>

                          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="max-w-full break-words rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                              {course.category}
                            </span>

                            <span className="break-words">{course.meta}</span>
                          </p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </div>
                      <p className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {course.students}
                      </p>
                      <p className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {course.updated}
                      </p>
                      <div className="flex items-center justify-end gap-1.5">
                        {(course.status === "draft" ||
                          course.status === "rejected") && (
                          <button
                            type="button"
                            onClick={() => submit(course)}
                            aria-label="Submit for review"
                            title="Submit for review"
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => editCourse(course)}
                          aria-label="Edit course"
                          title="Edit"
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <Link
                          href={`/courses/${course.id}`}
                          aria-label="Preview course"
                          title="Preview"
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    {course.status === "rejected" && course.feedback && (
                      <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        transition={{duration: 0.3}}
                        className="hidden overflow-hidden md:block"
                      >
                        <div className="mx-3 mb-3 flex min-w-0 gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800 dark:bg-red-500/10 dark:text-red-300 sm:mx-5 sm:mb-4">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                          <p className="min-w-0 break-words">
                            <span className="font-semibold">
                              Rejection feedback from admin:{" "}
                            </span>
                            {course.feedback}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="flex min-w-[760px] flex-col items-center gap-2 px-4 py-12 text-center sm:py-14"
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
      </div>
    </motion.section>
  )
}
