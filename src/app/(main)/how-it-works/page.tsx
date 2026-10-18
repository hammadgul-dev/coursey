"use client"

import {useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {ChevronDown} from "lucide-react"
import {tabs, steps, faqs} from "@/data/howData"

export default function HowItWorksTabs() {
  let [tab, setTab] = useState<string>("student")
  let [open, setOpen] = useState<number | null>(0)
  let list: any[] = steps?.[tab] || []

  return (
    <>
      <section className="pb-14 pt-4 sm:pb-20 sm:pt-8">
        <div className="mx-auto flex w-fit rounded-xl border border-gray-200 p-1 dark:border-zinc-800">
          {tabs.map((t: any) => (
            <button
              key={t?.id}
              onClick={() => setTab(t?.id)}
              className={`relative cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 active:scale-95 sm:px-6 ${
                tab === t?.id
                  ? "text-white"
                  : "text-gray-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              }`}
            >
              {tab === t?.id && (
                <motion.span
                  layoutId="how-pill"
                  className="absolute inset-0 rounded-lg bg-indigo-600"
                  transition={{type: "spring", stiffness: 400, damping: 32}}
                />
              )}
              <span className="relative">{t?.label}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-gray-200 p-6 sm:p-8 dark:border-zinc-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              transition={{duration: 0.25}}
            >
              {list.map((s: any, i: number) => (
                <motion.div
                  key={s?.title}
                  initial={{opacity: 0, x: -12}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: i * 0.08, duration: 0.3}}
                  className="group flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-sm font-bold text-indigo-600 transition-all duration-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:border-zinc-800 dark:text-indigo-400 dark:group-hover:text-white">
                      {i + 1}
                    </span>
                    {i < list.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-gray-200 dark:bg-zinc-800" />
                    )}
                  </div>
                  <div className={i < list.length - 1 ? "pb-8" : ""}>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                      {s?.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-zinc-400">
                      {s?.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20 dark:border-zinc-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Frequently asked questions
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
          {faqs.map((f: any, i: number) => {
            let isOpen = open === i
            return (
              <div
                key={f?.q}
                className={
                  i > 0 ? "border-t border-gray-200 dark:border-zinc-800" : ""
                }
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-50 sm:px-6 dark:text-white dark:hover:bg-zinc-900/40"
                >
                  {f?.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.25}}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-xs leading-relaxed text-gray-600 sm:px-6 sm:text-sm dark:text-zinc-400">
                        {f?.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
