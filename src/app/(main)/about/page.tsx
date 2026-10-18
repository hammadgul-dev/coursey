import Link from "next/link"
import {ArrowRight, Plus} from "lucide-react"
import {mission, beliefs, steps} from "@/data/aboutData"

export let metadata = {
  title: "About | Coursey",
  description: "Learning built for deep reading, not passive watching.",
}

export default function AboutPage() {
  let card =
    "group rounded-xl border border-gray-200 bg-white p-6 transition-colors duration-300 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500"

  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="flex flex-col items-center py-16 text-center sm:py-24">
        <span className="fade-up rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:border-zinc-800 dark:text-indigo-400">
          About Coursey
        </span>
        <h1
          className="fade-up mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white"
          style={{animationDelay: "80ms"}}
        >
          Learning built for deep reading, not passive watching.
        </h1>
        <div className="bar-grow mt-6 h-1 w-16 rounded-full bg-indigo-600" />
        <p
          className="fade-up mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mt-6 sm:text-base dark:text-zinc-400"
          style={{animationDelay: "160ms"}}
        >
          Coursey is a distraction-free, text-first learning platform for people
          who learn fastest through the written word.
        </p>
      </section>

      <section className="grid gap-8 border-t border-gray-200 py-14 sm:py-20 md:grid-cols-2 md:gap-16 dark:border-zinc-800">
        <div className="fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Why we built Coursey
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Our Mission
          </h2>
        </div>
        <div className="space-y-5 text-justify">
          {mission.map((p: string, i: number) => (
            <p
              key={i}
              className="fade-up text-base leading-relaxed text-gray-600 dark:text-zinc-400"
              style={{animationDelay: `${(i + 1) * 120}ms`}}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20 dark:border-zinc-800">
        <div className="fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            What we believe
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Principles behind Coursey
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {beliefs.map((b: any, i: number) => {
            let Icon = b?.icon
            return (
              <div
                key={b?.title}
                className="fade-up group rounded-xl border border-gray-200 bg-white p-3.5 transition-colors duration-300 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500 sm:p-4"
                style={{animationDelay: `${i * 100}ms`}}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-indigo-600 transition-all duration-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white sm:h-9 sm:w-9 dark:border-zinc-800 dark:text-indigo-400 dark:group-hover:text-white">
                    {Icon && (
                      <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {b?.title}
                  </h3>
                </div>
                <p className="mt-2 text-justify text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-zinc-400">
                  {b?.text}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-gray-200 py-14 sm:py-20 dark:border-zinc-800">
        <div className="fade-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Quality
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            How courses stay quality
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:text-base dark:text-zinc-400">
            A simple 3-step pipeline between instructors, admin and students.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {steps.map((s: any, i: number) => (
            <div
              key={s?.n}
              className="fade-up group rounded-xl border border-gray-200 bg-white p-3.5 transition-colors duration-300 hover:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500 sm:p-4"
              style={{animationDelay: `${i * 100}ms`}}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-xs font-bold text-gray-900 transition-colors duration-300 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white sm:px-2.5 sm:py-1 sm:text-sm dark:border-zinc-800 dark:text-white">
                  {s?.n}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs dark:text-zinc-500">
                  {s?.tag}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:mt-4 sm:text-base dark:text-white">
                {s?.title}
              </h3>
              <p className="mt-2 text-justify text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-zinc-400">
                {s?.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 py-12 sm:py-20 dark:border-zinc-800">
        <div className="fade-up mx-auto max-w-3xl rounded-xl border border-gray-200 bg-gray-50 px-5 py-10 text-center sm:px-6 sm:py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Start reading or share what you know.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs text-gray-600 sm:text-base dark:text-zinc-400">
            Learn from text-first courses, or turn your knowledge into one.
          </p>
          <div className="mt-6 flex items-center justify-center sm:mt-8">
            <Link
              href="/courses"
              className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 sm:w-auto sm:px-6 sm:py-3"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
