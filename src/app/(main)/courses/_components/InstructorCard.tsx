import Reveal from "./Reveal"
import {instructor as i} from "../_data/courseDetail"

export default function InstructorCard() {
  let initials = i.name
    .split(" ")
    .map((x) => x[0])
    .join("")

  return (
    <Reveal>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Your instructor
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {i.name}
            </p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              {i.role}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {i.bio}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>
            <b className="text-gray-900 dark:text-white">{i.courses}</b> Courses
          </span>
          <span>
            <b className="text-gray-900 dark:text-white">{i.students}</b>{" "}
            Students
          </span>
          <span>
            <b className="text-gray-900 dark:text-white">{i.rating}</b> Rating
          </span>
        </div>
      </div>
    </Reveal>
  )
}
