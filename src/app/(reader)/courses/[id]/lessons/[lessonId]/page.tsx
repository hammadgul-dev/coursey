import Link from "next/link"
import {notFound} from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lightbulb,
  ShieldCheck,
} from "lucide-react"
import {courses} from "@/data/courses"
import Reveal from "@/components/ui/Reveal"
import ReaderShell, {CompleteButton} from "@/components/reader/ReaderShell"
import CodeBlock from "@/components/reader/CodeBlock"
import Checkpoint from "@/components/reader/Checkpoint"
import {allLessons, checkpoint, code, diagram, rules} from "@/data/lessonData"

let Code = ({children}: any) => (
  <code className="rounded bg-indigo-50 px-1.5 py-0.5 text-[13px] font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
    {children}
  </code>
)

export async function generateMetadata({params}: any) {
  let {lessonId} = await params
  let l = allLessons.find((x: any) => String(x.id) === lessonId)

  return {title: l ? `${l.t} | Coursey` : "Lesson | Coursey"}
}

export default async function LessonPage({params}: any) {
  let {id, lessonId} = await params
  let idx = allLessons.findIndex((l: any) => String(l.id) === lessonId)
  if (idx < 0 || allLessons[idx].locked) notFound()

  let lesson = allLessons[idx]
  let prev = allLessons[idx - 1]
  let next = allLessons[idx + 1]
  let course = (courses as any[]).find((c) => String(c.id) === id)
  let link = (l: any) => `/courses/${id}/lessons/${l.id}`

  return (
    <ReaderShell
      courseId={id}
      courseTitle={course?.title ?? "Course"}
      lessonId={lesson.id}
    >
      <article className="space-y-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {lesson.module}
            </span>
            <span>
              Lesson {lesson.id} of {allLessons.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {lesson.m} min read
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {lesson.t}
          </h1>
          <p className="mt-4 text-sm leading-6 text-justify text-gray-600 dark:text-gray-300 sm:text-base">
            Constructing branching static contracts, destructuring generic
            payloads, and controlling distributive branch mechanisms in strict
            type safety.
          </p>
        </Reveal>

        <Reveal>
          <p className="text-sm leading-6 text-justify text-gray-700 dark:text-gray-300">
            At their core, conditional types enable compile-time ternary logic:{" "}
            <Code>T extends U ? X : Y</Code>. Their evaluation over union
            members follows a foundational mechanism known as{" "}
            <b className="text-indigo-600 dark:text-indigo-400">distribution</b>
            . Understanding when TypeScript distributes type arguments, and how
            to intentionally short-circuit that distribution, is the dividing
            line between basic typed configurations and rock-solid architectural
            foundations.
          </p>
        </Reveal>

        <Reveal>
          <div className="rounded-xl border border-indigo-200 border-l-4 border-l-indigo-600 bg-indigo-50/60 p-5 dark:border-indigo-500/30 dark:border-l-indigo-500 dark:bg-indigo-500/10">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              <Lightbulb size={16} /> Core Architecture Rules
            </p>
            <ul className="space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {rules.map((r) => (
                <li key={r.b}>
                  <b className="text-gray-900 dark:text-white">{r.b}:</b> {r.t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Distributive Union Evaluation
          </h2>
          <p className="mt-3 text-sm leading-6 text-justify text-gray-700 dark:text-gray-300">
            When a conditional type operates on an unresolved generic type, it
            becomes distributive if that parameter is provided as a union. For
            instance, evaluating <Code>ToArray</Code> does not evaluate the
            entire union at once; instead, it distributes into:
          </p>
        </Reveal>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40 sm:p-5">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Canonical compiler resolution
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {diagram.map((d, i) => (
              <Reveal key={d.label} delay={i * 0.08}>
                <div className="h-full cursor-default rounded-lg border border-gray-200 bg-white p-3 transition-colors duration-300 hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {d.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-indigo-600 dark:text-indigo-400">
                    {d.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {d.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="mb-4 text-sm leading-6 text-justify text-gray-700 dark:text-gray-300">
            Examine how this behavior unlocks custom utility typings, such as
            extracting asynchronous resolution types or stripping out
            nullability flags across complex interfaces:
          </p>
          <CodeBlock code={code} file="distribute-pattern.ts" />
        </Reveal>

        <Reveal>
          <Checkpoint q={checkpoint.q} a={checkpoint.a} />
        </Reveal>

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
                  Update your syllabus status to unlock next lessons.
                </p>
              </div>
            </div>
            <CompleteButton lessonId={lesson.id} />
          </div>
        </Reveal>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          {prev ? (
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
                  Previous lesson
                </p>
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {prev.t}
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
                  Next lesson
                </p>
                <p className="truncate text-sm font-semibold">{next.t}</p>
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
