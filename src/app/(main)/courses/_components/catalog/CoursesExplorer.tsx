"use client"
import {useEffect, useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import SearchBar from "./SearchBar"
import FilterSidebar from "./FilterSidebar"
import ActiveFilters from "./ActiveFilters"
import CourseGrid from "./CourseGrid"
import Pagination from "./Pagination"

let levelLabels: any = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

export default function CoursesExplorer({
  courses,
  total,
  page,
  totalPages,
  pageSize,
  categories,
  levels,
  initialQuery,
  cat,
  level,
}: any) {
  let router = useRouter()
  let searchParams = useSearchParams()
  let [query, setQuery] = useState<string>(initialQuery || "")
  let [view, setView] = useState("grid")

  let activeCats: string[] = cat ? [cat] : []
  let activeLevel: string = levelLabels[level] || "All Levels"

  let update = (changes: any) => {
    let p = new URLSearchParams(searchParams?.toString() || "")
    for (let key of Object.keys(changes)) {
      let value = changes[key]
      if (value) p.set(key, value)
      else p.delete(key)
    }
    let qs = p.toString()
    router.push(qs ? `/courses?${qs}` : "/courses", {scroll: false})
  }

  useEffect(() => {
    if (query.trim() === (initialQuery || "")) return
    let t = setTimeout(() => {
      update({q: query.trim(), page: ""})
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  let toggleCat = (label: string) => {
    if (label === "All Topics" || label === cat) {
      update({cat: "", page: ""})
      return
    }
    update({cat: label, page: ""})
  }

  let changeLevel = (label: string) => {
    let value = label === "All Levels" ? "" : label.toUpperCase()
    update({level: value, page: ""})
  }

  let clearAll = () => {
    update({cat: "", level: "", page: ""})
  }

  let changePage = (n: number) => {
    update({page: n > 1 ? String(n) : ""})
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={(v: string) => setQuery(v)}
        count={total}
      />

      <ActiveFilters
        activeCats={activeCats}
        activeLevel={activeLevel}
        toggleCat={toggleCat}
        setActiveLevel={changeLevel}
        clearAll={clearAll}
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <FilterSidebar
          categories={categories}
          levels={levels}
          activeCats={activeCats}
          activeLevel={activeLevel}
          toggleCat={toggleCat}
          setActiveLevel={changeLevel}
          onReset={clearAll}
        />

        <div>
          <CourseGrid courses={courses} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={changePage}
            totalItems={total}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  )
}
