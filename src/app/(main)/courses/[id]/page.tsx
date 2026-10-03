import {notFound} from "next/navigation"
import {courses} from "../_data/courses"
import {modules, totalLessons} from "../_data/courseDetail"
import CourseHero from "../_components/CourseHero"
import CourseTabs from "../_components/CourseTabs"
import CourseAbout from "../_components/CourseAbout"
import LearnGrid from "../_components/LearnGrid"
import Curriculum from "../_components/Curriculum"
import InstructorCard from "../_components/InstructorCard"
import EnrollCard from "../_components/EnrollCard"
import RelatedCourses from "../_components/RelatedCourses"
import Reveal from "../_components/Reveal"

let find = (id: string) => (courses as any[]).find((c) => String(c.id) === id)

export async function generateMetadata({params}: any) {
  let {id} = await params
  let course = find(id)
  return {title: course ? `${course.title} | Coursey` : "Course | Coursey"}
}

export default async function CourseDetailPage({params}: any) {
  let {id} = await params
  let course = find(id)
  if (!course) notFound()

  let related = (courses as any[]).filter((c) => c.id !== course.id).slice(0, 3)

  return (
    <main className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <CourseHero course={course} lessons={totalLessons} />

      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <CourseTabs />

          <section id="about" className="scroll-mt-32 py-10">
            <CourseAbout course={course} />
          </section>

          <section id="learn" className="scroll-mt-32 py-10">
            <LearnGrid />
          </section>

          <section id="curriculum" className="scroll-mt-32 py-10">
            <Reveal>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Course curriculum
              </h2>
              <Curriculum modules={modules} />
            </Reveal>
          </section>

          <section id="instructor" className="scroll-mt-32 py-10">
            <InstructorCard />
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 pt-6">
            <EnrollCard lessons={totalLessons} />
          </div>
        </aside>
      </div>

      <RelatedCourses items={related} />
    </main>
  )
}
