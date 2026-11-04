import Link from "next/link"
import {redirect} from "next/navigation"
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  UserCog,
} from "lucide-react"
import {getSessionUser} from "@/lib/session"
import {getStudentDashboard} from "@/lib/student"
import MyCourses from "@/components/student-dashboard/MyCourses"
import Watchlist from "@/components/student-dashboard/Watchlist"

export default async function StudentDashboardPage() {
  let sessionUser: any = await getSessionUser()
  let userId: string | null = sessionUser?.id || null
  if (!userId) redirect("/login")

  let data: any = await getStudentDashboard(userId as string)
  if (!data) redirect("/login")
  if (data.role !== "STUDENT") redirect("/")

  let delay = (n: number) => ({animationDelay: `${n * 90}ms`})
  let streak = data.streak
  let streakPct = Math.min(
    100,
    Math.round((streak.weekCount / streak.goal) * 100),
  )
  let left = Math.max(0, streak.goal - streak.weekCount)
  let firstName = String(data.name || "").split(" ")[0] || "Student"
  let weekLetters = ["M", "T", "W", "T", "F", "S", "S"]

  let sidebarLinks = [
    {
      label: "Dashboard",
      href: "/student-dashboard",
      icon: LayoutDashboard,
      count: 0,
      active: true,
    },
    {
      label: "My Courses",
      href: "#my-courses",
      icon: BookOpen,
      count: data.courses.length,
      active: false,
    },
    {
      label: "Watchlist",
      href: "#watchlist",
      icon: Bookmark,
      count: data.watchlist.length,
      active: false,
    },
    {
      label: "Profile",
      href: "/profile?role=student",
      icon: UserCog,
      count: 0,
      active: false,
    },
  ]

  let stats = [
    {
      label: "Enrolled Courses",
      value: String(data.stats.enrolledCount),
      note: `${data.stats.activeCount} Active Now`,
      icon: GraduationCap,
      accent: false,
    },
    {
      label: "Completed",
      value: String(data.stats.completedCount),
      note: "Courses Finished",
      icon: CheckCircle2,
      accent: false,
    },
    {
      label: "Avg. Progress",
      value: `${data.stats.avgProgress}%`,
      note: "Across Enrolled Courses",
      icon: TrendingUp,
      accent: true,
    },
    {
      label: "Watchlist",
      value: String(data.stats.watchlistCount),
      note: "Saved For Later",
      icon: Bookmark,
      accent: false,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1200px] overflow-x-hidden px-4 py-6 sm:px-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="fade-up min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-col">
            {sidebarLinks.map((l: any) => {
              let Icon = l.icon
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    l.active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{l.label}</span>
                  {l.count ? (
                    <span className="ml-auto rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {l.count}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="hidden rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Reading Streak</span>
              <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                <Flame className="h-3.5 w-3.5" />
                {streak.days} Days
              </span>
            </div>
            <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {streak.weekCount} / {streak.goal} days
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {left > 0
                ? `${left} Day${left > 1 ? "s" : ""} To Meet Your Weekly Goal`
                : "Weekly Goal Met"}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
              <div
                className="bar-grow h-full rounded-full bg-indigo-600"
                style={{width: `${streakPct}%`}}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs">
              {weekLetters.map((d: string, i: number) => (
                <span
                  key={i}
                  className={
                    streak.week[i]
                      ? "font-semibold text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400"
                  }
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-10">
          <header
            className="fade-up flex flex-col gap-4 border-b border-gray-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between"
            style={delay(1)}
          >
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                Welcome Back, {firstName}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Continue Where You Left Off • {data.lessonsThisWeek} Lessons
                Completed This Week
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex w-fit cursor-pointer items-center gap-2 self-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 sm:self-auto dark:hover:text-indigo-400"
            >
              <Compass className="h-4 w-4" />
              Browse Courses
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
                  className="min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {s.label}
                    </p>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {s.value}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      s.accent
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {s.note}
                  </p>
                </div>
              )
            })}
          </section>

          {data.continueLearning.length > 0 && (
            <section className="fade-up min-w-0" style={delay(3)}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Continue Learning
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Pick Up Your Recent Reading Where You Stopped
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {data.continueLearning.map((c: any) => (
                  <article
                    key={c.id}
                    className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        {c.category || "Course"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {c.readLeft} Min Read Left
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Instructor: {c.instructor}
                    </p>

                    <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{c.progress}% Complete</span>
                      <span>
                        {c.done} Of {c.lessonsCount} Lessons
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
                      <div
                        className="bar-grow h-full rounded-full bg-indigo-600"
                        style={{width: `${c.progress}%`}}
                      />
                    </div>
                    <Link
                      href={
                        c.nextLessonId
                          ? `/courses/${c.id}/lessons/${c.nextLessonId}`
                          : `/courses/${c.id}`
                      }
                      className="group mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                    >
                      Continue Reading
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          <MyCourses courses={data.courses} />
          <Watchlist items={data.watchlist} />
        </main>
      </div>
    </div>
  )
}
