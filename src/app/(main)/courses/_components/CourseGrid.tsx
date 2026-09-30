"use client"
import {AnimatePresence, motion} from "framer-motion"
import CourseCard from "./CourseCard"
import type {Course} from "../_data/courses"

export default function CourseGrid({courses}: {courses: Course[]}) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center animate-in fade-in duration-300">
        <p className="text-sm font-medium">No courses found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={courses.map((c) => c.id).join("-")}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.2}}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {courses.map((c, i) => (
          <CourseCard key={c.id} c={c} i={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
