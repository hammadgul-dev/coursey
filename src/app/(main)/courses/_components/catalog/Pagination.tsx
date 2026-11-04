"use client"
import {ChevronLeft, ChevronRight} from "lucide-react"

export default function Pagination({
  page,
  totalPages,
  onChange,
  totalItems,
  pageSize,
}: any) {
  let total = totalPages || 0
  let current = page || 1
  if (total <= 1) return null

  let start = (current - 1) * pageSize + 1
  let end = Math.min(current * pageSize, totalItems || 0)

  let pages: (number | string)[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="flex h-9 w-6 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                p === current
                  ? "bg-[#4F46E5] text-white"
                  : "border border-border hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {start} – {end} of {totalItems} Courses
      </p>
    </div>
  )
}
