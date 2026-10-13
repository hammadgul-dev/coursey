import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  Users,
} from "lucide-react"
import ReviewQueue from "@/components/admin-dashboard/ReviewQueue"
import CoursesManager from "@/components/admin-dashboard/CoursesManager"
import UsersTable from "@/components/admin-dashboard/UsersTable"
import {adminPending, adminStats} from "@/data/adminData"

let nav = [
  {label: "Overview", href: "#overview", icon: LayoutDashboard},
  {label: "Pending Review", href: "#review", icon: ClipboardCheck},
  {label: "All Courses", href: "#courses", icon: BookOpen},
  {label: "Users", href: "#users", icon: Users},
]

export default function AdminPage() {
  let stats = [
    {
      label: "Total Users",
      value: adminStats.users.toLocaleString("en-US"),
      hint: "Students and instructors",
      icon: Users,
    },
    {
      label: "Total Courses",
      value: adminStats.courses,
      hint: "All statuses",
      icon: BookOpen,
    },
    {
      label: "Pending Review",
      value: adminPending.length,
      hint: "Awaiting your decision",
      icon: ClipboardCheck,
      accent: true,
    },
    {
      label: "Published",
      value: adminStats.published,
      hint: "Live on platform",
      icon: CheckCircle2,
    },
  ] as any[]

  return (
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="fade-up min-w-0 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-col lg:gap-1 lg:overflow-visible">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="flex shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 lg:border lg:border-transparent lg:text-sm"
              >
                <n.icon size={16} />
                {n.label}
                {n.href === "#review" && adminPending.length > 0 && (
                  <span className="ml-auto rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                    {adminPending.length}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-10 sm:space-y-12">
          <section id="overview" className="scroll-mt-24">
            <div className="fade-up">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-3xl">
                Admin Overview
              </h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                Review submissions and manage courses and users.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{animationDelay: `${i * 70}ms`}}
                  className="fade-up min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-3 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400 sm:text-[11px]">
                      {s.label}
                    </p>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${
                        s.accent
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      }`}
                    >
                      <s.icon size={14} />
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-zinc-50 sm:text-2xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-zinc-400 sm:text-xs">
                    {s.hint}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="review" className="min-w-0 scroll-mt-24">
            <div className="fade-up mb-3 sm:mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 sm:text-xl">
                Pending Review
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                Approve to publish, or reject with a reason the instructor will
                see.
              </p>
            </div>
            <ReviewQueue />
          </section>

          <section id="courses" className="min-w-0 scroll-mt-24">
            <div className="fade-up mb-3 sm:mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 sm:text-xl">
                All Courses
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                Published, rejected and removed courses.
              </p>
            </div>
            <CoursesManager />
          </section>

          <section id="users" className="min-w-0 scroll-mt-24">
            <div className="fade-up mb-3 sm:mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 sm:text-xl">
                Users
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                Ban or remove accounts when needed.
              </p>
            </div>
            <UsersTable />
          </section>
        </div>
      </div>
    </div>
  )
}
