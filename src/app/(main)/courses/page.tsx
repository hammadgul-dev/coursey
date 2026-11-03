import {getCourses, getCategories} from "@/lib/courses"
import {courseQuerySchema} from "@/validations/course"
import CoursesExplorer from "./_components/catalog/CoursesExplorer"

let levels = [
  {label: "All Levels"},
  {label: "Beginner"},
  {label: "Intermediate"},
  {label: "Advanced"},
]

function pick(v: any) {
  let value = Array.isArray(v) ? v[0] : v
  return typeof value === "string" ? value.trim() : ""
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  let sp: any = await searchParams

  let raw: any = {limit: "9"}
  let q = pick(sp?.q)
  let cat = pick(sp?.cat)
  let level = pick(sp?.level)
  let page = pick(sp?.page)
  if (q) raw.search = q
  if (cat) raw.category = cat
  if (level) raw.level = level
  if (page) raw.page = page

  let parsed = courseQuerySchema.safeParse(raw)
  let params: any = parsed.success ? parsed.data : {page: 1, limit: 9}

  let data: any = await getCourses(params)
  let cats: any = await getCategories()
  let categories = [{label: "All Topics"}, ...cats]

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
        courses={data?.courses || []}
        total={data?.total || 0}
        page={data?.page || 1}
        totalPages={data?.totalPages || 1}
        pageSize={9}
        categories={categories}
        levels={levels}
        initialQuery={params?.search || ""}
        cat={params?.category || ""}
        level={params?.level || ""}
      />
    </div>
  )
}
