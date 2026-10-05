"use client"

import {useState} from "react"
import toast from "react-hot-toast"
import {ArrowRight, Bookmark, Check} from "lucide-react"

export default function EnrollButtons({stacked = false}: any) {
  let [enrolled, setEnrolled] = useState(false)
  let [saved, setSaved] = useState(false)

  let enroll = () => {
    setEnrolled(true)
    toast.success("Enrolled successfully")
  }

  let save = () => {
    setSaved(!saved)
    toast.success(saved ? "Removed from watchlist" : "Added to watchlist")
  }

  return (
    <div
      className={`flex gap-3 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}
    >
      <button
        onClick={enroll}
        className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98] active:bg-indigo-800"
      >
        {enrolled ? <Check size={16} /> : null}
        {enrolled ? "Enrolled" : "Enroll Now, 100% Free"}
        {!enrolled && (
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </button>
      <button
        onClick={save}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800"
      >
        <Bookmark
          size={16}
          className={saved ? "fill-indigo-600 text-indigo-600" : ""}
        />
        {saved ? "Saved" : "Add to Watchlist"}
      </button>
    </div>
  )
}
