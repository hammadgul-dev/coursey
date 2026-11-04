import {BookOpen, EyeOff, ListChecks} from "lucide-react"
import Reveal from "@/components/ui/Reveal"

let highlights = [
  {
    title: "Text-First Lessons",
    desc: "Dense, well written lessons you can scan and revisit.",
    icon: BookOpen,
  },
  {
    title: "No Distractions",
    desc: "No video fluff, just focused reading at your own pace.",
    icon: EyeOff,
  },
  {
    title: "Checkpoints",
    desc: "Quick questions after lessons to test what you learned.",
    icon: ListChecks,
  },
]

export default function CourseAbout({course}: any) {
  return (
    <Reveal>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        About This Course
      </h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {course?.description ||
          "The instructor has not added a description yet."}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => {
          let Icon = h.icon
          return (
            <div
              key={h.title}
              className="group cursor-default rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-300">
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {h.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {h.desc}
              </p>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}
