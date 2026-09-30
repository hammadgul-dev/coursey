"use client"
import {Search} from "lucide-react"

export default function SearchBar({query, onChange}: any) {
  return (
    <>
      <div className="relative mb-12 max-w-2xl mx-auto w-full">
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
    </>
  )
}
