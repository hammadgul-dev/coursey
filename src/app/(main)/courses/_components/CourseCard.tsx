import Link from "next/link"
import {motion} from "framer-motion"
import {Star, BookOpen} from "lucide-react"
import type {Course} from "../_data/courses"

let palette: any = {
  indigo:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/15",
  purple:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15",
  green:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15",
  amber:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/15",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15",
}

let levelCls: any = {
  Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

export default function CourseCard({c, i}: {c: Course; i: number}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3, delay: i * 0.04}}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-[#4F46E5]/50 hover:shadow-md hover:shadow-[#4F46E5]/5"
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 text-xs font-semibold ${palette[c.color]}`}
      >
        <span>{c.tag}</span>
        <span className="flex items-center gap-1">
          <Star size={12} className="fill-current" /> {c.rating}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 line-clamp-2 text-base font-semibold transition-colors duration-200 group-hover:text-[#4F46E5]">
          {c.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {c.desc}
        </p>
        <p className="mb-3 text-sm font-medium">{c.author}</p>
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen size={13} /> {c.lessons} lessons
          </span>
          <span
            className={`rounded-md px-2 py-0.5 font-medium ${levelCls[c.level]}`}
          >
            {c.level}
          </span>
        </div>
        <Link
          href={`/courses/${c.id}`}
          className="mt-auto flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md hover:shadow-[#4F46E5]/30"
        >
          Start Reading
        </Link>
      </div>
    </motion.div>
  )
}
