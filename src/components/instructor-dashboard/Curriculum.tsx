"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {motion, AnimatePresence} from "framer-motion"
import toast from "react-hot-toast"
import {ChevronDown, ChevronUp, Loader2, Plus, Trash2} from "lucide-react"
import {request} from "@/lib/request"
import LessonItem from "@/components/instructor-dashboard/LessonItem"

let iconBtn =
  "cursor-pointer rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-indigo-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"

let titleInput =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium outline-none transition-all placeholder:text-gray-400 hover:border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder:text-zinc-600 dark:hover:border-zinc-700"

function ModuleItem({mod, index, total, busy, onMove}: any) {
  let router = useRouter()
  let [title, setTitle] = useState(mod?.title || "")
  let [open, setOpen] = useState(true)
  let [working, setWorking] = useState("")

  let lessons = mod?.lessons || []
  let minutes = lessons.reduce(
    (n: number, l: any) => n + (Number(l?.readMinutes) || 0),
    0,
  )
  let locked = !!busy || !!working

  let saveTitle = async () => {
    if (title.trim() === (mod?.title || "")) return
    if (locked) return
    setWorking("title")
    let res = await request(`/api/instructor/modules/${mod?.id}`, "PATCH", {
      title: title.trim(),
    })
    setWorking("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    setTitle(title.trim())
    toast.success("Module Saved")
    router.refresh()
  }

  let removeModule = async () => {
    if (locked) return
    if (!window.confirm("Delete This Module And All Its Lessons?")) return
    setWorking("delete")
    let res = await request(`/api/instructor/modules/${mod?.id}`, "DELETE")
    setWorking("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Module Deleted")
    router.refresh()
  }

  let addLesson = async () => {
    if (locked) return
    setWorking("add")
    let res = await request(
      `/api/instructor/modules/${mod?.id}/lessons`,
      "POST",
      {title: "New Lesson", content: "", readMinutes: 1},
    )
    setWorking("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Lesson Added")
    router.refresh()
  }

  let moveLesson = async (i: number, dir: number) => {
    let j = i + dir
    if (j < 0 || j >= lessons.length || locked) return
    let ids = lessons.map((l: any) => l?.id)
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setWorking("move")
    let res = await request(
      `/api/instructor/modules/${mod?.id}/lessons`,
      "PUT",
      {ids},
    )
    setWorking("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-indigo-500 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-3 py-2.5 dark:bg-zinc-950/60">
        <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          Module {index + 1}
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
          placeholder="Module title"
          maxLength={120}
          className={`${titleInput} flex-1 basis-40`}
        />
        <span className="hidden shrink-0 text-xs text-gray-400 dark:text-zinc-500 sm:block">
          {lessons.length} lessons · {minutes} min
        </span>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            disabled={locked || index === 0}
            onClick={() => onMove?.(index, -1)}
            className={iconBtn}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={locked || index === total - 1}
            onClick={() => onMove?.(index, 1)}
            className={iconBtn}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={removeModule}
            className={`${iconBtn} hover:!bg-rose-50 hover:!text-rose-500 dark:hover:!bg-rose-500/10`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={iconBtn}
          >
            <motion.span
              animate={{rotate: open ? 180 : 0}}
              transition={{duration: 0.2}}
              className="block"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.25, ease: "easeInOut"}}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3">
              {lessons.map((l: any, li: number) => (
                <LessonItem
                  key={l?.id}
                  lesson={l}
                  label={`${index + 1}.${li + 1}`}
                  index={li}
                  total={lessons.length}
                  locked={locked}
                  onMove={moveLesson}
                />
              ))}
              <button
                type="button"
                disabled={locked}
                onClick={addLesson}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400"
              >
                {working === "add" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {working !== "add" && <Plus className="h-4 w-4" />}
                Add Lesson To Module {index + 1}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Curriculum({courseId, modules}: any) {
  let router = useRouter()
  let [busy, setBusy] = useState("")
  let list = modules || []

  let addModule = async () => {
    if (busy) return
    setBusy("add")
    let res = await request(
      `/api/instructor/courses/${courseId}/modules`,
      "POST",
      {title: "New Module"},
    )
    setBusy("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Module Added")
    router.refresh()
  }

  let moveModule = async (i: number, dir: number) => {
    let j = i + dir
    if (j < 0 || j >= list.length || busy) return
    let ids = list.map((m: any) => m?.id)
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setBusy("move")
    let res = await request(
      `/api/instructor/courses/${courseId}/modules`,
      "PUT",
      {ids},
    )
    setBusy("")
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    router.refresh()
  }

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
            Organize modules and text lessons. Changes save instantly.
          </p>
        </div>
        <button
          type="button"
          disabled={!!busy}
          onClick={addModule}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "add" && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy !== "add" && <Plus className="h-4 w-4" />}
          Add Module
        </button>
      </div>

      {list.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 px-4 py-10 text-center dark:border-zinc-700">
          <p className="text-sm font-medium">No Modules Yet</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            Add a module to start building your course.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {list.map((m: any, mi: number) => (
          <ModuleItem
            key={m?.id}
            mod={m}
            index={mi}
            total={list.length}
            busy={busy}
            onMove={moveModule}
          />
        ))}
      </div>
    </motion.section>
  )
}
