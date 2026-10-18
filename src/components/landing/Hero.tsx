"use client"

import Link from "next/link"
import {motion} from "framer-motion"
import {ArrowRight, CheckCircle2} from "lucide-react"

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-14">
      <div>
        <motion.h1
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, ease: "easeOut"}}
          className="mt-5 text-center text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-left sm:text-5xl dark:text-white"
        >
          <span className="text-indigo-600 dark:text-indigo-400">
            Learn Anything
          </span>
          , One Lesson at a Time
        </motion.h1>
        <motion.p
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.1, ease: "easeOut"}}
          className="mt-6 max-w-md text-justify text-sm leading-relaxed tracking-normal text-gray-600 sm:mt-7 sm:text-base dark:text-zinc-400"
        >
          Free, text-based courses built by instructors and powered by AI to
          help you learn faster without video timelines.
        </motion.p>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/courses"
            className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 sm:w-auto sm:text-sm"
          >
            Browse Courses
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-900 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 sm:w-auto sm:text-sm dark:border-zinc-800 dark:bg-transparent dark:text-white dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            Become an Instructor
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.7, delay: 0.15, ease: "easeOut"}}
        className="group rounded-xl border border-indigo-100 bg-indigo-50 p-3 transition-colors duration-300 hover:border-indigo-500 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500"
      >
        <div className="overflow-hidden rounded-lg bg-white dark:bg-zinc-900">
          <img
            src="/images/hero.jpg"
            alt="Learner reading a course on a laptop"
            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </motion.div>
    </section>
  )
}
