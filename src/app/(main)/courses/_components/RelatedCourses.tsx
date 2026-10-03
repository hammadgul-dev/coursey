import Link from "next/link"
import {ArrowRight, BookOpen, Star} from "lucide-react"
import Reveal from "./Reveal"

export default function RelatedCourses({items}: any) {
  return (
    <section className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            You might also like
          </h2>
          <Link
            href="/courses"
            className="group hidden cursor-pointer items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 sm:flex"
          >
            Explore all
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c: any, i: number) => (
            <Reveal key={c.id} delay={i * 0.08} className="h-full">
              <Link
                href={`/courses/${c.id}`}
                className="group flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500"
              >
                <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                  <BookOpen
                    size={28}
                    className="text-indigo-600 transition-transform duration-300 group-hover:scale-110 dark:text-indigo-400"
                  />
                </div>
                <div className="mb-2 flex gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                    {c.category}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {c.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {c.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{c.author}</span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {c.rating ?? "4.8"}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
