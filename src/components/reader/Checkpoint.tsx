"use client"

import {useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {ChevronDown, Lightbulb} from "lucide-react"

export default function Checkpoint({q, a}: any) {
  let [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 transition-colors duration-300 hover:border-indigo-300 dark:border-gray-800 dark:hover:border-indigo-500/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-3 bg-indigo-50/60 px-4 py-3.5 text-left transition-colors hover:bg-indigo-50 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
      >
        <Lightbulb
          size={17}
          className="shrink-0 text-indigo-600 dark:text-indigo-400"
        />
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
          Checkpoint: {q}
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-indigo-600" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            className="overflow-hidden"
          >
            <p className="border-t border-gray-100 bg-white px-4 py-4 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
