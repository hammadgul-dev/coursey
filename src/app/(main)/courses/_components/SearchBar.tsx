"use client"
import {Search, Grid3x3, List} from "lucide-react"

export default function SearchBar({
  query,
  onChange,
  count,
  view,
  setView,
}: any) {
  return (
    <>
      <div className="relative mb-5 max-w-2xl">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(ev) => onChange(ev.target.value)}
          placeholder="Search courses, topics, or instructors…"
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-end gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Showing {count} text courses
          </span>
          <div className="flex rounded-lg border border-border p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 ${view === "grid" ? "bg-[#4F46E5] text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3x3 size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 ${view === "list" ? "bg-[#4F46E5] text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
