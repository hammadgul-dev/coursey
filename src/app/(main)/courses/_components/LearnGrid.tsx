import {Check} from "lucide-react"
import Reveal from "./Reveal"
import {learn} from "../_data/courseDetail"

export default function LearnGrid() {
  return (
    <div>
      <Reveal>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          What you'll learn
        </h2>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {learn.map((l, i) => (
          <Reveal key={l.title} delay={i * 0.06}>
            <div className="group flex h-full cursor-default gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-300">
                <Check size={14} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {l.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {l.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
