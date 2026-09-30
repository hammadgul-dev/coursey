"use client"
import {useState} from "react"
import Link from "next/link"
import {motion} from "framer-motion"
import {
  Search,
  Grid3x3,
  List,
  Star,
  BookOpen,
  Sparkles,
  RotateCcw,
  Check,
  X,
} from "lucide-react"

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

let courses = [
  {
    id: 1,
    tag: "TypeScript",
    color: "indigo",
    rating: 4.9,
    title: "Modern TypeScript & Systems Architecture",
    desc: "Master advanced utility types, nominal typing patterns, compiler internals…",
    author: "Sarah Jenkins",
    lessons: 24,
    level: "Intermediate",
  },
  {
    id: 2,
    tag: "Machine Learning",
    color: "purple",
    rating: 4.9,
    title: "Practical Large Language Models from Scratch",
    desc: "Tokenization, attention heads, backprop derivation, and fine-tuning…",
    author: "Dr. Alex Rivera",
    lessons: 18,
    level: "Advanced",
  },
  {
    id: 3,
    tag: "Data Systems",
    color: "green",
    rating: 5.0,
    title: "High-Performance SQL & Database Internals",
    desc: "B-Trees, WAL logs, MVCC isolation levels, index access paths, and…",
    author: "Marcus Chen",
    lessons: 20,
    level: "Advanced",
  },
  {
    id: 4,
    tag: "Product & UX",
    color: "amber",
    rating: 4.8,
    title: "Information Architecture & UI Micropcopy",
    desc: "Construct navigation hierarchies, error message conventions, and cognitive…",
    author: "Elena Rostova",
    lessons: 14,
    level: "Beginner",
  },
  {
    id: 5,
    tag: "Systems Architecture",
    color: "cyan",
    rating: 4.9,
    title: "Distributed Systems in Go",
    desc: "Build a fault-tolerant Raft consensus engine, peer discovery protocols, an…",
    author: "Kenji Sato",
    lessons: 22,
    level: "Intermediate",
  },
  {
    id: 6,
    tag: "Web Development",
    color: "rose",
    rating: 4.7,
    title: "CSS for Software Engineers",
    desc: "The rendering pipeline, stacking contexts, CSS cascade algorithms,…",
    author: "Maya Lin",
    lessons: 12,
    level: "Beginner",
  },
]

let categories = [
  {label: "All Topics", count: 450},
  {label: "Web Development", count: 124},
  {label: "Machine Learning & AI", count: 98},
  {label: "Data Systems", count: 64},
  {label: "Systems Architecture", count: 52},
  {label: "Product & UX", count: 46},
  {label: "Business & Leadership", count: 38},
]

let levels = [
  {label: "All Levels", count: 450},
  {label: "Beginner", count: 180},
  {label: "Intermediate", count: 195},
  {label: "Advanced", count: 75},
]

let readingTime = [
  {label: "< 2 hours", count: 94},
  {label: "2 – 5 hours", count: 248},
  {label: "5+ hours", count: 108},
]

let features = [
  "Interactive Code Snippets",
  "Practice Quizzes",
  "Verified Certificate",
]

function CheckBox({checked, onChange, label, count}: any) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1 text-sm">
      <span className="flex items-center gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={onChange}
          className={`flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all duration-200 active:scale-90 ${
            checked
              ? "border-[#4F46E5] bg-[#4F46E5]"
              : "border-border hover:border-[#4F46E5]/60"
          }`}
        >
          <Check
            size={11}
            strokeWidth={3}
            className={`text-white transition-all duration-200 ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          />
        </button>
        <span
          className={
            checked ? "font-medium text-foreground" : "text-muted-foreground"
          }
        >
          {label}
        </span>
      </span>
      {count != null && (
        <span className="text-xs text-muted-foreground/70">{count}</span>
      )}
    </label>
  )
}

function CourseCard({c, i}: any) {
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

export default function CoursesPage() {
  let [activeCats, setActiveCats] = useState(["Web Development"])
  let [activeLevel, setActiveLevel] = useState("Intermediate")
  let [view, setView] = useState("grid")

  let toggleCat = (label: string) => {
    if (label === "All Topics") return setActiveCats([])
    setActiveCats((prev: string[]) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <p className="mb-4 text-sm text-muted-foreground">
        Home <span className="mx-1">›</span> Catalog{" "}
        <span className="mx-1">›</span>{" "}
        <span className="text-foreground">All Tracks</span>
      </p>

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Browse Courses</h1>
        <p className="mb-5 max-w-2xl text-muted-foreground">
          Explore text-first courses written and verified by actual
          practitioners. Zero video fluff, distraction-free reading, and instant
          interactive code checkpoints.
        </p>

        <div className="relative mb-5 max-w-2xl">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            placeholder="Search courses, topics, or instructors…"
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"
          />
        </div>
      </motion.div>
      {(activeCats.length > 0 || activeLevel !== "All Levels") && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            ACTIVE:
          </span>
          {activeCats.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1.5 rounded-md bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5]"
            >
              {c}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => toggleCat(c)}
              />
            </span>
          ))}
          {activeLevel !== "All Levels" && (
            <span className="flex items-center gap-1.5 rounded-md bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5]">
              {activeLevel}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => setActiveLevel("All Levels")}
              />
            </span>
          )}
          <button
            onClick={() => {
              setActiveCats([])
              setActiveLevel("All Levels")
            }}
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline"
          >
            <RotateCcw size={11} /> Clear all filters
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Filter By</h4>
            <button className="cursor-pointer text-xs font-medium text-[#4F46E5] hover:underline">
              Reset
            </button>
          </div>

          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            CATEGORIES
          </p>
          <div className="mb-5">
            {categories.map((c) => (
              <CheckBox
                key={c.label}
                label={c.label}
                count={c.count}
                checked={
                  c.label === "All Topics"
                    ? activeCats.length === 0
                    : activeCats.includes(c.label)
                }
                onChange={() => toggleCat(c.label)}
              />
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            EXPERIENCE LEVEL
          </p>
          <div className="mb-5">
            {levels.map((l) => (
              <CheckBox
                key={l.label}
                label={l.label}
                count={l.count}
                checked={activeLevel === l.label}
                onChange={() => setActiveLevel(l.label)}
              />
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            ESTIMATED READING TIME
          </p>
          <div className="mb-5">
            {readingTime.map((r) => (
              <CheckBox
                key={r.label}
                label={r.label}
                count={r.count}
                checked={false}
                onChange={() => {}}
              />
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            COURSE FEATURES
          </p>
          <div className="mb-6">
            {features.map((f) => (
              <CheckBox key={f} label={f} checked={false} onChange={() => {}} />
            ))}
          </div>

          <div className="rounded-xl border border-[#4F46E5]/20 bg-[#4F46E5]/5 p-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5]">
              <Sparkles size={14} /> Why Text-First?
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Reading code documentation and technical prose is proven 3.5×
              faster than video lectures for retention and reference speed.
            </p>
          </div>
        </aside>

        <div>
          <div
            className={
              view === "grid"
                ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            {courses.map((c, i) => (
              <CourseCard key={c.id} c={c} i={i} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="h-10 cursor-pointer rounded-xl border border-border px-5 text-sm font-medium transition-all duration-200 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5">
              Load More Courses (Showing 6 of 24)
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Showing 1 – 6 of 24 curated courses
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
