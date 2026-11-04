import {notFound} from "next/navigation"
import {prisma} from "@/lib/prisma"
import {getSessionUser} from "@/lib/session"
import {getCourseDetail, getCourses} from "@/lib/courses"
import {idSchema} from "@/validations/course"
import CourseHero from "../_components/detail/CourseHero"
import CourseTabs from "../_components/detail/CourseTabs"
import CourseAbout from "../_components/detail/CourseAbout"
import LearnGrid from "../_components/detail/LearnGrid"
import Curriculum from "../_components/detail/Curriculum"
import InstructorCard from "../_components/detail/InstructorCard"
import EnrollCard from "../_components/detail/EnrollCard"
import RelatedCourses from "../_components/detail/RelatedCourses"
import Reveal from "@/components/ui/Reveal"

export async function generateMetadata({params}: any) {
  let {id} = await params
  let parsed = idSchema.safeParse(id)
  if (!parsed.success) return {title: "Course | Coursey"}
  let course = await prisma.course.findFirst({
    where: {id: parsed.data, status: "PUBLISHED"},
    select: {title: true},
  })
  return {
    title: course?.title ? `${course.title} | Coursey` : "Course | Coursey",
  }
}

export default async function CourseDetailPage({params}: any) {
  let {id} = await params
  let parsed = idSchema.safeParse(id)
  if (!parsed.success) notFound()

  let sessionUser: any = await getSessionUser()
  let userId: string | null = sessionUser?.id || null
  let course: any = await getCourseDetail(parsed.data as string, userId)
  if (!course) notFound()

  let role = ""
  let saved = false
  if (userId) {
    let u = await prisma.user.findUnique({
      where: {id: userId},
      select: {role: true},
    })
    role = u?.role || ""
    let w = await prisma.watchlist.findUnique({
      where: {userId_courseId: {userId, courseId: course.id}},
    })
    saved = !!w
  }

  let allLessons: any[] = []
  for (let m of course.modules || []) {
    for (let l of m?.lessons || []) allLessons.push(l)
  }

  let firstLessonId = allLessons[0]?.id || ""
  let nextLessonId = firstLessonId
  if (userId && course.isEnrolled && allLessons.length > 0) {
    let done = await prisma.lessonProgress.findMany({
      where: {userId, lessonId: {in: allLessons.map((l: any) => l.id)}},
      select: {lessonId: true},
    })
    let doneSet = new Set(done.map((d: any) => d.lessonId))
    let next = allLessons.find((l: any) => !doneSet.has(l.id))
    nextLessonId = next?.id || firstLessonId
  }

  let modules = (course.modules || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    lessons: (m.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      readMinutes: l.readMinutes,
      isFree: l.isFree,
      locked: l.locked,
    })),
  }))

  let relatedData = await getCourses({category: course.category, limit: 4})
  let related = (relatedData?.courses || [])
    .filter((c: any) => c.id !== course.id)
    .slice(0, 3)

  let enroll = {
    courseId: course.id,
    isEnrolled: !!course.isEnrolled,
    saved,
    role,
    loggedIn: !!userId,
    nextLessonId,
  }

  return (
    <main className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <CourseHero
        course={course}
        lessons={course.lessonsCount}
        enroll={enroll}
      />

      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <CourseTabs />

          <section id="about" className="scroll-mt-32 py-10">
            <CourseAbout course={course} />
          </section>

          <section id="learn" className="scroll-mt-32 py-10">
            <LearnGrid items={course.learn || []} />
          </section>

          <section id="curriculum" className="scroll-mt-32 py-10">
            <Reveal>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Course Curriculum
              </h2>
              <Curriculum modules={modules} courseId={course.id} />
            </Reveal>
          </section>

          <section id="instructor" className="scroll-mt-32 py-10">
            <InstructorCard instructor={course.instructor} />
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 pt-6">
            <EnrollCard lessons={course.lessonsCount} enroll={enroll} />
          </div>
        </aside>
      </div>

      <RelatedCourses items={related} />
    </main>
  )
}
