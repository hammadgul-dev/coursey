import Reveal from "@/components/ui/Reveal"

export default function InstructorCard({instructor}: any) {
  let name: string = instructor?.name || ""
  let initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x: string) => x[0])
    .join("")
    .toUpperCase()

  return (
    <Reveal>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Your Instructor
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
            {initials || "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {name}
            </p>
            {instructor?.headline && (
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                {instructor.headline}
              </p>
            )}
          </div>
        </div>
        {instructor?.bio && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {instructor.bio}
          </p>
        )}
      </div>
    </Reveal>
  )
}
