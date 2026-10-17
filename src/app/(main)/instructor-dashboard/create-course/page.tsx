import {redirect} from "next/navigation"
import {AlertTriangle} from "lucide-react"
import {getEditorCourse} from "@/data/courseEditor"
import CourseEditor from "@/components/instructor-dashboard/CourseEditor"

let statusStyle: any = {
  draft:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  rejected:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
}

export default async function CreateCoursePage({searchParams}: any) {
  let params = (await searchParams) as any
  let id = params?.id || ""
  let course = getEditorCourse(id) as any

  if (course?.status === "pending" || course?.status === "published") {
    redirect("/instructor-dashboard")
  }

  let isEdit = !!course?.id

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {course?.status === "rejected" && course?.feedback && (
        <div
          className="fade-up mb-6 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10"
          style={{animationDelay: "0ms"}}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              Rejection feedback from admin
            </p>
            <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">
              {course?.feedback}
            </p>
          </div>
        </div>
      )}

      <div className="fade-up mb-6" style={{animationDelay: "80ms"}}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {isEdit ? "Edit Course" : "Create Course"}
          </h1>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle[course?.status] || statusStyle.draft}`}
          >
            {course?.status || "draft"}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          Craft text-first lessons. All courses are open and free.
        </p>
      </div>

      <div className="fade-up" style={{animationDelay: "160ms"}}>
        <CourseEditor course={course} />
      </div>
    </main>
  )
}
