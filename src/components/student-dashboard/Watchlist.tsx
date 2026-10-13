"use client"

import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion, AnimatePresence} from "framer-motion"
import {ArrowRight, Bookmark, BookOpen} from "lucide-react"

export default function Watchlist({items}: any) {
  let [list, setList] = useState(items)

  let remove = (id: string) =>
    setList((p: any) => p.filter((i: any) => i.id !== id))

  let onRemove = (id: string) => {
    remove(id)
    toast.success("Removed from watchlist")
  }

  let onEnroll = (id: string) => {
    remove(id)
    toast.success("Enrolled successfully")
  }

  return (
    <motion.section
      id="watchlist"
      className="min-w-0 scroll-mt-24"
      initial={{opacity: 0, y: 16}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-60px"}}
      transition={{duration: 0.5}}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Watchlist ({list.length})
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Courses saved for future reading sessions
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
          Your Watchlist Is Empty
        </div>
      ) : (
        <motion.div
          layout
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((w: any) => (
              <motion.article
                key={w.id}
                layout
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.25}}
                className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between gap-2 rounded-lg bg-indigo-50 px-2 py-1.5 dark:bg-indigo-500/10">
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                    {w.tag}
                  </span>
                  <button
                    onClick={() => onRemove(w.id)}
                    className="cursor-pointer text-indigo-600 transition-transform hover:scale-110 dark:text-indigo-400"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </button>
                </div>

                <Link href={`/courses/${w.id}`} className="mt-3 cursor-pointer">
                  <h3 className="text-base font-semibold text-gray-900 transition-colors hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400">
                    {w.title}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {w.instructor}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {w.lessons} lessons
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] dark:bg-zinc-800">
                    {w.level}
                  </span>
                </div>

                <button
                  onClick={() => onEnroll(w.id)}
                  className="mt-3 cursor-pointer rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-800 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 dark:hover:text-indigo-400"
                >
                  Enroll Free
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  )
}
