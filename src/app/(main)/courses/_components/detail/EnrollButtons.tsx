"use client"

import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {ArrowRight, BookOpen, Bookmark} from "lucide-react"
import {useRouter} from "next/navigation"

export default function EnrollButtons({stacked = false, enroll}: any) {
  let courseId = enroll?.courseId || ""
  let loggedIn = !!enroll?.loggedIn
  let role = enroll?.role || ""
  let nextLessonId = enroll?.nextLessonId || ""
  let [enrolled, setEnrolled] = useState(!!enroll?.isEnrolled)
  let [saved, setSaved] = useState(!!enroll?.saved)
  let [busy, setBusy] = useState(false)
  let router = useRouter()

  let isStudent = role === "STUDENT"
  let lessonHref = nextLessonId
    ? `/courses/${courseId}/lessons/${nextLessonId}`
    : ""

  let enrollNow = async () => {
    if (!loggedIn) {
      router.push("/login")
      return
    }
    if (busy) return
    setBusy(true)
    try {
      let res = await fetch("/api/student/enroll", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({courseId}),
      })
      let data = await res.json().catch(() => null)
      if (!res.ok && res.status !== 409) {
        toast.error(data?.error || "Something Went Wrong")
        return
      }
      setEnrolled(true)
      toast.success(
        res.status === 409 ? "Already Enrolled" : "Enrolled Successfully",
      )
      router.refresh()
      if (lessonHref) router.push(lessonHref)
    } catch {
      toast.error("Something Went Wrong")
    } finally {
      setBusy(false)
    }
  }

  let toggleSave = async () => {
    if (!loggedIn) {
      router.push("/login")
      return
    }
    if (busy) return
    setBusy(true)
    try {
      let res = await fetch("/api/student/watchlist", {
        method: saved ? "DELETE" : "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({courseId}),
      })
      let data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(data?.error || "Something Went Wrong")
        return
      }
      toast.success(saved ? "Removed From Watchlist" : "Added To Watchlist")
      setSaved(!saved)
    } catch {
      toast.error("Something Went Wrong")
    } finally {
      setBusy(false)
    }
  }

  let primaryClass =
    "group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98] active:bg-indigo-800"

  return (
    <div
      className={`flex gap-3 ${stacked ? "flex-col" : "flex-col sm:flex-row"}`}
    >
      {loggedIn && !isStudent ? (
        <button
          disabled
          className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        >
          Only Students Can Enroll
        </button>
      ) : enrolled ? (
        <Link href={lessonHref || "#"} className={primaryClass}>
          <BookOpen size={16} />
          Continue Reading
        </Link>
      ) : (
        <button onClick={enrollNow} disabled={busy} className={primaryClass}>
          {busy ? "Please Wait..." : "Enroll Now, 100% Free"}
          {!busy && (
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          )}
        </button>
      )}

      {(!loggedIn || isStudent) && !enrolled && (
        <button
          onClick={toggleSave}
          disabled={busy}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800"
        >
          <Bookmark
            size={16}
            className={saved ? "fill-indigo-600 text-indigo-600" : ""}
          />
          {saved ? "Saved" : "Add To Watchlist"}
        </button>
      )}
    </div>
  )
}
