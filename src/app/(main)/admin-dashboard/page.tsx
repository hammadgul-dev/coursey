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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
        <aside className="fade-up lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="flex shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 lg:border-transparent"
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

        <div className="min-w-0 space-y-12">
          <section id="overview" className="scroll-mt-24">
            <div className="fade-up">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-3xl">
                Admin Overview
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                Review submissions and manage courses and users.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{animationDelay: `${i * 70}ms`}}
                  className="fade-up cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-200 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      {s.label}
                    </p>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        s.accent
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                      }`}
                    >
                      <s.icon size={16} />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-zinc-50">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                    {s.hint}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="review" className="scroll-mt-24">
            <div className="fade-up mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50">
                Pending Review
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                Approve to publish, or reject with a reason the instructor will
                see.
              </p>
            </div>
            <ReviewQueue />
          </section>

          <section id="courses" className="scroll-mt-24">
            <div className="fade-up mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50">
                All Courses
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                Published, rejected and removed courses.
              </p>
            </div>
            <CoursesManager />
          </section>

          <section id="users" className="scroll-mt-24">
            <div className="fade-up mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50">
                Users
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
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
