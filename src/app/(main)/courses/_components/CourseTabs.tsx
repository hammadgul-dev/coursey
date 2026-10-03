"use client"

import {useEffect, useState} from "react"
import {motion} from "framer-motion"

let tabs = [
  {id: "about", label: "About"},
  {id: "learn", label: "What You'll Learn"},
  {id: "curriculum", label: "Curriculum"},
  {id: "instructor", label: "Instructor"},
]

export default function CourseTabs() {
  let [active, setActive] = useState("about")

  useEffect(() => {
    let obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      {rootMargin: "-30% 0px -60% 0px"},
    )
    tabs.forEach((t) => {
      let el = document.getElementById(t.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  let go = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({behavior: "smooth", block: "start"})

  return (
    <div className="sticky top-16 z-20 -mx-4 overflow-x-auto scrollbar-none border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`relative cursor-pointer py-3.5 text-sm font-medium transition-colors duration-200 ${
              active === t.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {t.label}
            {active === t.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
