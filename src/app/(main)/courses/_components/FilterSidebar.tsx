"use client"
import {Sparkles, Check} from "lucide-react"

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

export default function FilterSidebar({
  categories,
  levels,
  readingTimeOptions,
  features,
  activeCats,
  activeLevel,
  toggleCat,
  setActiveLevel,
}: any) {
  return (
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
        {categories.map((c: any) => (
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
        {levels.map((l: any) => (
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
        {readingTimeOptions.map((r: any) => (
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
        {features.map((f: string) => (
          <CheckBox key={f} label={f} checked={false} onChange={() => {}} />
        ))}
      </div>

      <div className="rounded-xl border border-[#4F46E5]/20 bg-[#4F46E5]/5 p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5]">
          <Sparkles size={14} /> Why Text-First?
        </p>
        <p className="text-xs leading-relaxed text-justify text-muted-foreground">
          Reading code documentation and technical prose is proven 3.5× faster
          than video lectures for retention and reference speed.
        </p>
      </div>
    </aside>
  )
}
