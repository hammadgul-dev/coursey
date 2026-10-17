"use client"

import {useRef, useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import toast from "react-hot-toast"
import {ChevronDown, ImagePlus, Plus, X} from "lucide-react"
import {categories, levels} from "@/data/courseEditor"
import AiOutline from "@/components/instructor-dashboard/AiOutline"

let inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600"

let labelCls = "mb-1.5 block text-sm font-medium"

let counterCls = (len: number, max: number) =>
  `text-xs tabular-nums transition-colors ${len >= max ? "text-amber-500" : "text-gray-400 dark:text-zinc-500"}`

export default function CourseEditor({course}: any) {
  let fileRef = useRef<any>(null)
  let [drag, setDrag] = useState(false)
  let [form, setForm] = useState<any>({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    level: course?.level || "",
    learn: course?.learn || [],
    modules: course?.modules || [],
    cover: null,
  })

  let setField = (key: string, value: any) =>
    setForm((prev: any) => ({...prev, [key]: value}))

  let pickFile = (file: any) => {
    if (!file) return
    if (!file.type?.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB")
      return
    }
    if (form?.cover?.url) URL.revokeObjectURL(form.cover.url)
    setField("cover", {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1),
      url: URL.createObjectURL(file),
    })
  }

  let removeCover = () => {
    if (form?.cover?.url) URL.revokeObjectURL(form.cover.url)
    setField("cover", null)
  }

  let addLearn = () => {
    if ((form?.learn?.length || 0) >= 8) {
      toast.error("Maximum 8 takeaways allowed")
      return
    }
    setField("learn", [
      ...(form?.learn || []),
      {id: `l${Date.now()}${Math.floor(Math.random() * 1000)}`, text: ""},
    ])
  }

  let editLearn = (id: string, text: string) =>
    setField(
      "learn",
      (form?.learn || []).map((item: any) =>
        item?.id === id ? {...item, text} : item,
      ),
    )

  let removeLearn = (id: string) =>
    setField(
      "learn",
      (form?.learn || []).filter((item: any) => item?.id !== id),
    )

  let applyOutline = (outline: any) => {
    let stamp = Date.now()
    setField(
      "modules",
      (outline || []).map((m: any, mi: number) => ({
        id: `m${stamp}${mi}`,
        title: m?.title || "",
        lessons: (m?.lessons || []).map((t: string, li: number) => ({
          id: `ls${stamp}${mi}${li}`,
          title: t,
          content: "",
          minutes: "",
          checkpoint: null,
        })),
      })),
    )
  }

  let titleLen = form?.title?.length || 0
  let descLen = form?.description?.length || 0
  let learnList = form?.learn || []

  return (
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
              <span className={counterCls(titleLen, 80)}>{titleLen} / 80</span>
            </div>
            <input
              value={form?.title || ""}
              maxLength={80}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Modern TypeScript Architecture"
              className={inputCls}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>
                Short Description <span className="text-rose-500">*</span>
              </label>
              <span className={counterCls(descLen, 300)}>{descLen} / 300</span>
            </div>
            <textarea
              value={form?.description || ""}
              maxLength={300}
              rows={4}
              onChange={(e) => setField("description", e.target.value)}
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
                  value={form?.category || ""}
                  onChange={(e) => setField("category", e.target.value)}
                  className={`${inputCls} cursor-pointer appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Select category
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
                  value={form?.level || ""}
                  onChange={(e) => setField("level", e.target.value)}
                  className={`${inputCls} cursor-pointer appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Select level
                  </option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Cover Image (16:9)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: any) => {
                pickFile(e.target.files?.[0])
                e.target.value = ""
              }}
            />
            <AnimatePresence mode="wait" initial={false}>
              {form?.cover ? (
                <motion.div
                  key="preview"
                  initial={{opacity: 0, scale: 0.97}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.97}}
                  transition={{duration: 0.2}}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-3 transition-colors hover:border-indigo-500 dark:border-zinc-800 sm:flex-row sm:items-center"
                >
                  <img
                    src={form?.cover?.url}
                    alt="Cover preview"
                    className="aspect-video w-full rounded-lg border border-gray-200 object-cover dark:border-zinc-800 sm:w-48"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {form?.cover?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {form?.cover?.size} MB
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-all hover:border-indigo-500 active:scale-95 dark:border-zinc-800"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeCover}
                        className="cursor-pointer rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:border-rose-500 active:scale-95 dark:border-rose-500/30 dark:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="drop"
                  type="button"
                  initial={{opacity: 0, scale: 0.97}}
                  animate={{opacity: 1, scale: drag ? 1.01 : 1}}
                  exit={{opacity: 0, scale: 0.97}}
                  transition={{duration: 0.2}}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e: any) => {
                    e.preventDefault()
                    setDrag(true)
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e: any) => {
                    e.preventDefault()
                    setDrag(false)
                    pickFile(e.dataTransfer?.files?.[0])
                  }}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 ${
                    drag
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5"
                      : "border-gray-300 dark:border-zinc-700"
                  }`}
                >
                  <ImagePlus className="h-6 w-6 text-indigo-500" />
                  <span className="text-sm font-medium">
                    Click or drag an image here
                  </span>
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    PNG, JPG or WEBP, up to 2 MB
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>What You&apos;ll Learn</label>
              <span className={counterCls(learnList.length, 8)}>
                {learnList.length} / 8
              </span>
            </div>
            <AnimatePresence initial={false}>
              {learnList.map((item: any, i: number) => (
                <motion.div
                  key={item?.id}
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.2}}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 pb-2">
                    <span className="w-5 shrink-0 text-right text-xs text-gray-400 dark:text-zinc-500">
                      {i + 1}.
                    </span>
                    <input
                      value={item?.text || ""}
                      onChange={(e) => editLearn(item?.id, e.target.value)}
                      placeholder="A key takeaway students will gain"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      disabled={learnList.length <= 1}
                      onClick={() => removeLearn(item?.id)}
                      className="cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-500/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addLearn}
              className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-all hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-800 dark:hover:text-indigo-400"
            >
              <Plus className="h-4 w-4" />
              Add item
            </button>
          </div>
        </div>
      </motion.section>

      <AiOutline onApply={applyOutline} />
    </div>
  )
}
