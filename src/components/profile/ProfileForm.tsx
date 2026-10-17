"use client"

import {useRef, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {Camera, Check, Eye, EyeOff, Loader2, Lock, User} from "lucide-react"

let inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
let cardCls =
  "rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950"
let labelCls =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-zinc-300"
let tabs = [
  {id: "profile", label: "Profile", icon: User},
  {id: "security", label: "Security", icon: Lock},
]
let passFields = [
  {key: "current", label: "Current Password"},
  {key: "next", label: "New Password"},
  {key: "confirm", label: "Confirm New Password"},
]

export default function ProfileForm({user}: {user: any}) {
  let [tab, setTab] = useState("profile")
  let [name, setName] = useState(user?.name || "")
  let [headline, setHeadline] = useState(user?.headline || "")
  let [bio, setBio] = useState(user?.bio || "")
  let [avatar, setAvatar] = useState(user?.avatar || "")
  let [saving, setSaving] = useState(false)
  let [pass, setPass] = useState<any>({current: "", next: "", confirm: ""})
  let [show, setShow] = useState<any>({
    current: false,
    next: false,
    confirm: false,
  })
  let [changing, setChanging] = useState(false)
  let fileRef = useRef<any>(null)

  let initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  let dirty =
    name !== (user?.name || "") ||
    headline !== (user?.headline || "") ||
    bio !== (user?.bio || "") ||
    avatar !== (user?.avatar || "")

  function pickAvatar(e: any) {
    let file = e.target?.files?.[0]
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPG or PNG images are allowed")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB")
      return
    }
    setAvatar(URL.createObjectURL(file))
    e.target.value = ""
  }

  function discard() {
    setName(user?.name || "")
    setHeadline(user?.headline || "")
    setBio(user?.bio || "")
    setAvatar(user?.avatar || "")
  }

  async function saveProfile() {
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters")
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast.success("Profile updated")
  }

  async function changePassword() {
    if (!pass.current || !pass.next || !pass.confirm) {
      toast.error("Please fill all password fields")
      return
    }
    if (pass.next.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (pass.next === pass.current) {
      toast.error("New password must be different from current password")
      return
    }
    if (pass.next !== pass.confirm) {
      toast.error("Passwords do not match")
      return
    }
    setChanging(true)
    await new Promise((r) => setTimeout(r, 1000))
    setChanging(false)
    setPass({current: "", next: "", confirm: ""})
    toast.success("Password changed")
  }

  return (
    <div>
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {tabs.map((t: any) => {
          let Icon = t.icon
          let active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-95 ${
                active
                  ? "text-indigo-600 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-0 rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                  transition={{type: "spring", stiffness: 400, damping: 32}}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "profile" ? (
          <motion.div
            key="profile"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.2}}
            className="mt-4 space-y-4"
          >
            <div
              className={`${cardCls} flex flex-col items-center gap-4 sm:flex-row`}
            >
              <div className="group relative h-20 w-20 shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full border border-gray-200 object-cover dark:border-zinc-800"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
                    {initials || "U"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-600 transition-all duration-200 hover:border-indigo-500 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  Profile photo
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                  JPG or PNG, max 2 MB
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-300"
                >
                  Upload new
                </button>
                <AnimatePresence>
                  {avatar && (
                    <motion.button
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.9}}
                      type="button"
                      onClick={() => setAvatar("")}
                      className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-500 active:scale-95 dark:border-zinc-800"
                    >
                      Remove
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={pickAvatar}
                className="hidden"
              />
            </div>

            <div className={`${cardCls} space-y-4`}>
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className={inputCls}
                />
              </div>

              {user?.role === "instructor" && (
                <div>
                  <label className={labelCls}>Headline</label>
                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    maxLength={80}
                    placeholder="e.g. Senior Backend Engineer"
                    className={inputCls}
                  />
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-zinc-400">
                    Shown on your course pages.
                  </p>
                </div>
              )}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Bio
                  </label>
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    {bio.length} / 300
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end dark:border-zinc-800">
                <button
                  type="button"
                  onClick={discard}
                  disabled={!dirty || saving}
                  className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:text-indigo-300"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={!dirty || saving}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="security"
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.2}}
            className={`${cardCls} mt-4 space-y-4`}
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
                Change Password
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                Use at least 8 characters.
              </p>
            </div>

            {passFields.map((f: any) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <div className="relative">
                  <input
                    type={show[f.key] ? "text" : "password"}
                    value={pass[f.key]}
                    onChange={(e) =>
                      setPass({...pass, [f.key]: e.target.value})
                    }
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow({...show, [f.key]: !show[f.key]})}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors duration-200 hover:text-indigo-600 active:scale-95"
                  >
                    {show[f.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={changePassword}
                disabled={changing}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {changing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Update Password
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
