"use client"
import {RotateCcw, X} from "lucide-react"

export default function ActiveFilters({
  activeCats,
  activeLevel,
  toggleCat,
  setActiveLevel,
  clearAll,
}: any) {
  if (activeCats.length === 0 && activeLevel === "All Levels") return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
      <span className="text-xs font-medium text-muted-foreground">ACTIVE:</span>
      {activeCats.map((c: string) => (
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
        onClick={clearAll}
        className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline"
      >
        <RotateCcw size={11} /> Clear all filters
      </button>
    </div>
  )
}
