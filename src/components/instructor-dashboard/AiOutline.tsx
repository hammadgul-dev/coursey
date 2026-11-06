import {Sparkles} from "lucide-react"

export default function AiOutline() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">2. AI Outline Assistant</h2>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Generate a course outline from your syllabus topic.
          </p>
        </div>
      </div>
    </section>
  )
}
