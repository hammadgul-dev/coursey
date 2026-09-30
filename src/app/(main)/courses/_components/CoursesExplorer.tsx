"use client"
import {useState, useMemo} from "react"
import SearchBar from "./SearchBar"
import FilterSidebar from "./FilterSidebar"
import ActiveFilters from "./ActiveFilters"
import CourseGrid from "./CourseGrid"
import Pagination from "./Pagination"
import type {Course} from "../_data/courses"

let PAGE_SIZE = 9

export default function CoursesExplorer({
  courses,
  categories,
  levels,
  readingTimeOptions,
  features,
}: any) {
  let [activeCats, setActiveCats] = useState<string[]>(["Web Development"])
  let [activeLevel, setActiveLevel] = useState("Intermediate")
  let [query, setQuery] = useState("")
  let [view, setView] = useState("grid")
  let [page, setPage] = useState(1)

  let toggleCat = (label: string) => {
    setPage(1)
    if (label === "All Topics") return setActiveCats([])
    setActiveCats((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    )
  }

  let changeLevel = (label: string) => {
    setPage(1)
    setActiveLevel(label)
  }

  let clearAll = () => {
    setActiveCats([])
    setActiveLevel("All Levels")
    setPage(1)
  }

  let filtered = useMemo(() => {
    return courses.filter((c: Course) => {
      let matchQuery =
        query.trim() === "" ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.author.toLowerCase().includes(query.toLowerCase())
      let matchLevel = activeLevel === "All Levels" || c.level === activeLevel
      return matchQuery && matchLevel
    })
  }, [courses, query, activeLevel])

  let totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  let paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <SearchBar
        query={query}
        onChange={(v: string) => {
          setQuery(v)
          setPage(1)
        }}
        count={filtered.length}
        view={view}
        setView={setView}
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
          readingTimeOptions={readingTimeOptions}
          features={features}
          activeCats={activeCats}
          activeLevel={activeLevel}
          toggleCat={toggleCat}
          setActiveLevel={changeLevel}
        />

        <div>
          <CourseGrid courses={paginated} view={view} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </>
  )
}
