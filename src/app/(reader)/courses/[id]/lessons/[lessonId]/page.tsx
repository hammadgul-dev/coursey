import Link from "next/link"
import {notFound, redirect} from "next/navigation"
import {ArrowLeft, ArrowRight, Clock, ShieldCheck} from "lucide-react"
import {prisma} from "@/lib/prisma"
import {getSessionUser} from "@/lib/session"
import {getReaderData} from "@/lib/reader"
import {idSchema} from "@/validations/course"
import Reveal from "@/components/ui/Reveal"
import ReaderShell, {CompleteButton} from "@/components/reader/ReaderShell"
import LessonContent from "@/components/reader/LessonContent"
import Checkpoint from "@/components/reader/Checkpoint"

export async function generateMetadata({params}: any) {
  let {id, lessonId} = await params
  let pid = idSchema.safeParse(id)
  let pl = idSchema.safeParse(lessonId)
  if (!pid.success || !pl.success) return {title: "Lesson | Coursey"}
  let l = await prisma.lesson.findFirst({
    where: {
      id: pl.data as string,
      module: {course: {id: pid.data as string, status: "PUBLISHED"}},
    },
    select: {title: true},
  })
  return {title: l?.title ? `${l.title} | Coursey` : "Lesson | Coursey"}
}

export default async function LessonPage({params}: any) {
  let {id, lessonId} = await params
  let pid = idSchema.safeParse(id)
  let pl = idSchema.safeParse(lessonId)
  if (!pid.success || !pl.success) notFound()

  let sessionUser: any = await getSessionUser()
  let userId: string | null = sessionUser?.id || null

  let data: any = await getReaderData(
    pid.data as string,
    pl.data as string,
    userId,
  )
  if (!data) notFound()
  if (data.denied) redirect(`/courses/${id}`)

  let prev = data.flat[data.index - 1]
  let next = data.flat[data.index + 1]
  let link = (l: any) => `/courses/${id}/lessons/${l.id}`

  return (
    <ReaderShell
      courseId={data.courseId}
      courseTitle={data.courseTitle}
      lessonId={data.current.id}
      modules={data.modules}
      doneIds={data.doneIds}
      canTrack={data.canTrack}
    >
      <article className="space-y-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {data.current.moduleTitle}
            </span>
            <span>
              Lesson {data.index + 1} Of {data.flat.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {data.current.readMinutes || 0} Min Read
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {data.current.title}
          </h1>
        </Reveal>

        <Reveal>
          <LessonContent content={data.content} />
        </Reveal>

        {(data.checkpoints || []).map((c: any) => (
          <Reveal key={c.id}>
            <Checkpoint q={c.question} a={c.answer} />
          </Reveal>
        ))}

        <Reveal>
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 transition-colors duration-300 hover:border-indigo-300 dark:border-gray-800 dark:hover:border-indigo-500/50 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Mastery Checkpoint
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data.canTrack
                    ? "Mark This Lesson Complete To Track Your Progress."
                    : "Enroll In This Course To Track Your Progress."}
                </p>
              </div>
            </div>
            {data.canTrack ? (
              <CompleteButton lessonId={data.current.id} />
            ) : (
              <Link
                href={`/courses/${id}`}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98] sm:w-auto"
              >
                View Course
              </Link>
            )}
          </div>
        </Reveal>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          {prev && !prev.locked ? (
            <Link
              href={link(prev)}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:hover:border-indigo-500"
            >
              <ArrowLeft
                size={18}
                className="shrink-0 text-gray-400 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-indigo-600"
              />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Previous Lesson
                </p>
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next && !next.locked && (
            <Link
              href={link(next)}
              className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-indigo-600 p-4 text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.99] active:bg-indigo-800"
            >
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-indigo-200">
                  Next Lesson
                </p>
                <p className="truncate text-sm font-semibold">{next.title}</p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </article>
    </ReaderShell>
  )
}
