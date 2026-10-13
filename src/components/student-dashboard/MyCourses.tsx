"use client"

import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion, AnimatePresence} from "framer-motion"
import {Award, CheckCircle2, FileText} from "lucide-react"

export default function MyCourses({courses}: any) {
  let [tab, setTab] = useState("all")

  let tabs = [
    {key: "all", label: "All"},
    {key: "progress", label: "In Progress"},
    {key: "completed", label: "Completed"},
  ]

  let count = (k: string) =>
    k === "all"
      ? courses.length
      : courses.filter((c: any) => c.status === k).length
  let list =
    tab === "all" ? courses : courses.filter((c: any) => c.status === tab)

  return (
    <motion.section
      id="my-courses"
      className="min-w-0 scroll-mt-24"
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-60px"}}
      transition={{duration: 0.5}}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            My Courses
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Full curriculum catalog in your enrolled library
          </p>
        </div>
        <div className="flex w-full justify-between gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit sm:justify-center">
          {tabs.map((t: any) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === t.key
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 hover:text-indigo-600 dark:text-gray-400"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="my-courses-tab"
                  className="absolute inset-0 rounded-md border border-indigo-100 bg-white dark:border-indigo-500/20 dark:bg-indigo-500/10"
                  transition={{type: "spring", stiffness: 400, damping: 32}}
                />
              )}
              <span className="relative">
                {t.label} ({count(t.key)})
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-4 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((c: any) => (
            <motion.article
              key={c.id}
              layout
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96}}
              transition={{duration: 0.25}}
              className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-2">
                {c.status === "progress" ? (
                  <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    In Progress
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {c.status === "progress"
                    ? `${c.lessons} text lessons`
                    : `${c.lessons} lessons • Grade ${c.grade}%`}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {c.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {c.desc}
              </p>

              <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>
                  {c.progress}%{" "}
                  {c.status === "progress" ? "Complete" : "Completed"}
                </span>
                <span>
                  {c.status === "progress"
                    ? `${c.done}/${c.lessons} done`
                    : `Finished ${c.finished}`}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
                <motion.div
                  className="h-full rounded-full bg-indigo-600"
                  initial={{width: 0}}
                  animate={{width: `${c.progress}%`}}
                  transition={{duration: 0.8, ease: "easeOut"}}
                />
              </div>

              <div className="mt-4 flex gap-2">
                {c.status === "progress" ? (
                  <>
                    <Link
                      href={`/courses/${c.id}/lessons/${c.lessonId}`}
                      className="flex-1 cursor-pointer rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                    >
                      Resume Course
                    </Link>
                    <Link
                      href={`/courses/${c.id}`}
                      className="flex w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-800 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/courses/${c.id}/lessons/${c.lessonId}`}
                      className="flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-800 transition-colors hover:border-indigo-500 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                    >
                      Review Material
                    </Link>
                    <button
                      onClick={() =>
                        toast.success("Certificates Will Ve Available Soon")
                      }
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent bg-indigo-50 px-4 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400"
                    >
                      <Award className="h-4 w-4" />
                      Certificate
                    </button>
                  </>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  )
}
