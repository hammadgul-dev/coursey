import {
  courses,
  categories,
  levels,
  readingTimeOptions,
  features,
} from "./_data/courses"
import CoursesExplorer from "./_components/CoursesExplorer"

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-5 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Browse Courses</h1>
        <p className="max-w-2xl text-muted-foreground mx-auto">
          Explore text-first courses written and verified by actual
          practitioners. Zero video fluff, distraction-free reading, and instant
          interactive code checkpoints.
        </p>
      </div>

      <CoursesExplorer
        courses={courses}
        categories={categories}
        levels={levels}
        readingTimeOptions={readingTimeOptions}
        features={features}
      />
    </div>
  )
}
