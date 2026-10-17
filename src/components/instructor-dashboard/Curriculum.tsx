"use client"

import {useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import toast from "react-hot-toast"
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Italic,
  Link2,
  List,
  Plus,
  ListChecks,
  Trash2,
  X,
} from "lucide-react"

let cpInput =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"

let emptyCheckpoint = () => ({
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
})

let iconBtn =
  "cursor-pointer rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-indigo-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"

let titleInput =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium outline-none transition-all placeholder:text-gray-400 hover:border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder:text-zinc-600 dark:hover:border-zinc-700"

let tools = [
  {key: "bold", icon: Bold, pre: "**", post: "**", ph: "bold text"},
  {key: "italic", icon: Italic, pre: "*", post: "*", ph: "italic text"},
  {key: "code", icon: Code2, pre: "`", post: "`", ph: "code"},
  {key: "link", icon: Link2, pre: "[", post: "](https://)", ph: "link text"},
  {key: "list", icon: List, pre: "\n- ", post: "", ph: "list item"},
]

export default function Curriculum({modules, onChange}: any) {
  let [closedMods, setClosedMods] = useState<any>({})
  let [openLessons, setOpenLessons] = useState<any>({})

  let list = modules || []
  let uid = () => `${Date.now()}${Math.floor(Math.random() * 10000)}`

  let swap = (arr: any[], i: number, dir: number) => {
    let j = i + dir
    if (j < 0 || j >= arr.length) return arr
    let copy = [...arr]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    return copy
  }

  let patchModule = (id: string, patch: any) =>
    onChange?.(list.map((m: any) => (m?.id === id ? {...m, ...patch} : m)))

  let patchLesson = (mid: string, lid: string, patch: any) =>
    onChange?.(
      list.map((m: any) =>
        m?.id === mid
          ? {
              ...m,
              lessons: (m?.lessons || []).map((l: any) =>
                l?.id === lid ? {...l, ...patch} : l,
              ),
            }
          : m,
      ),
    )

  let addModule = () => {
    let id = `m${uid()}`
    onChange?.([...list, {id, title: "", lessons: []}])
    toast.success("Module added")
  }

  let removeModule = (id: string) => {
    onChange?.(list.filter((m: any) => m?.id !== id))
    toast.success("Module removed")
  }

  let addLesson = (mid: string) => {
    let id = `ls${uid()}`
    let mod = list.find((m: any) => m?.id === mid)
    if ((mod?.lessons?.length || 0) >= 20) {
      toast.error("Maximum 20 lessons per module")
      return
    }
    patchModule(mid, {
      lessons: [
        ...(mod?.lessons || []),
        {id, title: "", content: "", minutes: "", checkpoint: null},
      ],
    })
    setOpenLessons((p: any) => ({...p, [id]: true}))
  }

  let removeLesson = (mid: string, lid: string) => {
    let mod = list.find((m: any) => m?.id === mid)
    patchModule(mid, {
      lessons: (mod?.lessons || []).filter((l: any) => l?.id !== lid),
    })
    toast.success("Lesson removed")
  }

  let addCheckpoint = (mid: string, lid: string) => {
    patchLesson(mid, lid, {checkpoint: emptyCheckpoint()})
    toast.success("Checkpoint added")
  }

  let removeCheckpoint = (mid: string, lid: string) => {
    patchLesson(mid, lid, {checkpoint: null})
    toast.success("Checkpoint removed")
  }

  let patchCheckpoint = (mid: string, lid: string, l: any, patch: any) =>
    patchLesson(mid, lid, {checkpoint: {...(l?.checkpoint || {}), ...patch}})

  let setOption = (mid: string, lid: string, l: any, oi: number, val: string) =>
    patchCheckpoint(mid, lid, l, {
      options: (l?.checkpoint?.options || []).map((o: string, i: number) =>
        i === oi ? val : o,
      ),
    })

  let applyFormat = (mid: string, lid: string, tool: any) => {
    let ta = document.getElementById(`ta-${lid}`) as any
    if (!ta) return
    let start = ta.selectionStart || 0
    let end = ta.selectionEnd || 0
    let picked = ta.value.slice(start, end) || tool.ph
    let next =
      ta.value.slice(0, start) +
      tool.pre +
      picked +
      tool.post +
      ta.value.slice(end)
    patchLesson(mid, lid, {content: next})
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(
        start + tool.pre.length,
        start + tool.pre.length + picked.length,
      )
    })
  }

  let modMinutes = (m: any) =>
    (m?.lessons || []).reduce(
      (n: number, l: any) => n + (Number(l?.minutes) || 0),
      0,
    )

  return (
    <motion.section
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: "easeOut", delay: 0.2}}
      className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">3. Curriculum</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Organize modules and text lessons.
          </p>
        </div>
        <button
          type="button"
          onClick={addModule}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add module
        </button>
      </div>

      {list.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 px-4 py-10 text-center dark:border-zinc-700">
          <p className="text-sm font-medium">No modules yet</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            Add a module or apply an AI outline above.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {list.map((m: any, mi: number) => {
            let isOpen = !closedMods[m?.id]
            let lessons = m?.lessons || []
            return (
              <motion.div
                key={m?.id}
                layout
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.97}}
                transition={{duration: 0.25}}
                className="overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-indigo-500 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-3 py-2.5 dark:bg-zinc-950/60">
                  <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    Module {mi + 1}
                  </span>
                  <input
                    value={m?.title || ""}
                    onChange={(e) =>
                      patchModule(m?.id, {title: e.target.value})
                    }
                    placeholder="Module title"
                    maxLength={80}
                    className={`${titleInput} flex-1 basis-40`}
                  />
                  <span className="hidden shrink-0 text-xs text-gray-400 dark:text-zinc-500 sm:block">
                    {lessons.length} lessons · {modMinutes(m)} min
                  </span>
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      disabled={mi === 0}
                      onClick={() => onChange?.(swap(list, mi, -1))}
                      className={iconBtn}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={mi === list.length - 1}
                      onClick={() => onChange?.(swap(list, mi, 1))}
                      className={iconBtn}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeModule(m?.id)}
                      className={`${iconBtn} hover:!bg-rose-50 hover:!text-rose-500 dark:hover:!bg-rose-500/10`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setClosedMods((p: any) => ({...p, [m?.id]: isOpen}))
                      }
                      className={iconBtn}
                    >
                      <motion.span
                        animate={{rotate: isOpen ? 180 : 0}}
                        transition={{duration: 0.2}}
                        className="block"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.25, ease: "easeInOut"}}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 p-3">
                        <AnimatePresence initial={false}>
                          {lessons.map((l: any, li: number) => {
                            let lOpen = !!openLessons[l?.id]
                            return (
                              <motion.div
                                key={l?.id}
                                layout
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                exit={{opacity: 0, height: 0}}
                                transition={{duration: 0.22}}
                                className="overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-indigo-500 dark:border-zinc-800"
                              >
                                <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                                  <span className="w-9 shrink-0 text-xs font-medium text-gray-400 dark:text-zinc-500">
                                    {mi + 1}.{li + 1}
                                  </span>
                                  <input
                                    value={l?.title || ""}
                                    onChange={(e) =>
                                      patchLesson(m?.id, l?.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    placeholder="Lesson title"
                                    maxLength={80}
                                    className={`${titleInput} flex-1 basis-40`}
                                  />
                                  <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <input
                                      type="number"
                                      min={1}
                                      max={180}
                                      value={l?.minutes || ""}
                                      onChange={(e) =>
                                        patchLesson(m?.id, l?.id, {
                                          minutes: e.target.value.slice(0, 3),
                                        })
                                      }
                                      placeholder="0"
                                      className="w-12 rounded-md border border-gray-200 bg-transparent px-1.5 py-0.5 text-center text-xs outline-none transition-all hover:border-indigo-500 focus:border-indigo-500 dark:border-zinc-700"
                                    />
                                    min
                                  </div>
                                  <div className="flex shrink-0 items-center">
                                    <button
                                      type="button"
                                      disabled={li === 0}
                                      onClick={() =>
                                        patchModule(m?.id, {
                                          lessons: swap(lessons, li, -1),
                                        })
                                      }
                                      className={iconBtn}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={li === lessons.length - 1}
                                      onClick={() =>
                                        patchModule(m?.id, {
                                          lessons: swap(lessons, li, 1),
                                        })
                                      }
                                      className={iconBtn}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeLesson(m?.id, l?.id)}
                                      className={`${iconBtn} hover:!bg-rose-50 hover:!text-rose-500 dark:hover:!bg-rose-500/10`}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenLessons((p: any) => ({
                                          ...p,
                                          [l?.id]: !lOpen,
                                        }))
                                      }
                                      className={iconBtn}
                                    >
                                      <motion.span
                                        animate={{rotate: lOpen ? 180 : 0}}
                                        transition={{duration: 0.2}}
                                        className="block"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </motion.span>
                                    </button>
                                  </div>
                                </div>

                                <AnimatePresence initial={false}>
                                  {lOpen && (
                                    <motion.div
                                      initial={{height: 0, opacity: 0}}
                                      animate={{height: "auto", opacity: 1}}
                                      exit={{height: 0, opacity: 0}}
                                      transition={{
                                        duration: 0.25,
                                        ease: "easeInOut",
                                      }}
                                      className="overflow-hidden"
                                    >
                                      <div className="border-t border-gray-200 p-3 dark:border-zinc-800">
                                        <div className="mb-2 flex items-center gap-1">
                                          {tools.map((t) => (
                                            <button
                                              key={t.key}
                                              type="button"
                                              onClick={() =>
                                                applyFormat(m?.id, l?.id, t)
                                              }
                                              className={iconBtn}
                                            >
                                              <t.icon className="h-4 w-4" />
                                            </button>
                                          ))}
                                          <span className="ml-auto text-xs tabular-nums text-gray-400 dark:text-zinc-500">
                                            {(l?.content || "").length} chars
                                          </span>
                                        </div>
                                        <textarea
                                          id={`ta-${l?.id}`}
                                          value={l?.content || ""}
                                          onChange={(e) =>
                                            patchLesson(m?.id, l?.id, {
                                              content: e.target.value,
                                            })
                                          }
                                          rows={9}
                                          placeholder="Write the lesson in markdown..."
                                          className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm outline-none transition-all placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"
                                        />

                                        <div className="mt-3">
                                          <AnimatePresence
                                            mode="wait"
                                            initial={false}
                                          >
                                            {l?.checkpoint ? (
                                              <motion.div
                                                key="cp"
                                                initial={{opacity: 0, y: 8}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -8}}
                                                transition={{duration: 0.2}}
                                                className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/5"
                                              >
                                                <div className="flex items-center justify-between gap-2">
                                                  <p className="flex items-center gap-2 text-sm font-semibold">
                                                    <ListChecks className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                    Checkpoint quiz {mi + 1}.
                                                    {li + 1}
                                                  </p>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeCheckpoint(
                                                        m?.id,
                                                        l?.id,
                                                      )
                                                    }
                                                    className="cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 active:scale-95 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                  >
                                                    Delete checkpoint
                                                  </button>
                                                </div>

                                                <div>
                                                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">
                                                    Question
                                                  </label>
                                                  <input
                                                    value={
                                                      l?.checkpoint?.question ||
                                                      ""
                                                    }
                                                    maxLength={200}
                                                    onChange={(e) =>
                                                      patchCheckpoint(
                                                        m?.id,
                                                        l?.id,
                                                        l,
                                                        {
                                                          question:
                                                            e.target.value,
                                                        },
                                                      )
                                                    }
                                                    placeholder="Ask a question about this lesson"
                                                    className={cpInput}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">
                                                    Options (select the correct
                                                    one)
                                                  </label>
                                                  <div className="space-y-2">
                                                    {(
                                                      l?.checkpoint?.options ||
                                                      []
                                                    ).map(
                                                      (
                                                        o: string,
                                                        oi: number,
                                                      ) => {
                                                        let isCorrect =
                                                          l?.checkpoint
                                                            ?.correct === oi
                                                        return (
                                                          <div
                                                            key={oi}
                                                            className="flex items-center gap-2"
                                                          >
                                                            <input
                                                              type="radio"
                                                              name={`cp-${l?.id}`}
                                                              checked={
                                                                isCorrect
                                                              }
                                                              onChange={() =>
                                                                patchCheckpoint(
                                                                  m?.id,
                                                                  l?.id,
                                                                  l,
                                                                  {correct: oi},
                                                                )
                                                              }
                                                              className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                                                            />
                                                            <input
                                                              value={o || ""}
                                                              maxLength={120}
                                                              onChange={(e) =>
                                                                setOption(
                                                                  m?.id,
                                                                  l?.id,
                                                                  l,
                                                                  oi,
                                                                  e.target
                                                                    .value,
                                                                )
                                                              }
                                                              placeholder={`Option ${oi + 1}`}
                                                              className={`${cpInput} ${isCorrect ? "!border-emerald-500" : ""}`}
                                                            />
                                                            <span
                                                              className={`hidden w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 transition-opacity dark:text-emerald-400 sm:block ${
                                                                isCorrect
                                                                  ? "opacity-100"
                                                                  : "opacity-0"
                                                              }`}
                                                            >
                                                              Correct
                                                            </span>
                                                          </div>
                                                        )
                                                      },
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">
                                                    Explanation (optional)
                                                  </label>
                                                  <textarea
                                                    value={
                                                      l?.checkpoint
                                                        ?.explanation || ""
                                                    }
                                                    maxLength={300}
                                                    rows={3}
                                                    onChange={(e) =>
                                                      patchCheckpoint(
                                                        m?.id,
                                                        l?.id,
                                                        l,
                                                        {
                                                          explanation:
                                                            e.target.value,
                                                        },
                                                      )
                                                    }
                                                    placeholder="Why is this the right answer?"
                                                    className={`${cpInput} resize-none`}
                                                  />
                                                </div>
                                              </motion.div>
                                            ) : (
                                              <motion.button
                                                key="add"
                                                type="button"
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.15}}
                                                onClick={() =>
                                                  addCheckpoint(m?.id, l?.id)
                                                }
                                                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400"
                                              >
                                                <ListChecks className="h-4 w-4" />
                                                Add checkpoint
                                              </motion.button>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            )
                          })}
                        </AnimatePresence>

                        <button
                          type="button"
                          onClick={() => addLesson(m?.id)}
                          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-[0.99] dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400"
                        >
                          <Plus className="h-4 w-4" />
                          Add lesson to Module {mi + 1}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
