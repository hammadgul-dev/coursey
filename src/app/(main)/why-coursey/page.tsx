import Link from "next/link"
import {ArrowRight, Check, X} from "lucide-react"
import {features, compare} from "@/data/whyData"

export const metadata = {
  title: "Why Coursey | Coursey",
  description: "The fastest way to learn a topic is still reading.",
}

export default function WhyCourseyPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="flex flex-col items-center py-16 text-center sm:py-24">
        <span className="fade-up rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:border-zinc-800 dark:text-indigo-400">
          Why Coursey
        </span>
        <h1
          className="fade-up mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white"
          style={{animationDelay: "80ms"}}
        >
          The fastest way to learn a topic is still reading.
        </h1>
        <div className="bar-grow mt-6 h-1 w-16 rounded-full bg-indigo-600" />
        <p
          className="fade-up mt-4 max-w-2xl text-xs leading-relaxed text-gray-600 sm:mt-6 sm:text-sm dark:text-zinc-400"
          style={{animationDelay: "160ms"}}
        >
          Video courses are hard to search and slow to revisit. Coursey gives
          you focused text lessons with checkpoints and AI help.
        </p>
        <Link
          href="/courses"
          className="group fade-up mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
          style={{animationDelay: "240ms"}}
        >
          Browse Courses
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </section>

      <section className="space-y-14 border-t border-gray-200 py-14 sm:space-y-20 sm:py-20 dark:border-zinc-800">
        {features.map((f: any, i: number) => (
          <div
            key={f?.title}
            className="fade-up grid items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            <div className={i % 2 ? "md:order-2" : ""}>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {f?.tag}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                {f?.title}
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-zinc-400">
                {f?.text}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(f?.points || []).map((p: string) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-indigo-500 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500">
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-500">
                {f?.mock?.label}
              </p>
              <p className="mt-2 text-xs font-semibold text-gray-900 sm:text-sm dark:text-white">
                {f?.mock?.title}
              </p>
              <div className="mt-4 space-y-2">
                {(f?.mock?.lines || []).map((l: string, j: number) => (
                  <div
                    key={j}
                    className={`rounded-lg border px-3 py-2 text-xs transition-colors duration-300 sm:text-sm ${
                      j === f?.mock?.hi
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "border-gray-200 text-gray-600 dark:border-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20 dark:border-zinc-800">
        <div className="fade-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Compare
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Text beats video for learning
          </h2>
        </div>
        <div className="fade-up mt-10 overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6 dark:bg-zinc-900/40 dark:text-zinc-500">
              <span></span>
              <span>Video-heavy</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                Coursey
              </span>
            </div>
            {compare.map((c: any) => (
              <div
                key={c?.label}
                className="grid grid-cols-3 gap-3 border-t border-gray-200 px-4 py-4 text-xs transition-colors duration-200 hover:bg-gray-50 sm:px-6 sm:text-sm dark:border-zinc-800 dark:hover:bg-zinc-900/40"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {c?.label}
                </span>
                <span className="flex gap-1.5 text-gray-500 dark:text-zinc-500">
                  <X className="mt-0.5 h-4 w-4 shrink-0" />
                  {c?.video}
                </span>
                <span className="flex gap-1.5 text-gray-900 dark:text-zinc-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {c?.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20 dark:border-zinc-800">
        <div className="fade-up mx-auto max-w-3xl rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center sm:py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Start learning with text-first courses.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs text-gray-600 sm:text-sm dark:text-zinc-400">
            Free for everyone. Create an account and begin in minutes.
          </p>
          <Link
            href="/signup"
            className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
          >
            Sign Up
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  )
}
