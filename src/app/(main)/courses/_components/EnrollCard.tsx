"use client"

import toast from "react-hot-toast"
import {Check, Link2} from "lucide-react"
import EnrollButtons from "./EnrollButtons"

let includes = [
  "High-density text lessons",
  "Instant inline AI tutor",
  "Interactive code checkpoints",
  "Certificate of completion",
  "Lifetime access & updates",
]

export default function EnrollCard({lessons}: any) {
  let copy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied")
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/50">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">Free</p>
      <p className="mb-5 mt-1 text-xs text-gray-500 dark:text-gray-400">
        100% free forever, no credit card
      </p>
      <EnrollButtons stacked />
      <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        This course includes
      </p>
      <ul className="space-y-2.5">
        <li className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
          <Check size={15} className="text-indigo-600 dark:text-indigo-400" />
          {lessons} text lessons
        </li>
        {includes.map((x) => (
          <li
            key={x}
            className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300"
          >
            <Check size={15} className="text-indigo-600 dark:text-indigo-400" />
            {x}
          </li>
        ))}
      </ul>
      <div className="my-5 border-t border-gray-100 dark:border-gray-800" />
      <button
        onClick={copy}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 py-1 text-sm text-gray-600 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-[0.98] dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        <Link2 size={14} />
        Copy Link
      </button>
    </div>
  )
}
