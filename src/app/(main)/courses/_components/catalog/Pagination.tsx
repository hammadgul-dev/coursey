"use client"
import {ChevronLeft, ChevronRight} from "lucide-react"

export default function Pagination({
  page,
  totalPages,
  onChange,
  totalItems,
  pageSize,
}: any) {
  if (totalPages <= 1) return null

  let start = (page - 1) * pageSize + 1
  let end = Math.min(page * pageSize, totalItems)

  let pages = Array.from({length: totalPages}, (_, i) => i + 1)

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
              p === page
                ? "bg-[#4F46E5] text-white"
                : "border border-border hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {start} – {end} of {totalItems} curated courses
      </p>
    </div>
  )
}
