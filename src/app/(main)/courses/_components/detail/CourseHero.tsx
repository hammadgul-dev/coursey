import Link from "next/link"
import {ArrowLeft, BookOpen, Star, Users} from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import EnrollButtons from "./EnrollButtons"

export default function CourseHero({course, lessons, enroll}: any) {
  let level = String(course?.level || "")
  let levelLabel = level
    ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
    : ""

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
            Back To Courses
          </Link>

          <div className="mb-4 flex flex-wrap gap-2">
            {course?.category && (
              <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                {course.category}
              </span>
            )}
            {levelLabel && (
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {levelLabel}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            {course?.title || ""}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {course?.description ||
              "A text-first course built for focused readers."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">
              {course?.instructor?.name || ""}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen
                size={15}
                className="text-indigo-600 dark:text-indigo-400"
              />
              {lessons || 0} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Users
                size={15}
                className="text-indigo-600 dark:text-indigo-400"
              />
              {course?.studentsCount || 0} enrolled
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              {course?.rating > 0 ? course.rating : "New"}
              {course?.reviewsCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({course.reviewsCount})
                </span>
              )}
            </span>
          </div>

          <div className="mt-8 lg:hidden">
            <EnrollButtons enroll={enroll} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
