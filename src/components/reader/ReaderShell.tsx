"use client"

import {createContext, useContext, useState} from "react"
import Link from "next/link"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react"
import {allLessons, doneInitial, modules} from "@/data/lessonData"
import ThemeToggle from "@/components/layout/ThemeToggle"

let Ctx = createContext<any>(null)

export function CompleteButton({lessonId}: any) {
  let {done, toggle} = useContext(Ctx)
  let isDone = done.includes(lessonId)

  return (
    <button
      onClick={() => toggle(lessonId)}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] sm:w-auto ${
        isDone
          ? "border border-indigo-300 bg-white text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/50 dark:bg-gray-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
      }`}
    >
      <CheckCircle2 size={16} />
      {isDone ? "Completed" : "Mark Lesson as Complete"}
    </button>
  )
}

export default function ReaderShell({
  courseId,
  courseTitle,
  lessonId,
  children,
}: any) {
  let [done, setDone] = useState<number[]>(doneInitial)
  let [open, setOpen] = useState(false)
  let pct = Math.round((done.length / allLessons.length) * 100)

  let toggle = (id: number) => {
    let has = done.includes(id)
    setDone(has ? done.filter((x) => x !== id) : [...done, id])
    toast.success(has ? "Marked as incomplete" : "Lesson completed")
  }

  let list = (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Course syllabus
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {courseTitle}
          </p>
          <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            {done.length}/{allLessons.length}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {modules.map((m, i) => (
          <div key={m.title} className="mb-4">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              0{i + 1} {m.title}
            </p>
            {m.lessons.map((l: any) => {
              let active = l.id === lessonId
              let isDone = done.includes(l.id)
              let row =
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-200"
              let icon = l.locked ? (
                <Lock size={14} className="shrink-0" />
              ) : isDone ? (
                <CheckCircle2
                  size={14}
                  className="shrink-0 text-indigo-600 dark:text-indigo-400"
                />
              ) : (
                <Circle
                  size={14}
                  className={`shrink-0 ${active ? "fill-indigo-600 text-indigo-600" : "text-gray-400"}`}
                />
              )
              let inner = (
                <>
                  {icon}
                  <span className="flex-1 truncate">
                    {l.id}. {l.t}
                  </span>
                  <span className="text-xs text-gray-400">{l.m}m</span>
                </>
              )

              if (l.locked)
                return (
                  <div
                    key={l.id}
                    className={`${row} cursor-not-allowed text-gray-400 dark:text-gray-600`}
                  >
                    {inner}
                  </div>
                )

              return (
                <Link
                  key={l.id}
                  href={`/courses/${courseId}/lessons/${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`${row} cursor-pointer ${
                    active
                      ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                  }`}
                >
                  {inner}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </div>
  )

  return (
    <Ctx.Provider value={{done, toggle}}>
      <div className="min-h-screen bg-white text-gray-800 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link
            href={`/courses/${courseId}`}
            className="group flex min-w-0 cursor-pointer items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
          >
            <ArrowLeft
              size={15}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span className="truncate">{courseTitle}</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-gray-500 dark:text-gray-400 sm:block">
              {pct}%
            </span>
            <ThemeToggle />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gray-200 dark:bg-gray-800">
            <motion.div
              className="h-full rounded-r-full bg-indigo-600"
              animate={{width: `${pct}%`}}
              transition={{duration: 0.6, ease: "easeOut"}}
            />
          </div>
        </header>

        <aside className="fixed bottom-0 left-0 top-14 z-20 hidden w-72 border-r border-gray-200 bg-gray-50/60 dark:border-gray-800 dark:bg-gray-900/40 lg:block">
          {list}
        </aside>

        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/40"
              />
              <motion.aside
                initial={{x: "-100%"}}
                animate={{x: 0}}
                exit={{x: "-100%"}}
                transition={{duration: 0.3, ease: "easeOut"}}
                className="absolute bottom-0 left-0 top-0 w-72 max-w-[85%] bg-white dark:bg-gray-950"
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 z-10 cursor-pointer rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
                {list}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <motion.main
          key={lessonId}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: "easeOut"}}
          className="px-4 py-8 sm:px-6 sm:py-12 lg:pl-72"
        >
          <div className="mx-auto max-w-[760px]">{children}</div>
        </motion.main>
      </div>
    </Ctx.Provider>
  )
}
