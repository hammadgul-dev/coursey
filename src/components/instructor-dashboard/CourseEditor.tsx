"use client"

import {useRef, useState} from "react"
import {useRouter} from "next/navigation"
import {motion} from "framer-motion"
import toast from "react-hot-toast"
import {Check, ChevronDown, Loader2, Plus, Upload, X} from "lucide-react"
import {categories, levels} from "@/lib/editorOptions"
import {request} from "@/lib/request"
import {uploadFile} from "@/lib/upload"
import AiOutline from "@/components/instructor-dashboard/AiOutline"
import Curriculum from "@/components/instructor-dashboard/Curriculum"

let inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"

let labelCls = "mb-1.5 block text-sm font-medium"

let counterCls = (len: number, max: number) =>
  `text-xs tabular-nums transition-colors ${len >= max ? "text-amber-500" : "text-gray-400 dark:text-zinc-500"}`

let imageTypes = ["image/jpeg", "image/png", "image/webp"]

export default function CourseEditor({course}: any) {
  let router = useRouter()
  let fileRef = useRef<HTMLInputElement>(null)
  let courseId: string = course?.id || ""

  let initLearn: string[] = course?.learn || []
  if (initLearn.length === 0) initLearn = [""]

  let [busy, setBusy] = useState("")
  let [coverBusy, setCoverBusy] = useState("")
  let [title, setTitle] = useState(course?.title || "")
  let [description, setDescription] = useState(course?.description || "")
  let [category, setCategory] = useState(course?.category || "")
  let [level, setLevel] = useState(course?.level || "BEGINNER")
  let [cover, setCover] = useState(course?.cover || "")
  let [learn, setLearn] = useState<string[]>(initLearn)

  let editLearn = (i: number, text: string) =>
    setLearn(learn.map((x, k) => (k === i ? text : x)))

  let addLearn = () => {
    if (learn.length >= 8) {
      toast.error("Maximum 8 Takeaways Allowed")
      return
    }
    setLearn([...learn, ""])
  }

  let removeLearn = (i: number) => setLearn(learn.filter((_, k) => k !== i))

  let openPicker = () => {
    if (coverBusy) return
    if (!courseId) {
      toast.error("Save The Draft First")
      return
    }
    fileRef.current?.click()
  }

  let pickCover = async (e: any) => {
    let file = e?.target?.files?.[0]
    if (e?.target) e.target.value = ""
    if (!file || coverBusy || !courseId) return
    if (!imageTypes.includes(file.type)) {
      toast.error("Only Jpg, Png Or Webp Allowed")
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image Must Be Under 3 Mb")
      return
    }
    setCoverBusy("upload")
    let res: any = await uploadFile(
      `/api/upload/cover?courseId=${courseId}`,
      file,
    )
    setCoverBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setCover(res?.data?.cover || "")
    toast.success("Cover Updated")
  }

  let removeCover = async () => {
    if (coverBusy || !courseId) return
    setCoverBusy("remove")
    let res: any = await request(
      `/api/upload/cover?courseId=${courseId}`,
      "DELETE",
    )
    setCoverBusy("")
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setCover("")
    toast.success("Cover Removed")
  }

  let modList = course?.modules || []
  let allLessons = modList.flatMap((m: any) => m?.lessons || [])
  let checkpointCount = allLessons.reduce(
    (n: number, l: any) => n + (l?.checkpoints?.length || 0),
    0,
  )
  let totalMin = allLessons.reduce(
    (n: number, l: any) => n + (Number(l?.readMinutes) || 0),
    0,
  )
  let readTime = `${totalMin}m`
  if (totalMin >= 60)
    readTime = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`

  let learnClean = learn.map((x) => x.trim()).filter(Boolean)
  let titleLen = title.length
  let descLen = description.length

  let checks = [
    {label: "Title Added", ok: title.trim().length >= 3},
    {label: "Description Added", ok: description.trim().length >= 20},
    {label: "Category Selected", ok: !!category},
    {label: "At Least 1 Learning Point", ok: learnClean.length > 0},
    {label: "At Least 1 Module", ok: modList.length > 0},
    {
      label: "Every Module Has A Lesson",
      ok:
        modList.length > 0 &&
        modList.every((m: any) => (m?.lessons || []).length > 0),
    },
    {
      label: "All Lessons Have Content",
      ok:
        allLessons.length > 0 &&
        allLessons.every((l: any) => (l?.content || "").trim()),
    },
  ]
  let doneCount = checks.filter((c) => c.ok).length
  let ready = doneCount === checks.length

  let saveDetails = async () => {
    if (title.trim().length < 3) {
      toast.error("Title Must Be At Least 3 Characters")
      return ""
    }
    let body: any = {
      title: title.trim(),
      level,
      cover: cover.trim(),
      learn: learnClean,
    }
    if (description.trim()) body.description = description.trim()
    if (category) body.category = category

    if (courseId) {
      let res = await request(
        `/api/instructor/courses/${courseId}`,
        "PATCH",
        body,
      )
      if (!res.ok) {
        toast.error(res.error)
        return ""
      }
      return courseId
    }

    let res = await request("/api/instructor/courses", "POST", body)
    if (!res.ok) {
      toast.error(res.error)
      return ""
    }
    let newId = res.data?.id || ""
    if (!newId) toast.error("Something Went Wrong")
    return newId
  }

  let saveDraft = async () => {
    if (busy) return
    setBusy("save")
    let id = await saveDetails()
    setBusy("")
    if (!id) return
    toast.success("Draft Saved")
    if (!courseId) {
      router.replace(`/instructor-dashboard/create-course?id=${id}`)
      return
    }
    router.refresh()
  }

  let submit = async () => {
    if (busy) return
    if (!courseId) {
      toast.error("Save The Draft First")
      return
    }
    if (!ready) {
      toast.error("Complete The Readiness Checklist First")
      return
    }
    setBusy("submit")
    let id = await saveDetails()
    if (!id) {
      setBusy("")
      return
    }
    let res = await request(
      `/api/instructor/courses/${courseId}/submit`,
      "POST",
    )
    if (!res.ok) {
      setBusy("")
      toast.error(res.error)
      return
    }
    toast.success("Course Submitted For Review")
    router.push("/instructor-dashboard")
    router.refresh()
  }

  let metrics = [
    {label: "Modules", value: modList.length},
    {label: "Lessons", value: allLessons.length},
    {label: "Checkpoints", value: checkpointCount},
    {label: "Read Time", value: readTime, accent: true},
  ]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <motion.section
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: "easeOut"}}
          className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">1. Course Information</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Shown in the course catalog and reader header.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <span className={counterCls(titleLen, 120)}>
                  {titleLen} / 120
                </span>
              </div>
              <input
                value={title}
                maxLength={120}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern TypeScript Architecture"
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <span className={counterCls(descLen, 2000)}>
                  {descLen} / 2000
                </span>
              </div>
              <textarea
                value={description}
                maxLength={2000}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will students learn in this course?"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${inputCls} cursor-pointer appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Level <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className={`${inputCls} cursor-pointer appearance-none pr-10`}
                  >
                    {levels.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Cover Image (Optional)</label>
              {cover && (
                <img
                  src={cover}
                  alt="Cover preview"
                  className="mb-3 aspect-video w-full rounded-lg border border-gray-200 object-cover dark:border-zinc-800 sm:w-64"
                />
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!!coverBusy}
                  onClick={openPicker}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:text-indigo-400"
                >
                  {coverBusy === "upload" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {cover ? "Replace Cover" : "Upload Cover"}
                </button>
                {cover && (
                  <button
                    type="button"
                    disabled={!!coverBusy}
                    onClick={removeCover}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-all hover:border-red-500 hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    {coverBusy === "remove" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Remove
                  </button>
                )}
                <span className="text-xs text-gray-500 dark:text-zinc-400">
                  Jpg, Png Or Webp, Max 3 Mb
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={pickCover}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>What You&apos;ll Learn</label>
                <span className={counterCls(learn.length, 8)}>
                  {learn.length} / 8
                </span>
              </div>
              {learn.map((item, i) => (
                <div key={i} className="flex items-center gap-2 pb-2">
                  <span className="w-5 shrink-0 text-right text-xs text-gray-400 dark:text-zinc-500">
                    {i + 1}.
                  </span>
                  <input
                    value={item}
                    maxLength={200}
                    onChange={(e) => editLearn(i, e.target.value)}
                    placeholder="A key takeaway students will gain"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    disabled={learn.length <= 1}
                    onClick={() => removeLearn(i)}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLearn}
                className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-800 dark:hover:text-indigo-400"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>
        </motion.section>

        <AiOutline />

        {courseId && <Curriculum courseId={courseId} modules={modList} />}
        {!courseId && (
          <section className="rounded-xl border-2 border-dashed border-gray-300 px-4 py-10 text-center dark:border-zinc-700">
            <h2 className="text-lg font-semibold">3. Curriculum</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              Save The Draft First To Add Modules And Lessons.
            </p>
          </section>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24">
        <motion.div
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: "easeOut", delay: 0.15}}
          className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h3 className="text-sm font-semibold">Course Publication</h3>
          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              disabled={!!busy}
              onClick={submit}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "submit" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {busy === "submit" ? "Submitting" : "Submit For Review"}
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={saveDraft}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:text-indigo-400"
            >
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy === "save" ? "Saving" : "Save Draft"}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-zinc-400">
            Admin will review your course before it is published.
          </p>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: "easeOut", delay: 0.25}}
          className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Readiness</h3>
            <span className="text-xs font-medium tabular-nums text-indigo-600 dark:text-indigo-400">
              {doneCount} / {checks.length}
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
            <motion.div
              animate={{width: `${(doneCount / checks.length) * 100}%`}}
              transition={{duration: 0.4, ease: "easeOut"}}
              className="h-full rounded-full bg-indigo-600"
            />
          </div>
          <ul className="space-y-2.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    c.ok
                      ? "bg-emerald-500 text-white"
                      : "border border-gray-300 dark:border-zinc-700"
                  }`}
                >
                  {c.ok && <Check className="h-3 w-3" />}
                </span>
                <span
                  className={`transition-colors ${c.ok ? "" : "text-gray-500 dark:text-zinc-400"}`}
                >
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35, ease: "easeOut", delay: 0.35}}
          className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h3 className="mb-3 text-sm font-semibold">Course Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((x) => (
              <div
                key={x.label}
                className="rounded-xl border border-gray-200 p-3 text-center transition-colors hover:border-indigo-500 dark:border-zinc-800"
              >
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {x.label}
                </p>
                <p
                  className={`mt-1 text-lg font-semibold tabular-nums ${
                    x.accent ? "text-indigo-600 dark:text-indigo-400" : ""
                  }`}
                >
                  {x.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </aside>
    </div>
  )
}
