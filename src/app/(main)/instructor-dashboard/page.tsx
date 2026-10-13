import Link from "next/link"
import {BadgeCheck, ArrowRight, Plus} from "lucide-react"
import {
  instructor,
  sidebarLinks,
  stats,
  instructorCourses,
} from "@/data/instructorData"
import CoursesTable from "@/components/instructor-dashboard/CoursesTable"

export default function InstructorDashboardPage() {
  let delay = (n: number) => ({animationDelay: `${n * 90}ms`})

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="fade-up lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-col">
            {sidebarLinks.map((l: any) => {
              let Icon = l.icon
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`group flex shrink-0 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    l.active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="whitespace-nowrap">{l.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-8">
          <header
            className="fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            style={delay(1)}
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                Welcome back, {instructor.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Manage your courses, review submissions, and track student
                engagement.
              </p>
            </div>
            <Link
              href="#"
              className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              Create New Course
            </Link>
          </header>

          <section
            className="fade-up grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            style={delay(2)}
          >
            {stats.map((s: any) => {
              let Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
                      {s.note}
                    </span>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {s.label}
                  </p>
                </div>
              )
            })}
          </section>

          <div className="fade-up" style={delay(3)}>
            <CoursesTable courses={instructorCourses} />
          </div>

          <section
            className="fade-up flex flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10 sm:flex-row sm:items-center"
            style={delay(4)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Text-First Editorial Guidelines
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                Every course is reviewed before going live. Keep it video-free,
                use clear prose, runnable code snippets, and checkpoint quizzes.
              </p>
            </div>
            <Link
              href="#"
              className="group flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Read Handbook
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}
