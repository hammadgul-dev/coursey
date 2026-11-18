"use client"

import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {
  CheckCircle2,
  ListChecks,
  Loader2,
  Lock,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react"
import {request} from "@/lib/request"
import {fireConfetti, stopConfetti} from "@/lib/confetti"
import {useReader} from "./ReaderShell"

let toolBtn =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"

let letters = ["A", "B", "C", "D"]

export default function LessonTools({lessonId}: any) {
  let {done} = useReader()
  let isDone = (done || []).includes(lessonId)

  let [points, setPoints] = useState(null as any)
  let [sumBusy, setSumBusy] = useState(false)
  let [sumOpen, setSumOpen] = useState(false)

  let [quiz, setQuiz] = useState(null as any)
  let [quizBusy, setQuizBusy] = useState(false)
  let [quizOpen, setQuizOpen] = useState(false)
  let [idx, setIdx] = useState(0)
  let [picked, setPicked] = useState(null as any)
  let [score, setScore] = useState(0)
  let [finished, setFinished] = useState(false)

  useEffect(() => {
    return () => stopConfetti()
  }, [])

  let loadSummary = async () => {
    if (sumBusy) return
    if (points) {
      setSumOpen(!sumOpen)
      return
    }
    setSumBusy(true)
    let res: any = await request(
      `/api/student/lessons/${lessonId}/ai/summary`,
      "POST",
    )
    setSumBusy(false)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setPoints(res?.data?.points || [])
    setSumOpen(true)
  }

  let loadQuiz = async () => {
    if (quizBusy || !isDone) return
    if (quiz) {
      setQuizOpen(!quizOpen)
      return
    }
    setQuizBusy(true)
    let res: any = await request(
      `/api/student/lessons/${lessonId}/ai/quiz`,
      "POST",
    )
    setQuizBusy(false)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    let list = res?.data?.questions || []
    if (list.length === 0) {
      toast.error("Something Went Wrong")
      return
    }
    setQuiz(list)
    setIdx(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setQuizOpen(true)
    toast.success("Quiz Ready")
  }

  let pick = (i: number) => {
    if (picked !== null || !quiz) return
    setPicked(i)
    if (i === quiz[idx]?.correctIndex) setScore((s) => s + 1)
  }

  let next = () => {
    if (!quiz) return
    if (idx + 1 < quiz.length) {
      setIdx(idx + 1)
      setPicked(null)
      return
    }
    setFinished(true)
    if (score === quiz.length) fireConfetti()
  }

  let restart = () => {
    stopConfetti()
    setIdx(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  let q = quiz ? quiz[idx] : null
  let total = quiz ? quiz.length : 0
  let progress = total
    ? ((idx + (picked !== null || finished ? 1 : 0)) / total) * 100
    : 0

  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:p-5">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Lesson Tools
        </p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button onClick={loadSummary} disabled={sumBusy} className={toolBtn}>
          {sumBusy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {sumBusy
            ? "Summarizing"
            : points
              ? sumOpen
                ? "Hide Summary"
                : "Show Summary"
              : "Summarize Lesson"}
        </button>
        <button
          onClick={loadQuiz}
          disabled={quizBusy || !isDone}
          className={toolBtn}
        >
          {quizBusy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isDone ? (
            <ListChecks size={15} />
          ) : (
            <Lock size={15} />
          )}
          {quizBusy
            ? "Preparing Quiz"
            : quiz
              ? quizOpen
                ? "Hide Quiz"
                : "Show Quiz"
              : "Take Quiz"}
        </button>
      </div>

      {!isDone && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Complete This Lesson To Unlock The Quiz
        </p>
      )}

      <AnimatePresence initial={false}>
        {points && sumOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.25, ease: "easeOut"}}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-lg bg-indigo-50/60 p-4 dark:bg-indigo-500/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                Key Points
              </p>
              <ul className="mt-3 space-y-2">
                {points.map((p: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{opacity: 0, x: -8}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: i * 0.06, duration: 0.25}}
                    className="flex gap-2.5 text-sm leading-6 text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    <span>{p}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
                AI Can Make Mistakes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {quiz && quizOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.25, ease: "easeOut"}}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <motion.div
                  className="h-full rounded-full bg-indigo-600"
                  animate={{width: `${progress}%`}}
                  transition={{duration: 0.4, ease: "easeOut"}}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {finished ? (
                  <motion.div
                    key="result"
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.25}}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <p className="text-4xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                      {score} / {total}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {score === total
                        ? "Perfect Score"
                        : score >= Math.ceil(total * 0.6)
                          ? "Good Job"
                          : "Keep Practicing"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {score === total
                        ? "You Understood This Lesson Really Well"
                        : "Read The Lesson Again And Retry"}
                    </p>
                    <button
                      onClick={restart}
                      className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95"
                    >
                      <RotateCcw size={14} />
                      Retake Quiz
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={idx}
                    initial={{opacity: 0, x: 16}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -16}}
                    transition={{duration: 0.2, ease: "easeOut"}}
                  >
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Question {idx + 1} Of {total}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                      {q?.question}
                    </p>

                    <div className="mt-3 space-y-2">
                      {(q?.options || []).map((o: string, i: number) => {
                        let isCorrect = i === q?.correctIndex
                        let isPicked = i === picked
                        let cls =
                          "border-gray-200 text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10"
                        if (picked !== null) {
                          if (isCorrect) {
                            cls =
                              "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                          } else if (isPicked) {
                            cls =
                              "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300"
                          } else {
                            cls =
                              "border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600"
                          }
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => pick(i)}
                            disabled={picked !== null}
                            className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 active:scale-[0.99] disabled:cursor-default ${cls}`}
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                              {picked !== null && isCorrect ? (
                                <CheckCircle2 size={14} />
                              ) : picked !== null && isPicked ? (
                                <XCircle size={14} />
                              ) : (
                                letters[i]
                              )}
                            </span>
                            <span className="min-w-0 flex-1 break-words">
                              {o}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <AnimatePresence initial={false}>
                      {picked !== null && (
                        <motion.div
                          initial={{opacity: 0, y: 8}}
                          animate={{opacity: 1, y: 0}}
                          transition={{duration: 0.25}}
                          className="mt-3"
                        >
                          <p className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                            <span className="font-semibold">
                              {picked === q?.correctIndex
                                ? "Correct. "
                                : "Not Quite. "}
                            </span>
                            {q?.explanation}
                          </p>
                          <button
                            onClick={next}
                            className="mt-3 w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
                          >
                            {idx + 1 < total ? "Next Question" : "See Result"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
