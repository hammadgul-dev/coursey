"use client"

import {useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {ChevronDown, Eye, FileText} from "lucide-react"

export default function Curriculum({modules}: any) {
  let [open, setOpen] = useState<number[]>([0])
  let allOpen = open.length === modules.length
  let n = 0

  let toggle = (i: number) =>
    setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i])
  let toggleAll = () =>
    setOpen(allOpen ? [] : modules.map((_: any, i: number) => i))

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {modules.length} modules •{" "}
          {modules.reduce((a: number, m: any) => a + m.lessons.length, 0)}{" "}
          lessons
        </p>
        <button
          onClick={toggleAll}
          className="cursor-pointer text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {allOpen ? "Collapse all" : "Expand all modules"}
        </button>
      </div>

      <div className="space-y-3">
        {modules.map((m: any, i: number) => {
          let isOpen = open.includes(i)
          return (
            <div
              key={m.title}
              className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                isOpen
                  ? "border-indigo-300 dark:border-indigo-500/50"
                  : "border-gray-200 hover:border-indigo-300 dark:border-gray-800 dark:hover:border-indigo-500/50"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 bg-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-indigo-50/60 dark:bg-gray-900 dark:hover:bg-indigo-500/10"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Module {i + 1}: {m.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {m.lessons.length} text lessons
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                    className="overflow-hidden"
                  >
                    {m.lessons.map((l: any) => {
                      n++
                      return (
                        <div
                          key={l.t}
                          className="flex cursor-pointer items-center gap-3 border-t border-gray-100 bg-white px-4 py-3 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                        >
                          <span className="w-5 text-xs text-gray-400">
                            {String(n).padStart(2, "0")}
                          </span>
                          <FileText
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                            {l.t}
                          </span>
                          {l.free && (
                            <span className="hidden items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 sm:flex">
                              <Eye size={11} /> Preview
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {l.m} min
                          </span>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
