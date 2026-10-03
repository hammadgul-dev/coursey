import Link from "next/link"
import {ArrowLeft, BookOpen, Star, Users} from "lucide-react"
import Reveal from "./Reveal"
import EnrollButtons from "./EnrollButtons"

export default function CourseHero({course, lessons}: any) {
  return (
    <section className="border-b border-gray-200 bg-indigo-50/60 dark:border-gray-800 dark:bg-indigo-950/20">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        <Reveal className="max-w-3xl lg:pr-8">
          <Link
            href="/courses"
            className="group mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to courses
          </Link>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {course.category ?? "Development"}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {course.level ?? "Beginner"}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            {course.description ??
              "A text-first deep dive built for focused readers. No video fluff, just high-density lessons with interactive checkpoints."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">
              {course.author ?? "Sarah Jenkins"}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen
                size={15}
                className="text-indigo-600 dark:text-indigo-400"
              />
              {lessons} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Users
                size={15}
                className="text-indigo-600 dark:text-indigo-400"
              />
              {course.students ?? "14,820"} enrolled
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              {course.rating ?? "4.9"}
            </span>
          </div>

          <div className="mt-8 lg:hidden">
            <EnrollButtons />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
