import Link from "next/link"
import {redirect} from "next/navigation"
import {Plus, Library, Users, Clock, Star} from "lucide-react"
import {sidebarLinks} from "@/data/instructorData"
import {getSessionUser} from "@/lib/session"
import {getInstructorDashboard} from "@/lib/instructor"
import CoursesTable from "@/components/instructor-dashboard/CoursesTable"

export default async function InstructorDashboardPage() {
  let sessionUser: any = await getSessionUser()
  let userId: string | null = sessionUser?.id || null
  if (!userId) redirect("/login")

  let data: any = await getInstructorDashboard(userId as string)
  if (!data) redirect("/")

  let delay = (n: number) => ({animationDelay: `${n * 90}ms`})

  let s = data.stats
  let avgValue = "—"
  if (s.avgRating > 0) avgValue = s.avgRating.toFixed(1)

  let stats = [
    {
      label: "Total Courses",
      value: String(s.total),
      note: `${s.published} Published`,
      icon: Library,
    },
    {
      label: "Total Students",
      value: String(s.totalStudents),
      note: "Published Courses",
      icon: Users,
    },
    {
      label: "Awaiting Review",
      value: String(s.pending),
      note: "Pending",
      icon: Clock,
    },
    {
      label: "Average Rating",
      value: avgValue,
      note: `${s.reviewsCount} Reviews`,
      icon: Star,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1200px] overflow-x-clip px-3 py-5 sm:px-6 sm:py-6 lg:py-10">
      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <aside className="fade-up min-w-0 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-col">
            {sidebarLinks.map((l: any) => {
              let Icon = l.icon

              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`group flex min-w-0 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                    l.active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="whitespace-nowrap">{l.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-6 sm:space-y-8">
          <header
            className="fade-up flex min-w-0 flex-col items-center gap-4 text-center sm:items-start sm:text-left lg:flex-row lg:justify-between"
            style={delay(1)}
          >
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                Welcome Back, {data.name}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Manage Your Courses, Review Submissions, And Track Student
                Engagement.
              </p>
            </div>

            <Link
              href="/instructor-dashboard/create-course"
              className="group inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-2 self-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800 sm:self-start lg:self-auto"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              Create New Course
            </Link>
          </header>

          <section
            className="fade-up grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            style={delay(2)}
          >
            {stats.map((st: any) => {
              let Icon = st.icon

              return (
                <div
                  key={st.label}
                  className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4"
                >
                  <div className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="max-w-[70%] break-words rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400 sm:px-2 sm:text-[11px]">
                      {st.note}
                    </span>
                  </div>

                  <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                    {st.value}
                  </p>

                  <p className="mt-0.5 break-words text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">
                    {st.label}
                  </p>
                </div>
              )
            })}
          </section>

          <div className="fade-up min-w-0" style={delay(3)}>
            <CoursesTable courses={data.courses || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
