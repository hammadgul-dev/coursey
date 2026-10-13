"use client"

import {useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {Ban, Search, ShieldCheck, Trash2} from "lucide-react"
import {adminUsers} from "@/data/adminData"

let tabs = [
  {key: "all", label: "All"},
  {key: "student", label: "Students"},
  {key: "instructor", label: "Instructors"},
]

let initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export default function UsersTable() {
  let [users, setUsers] = useState(adminUsers as any[])
  let [tab, setTab] = useState("all")
  let [query, setQuery] = useState("")
  let [confirmId, setConfirmId] = useState(null as any)

  let showRole = tab === "all"

  let cols = showRole
    ? "md:grid-cols-[2fr_1fr_1.2fr_1fr_auto]"
    : "md:grid-cols-[2fr_1.2fr_1fr_auto]"

  let count = (k: string) =>
    k === "all" ? users.length : users.filter((u: any) => u.role === k).length

  let list = users.filter(
    (u: any) =>
      (tab === "all" || u.role === tab) &&
      (u.name + u.email).toLowerCase().includes(query.toLowerCase()),
  )

  let toggleBan = (id: any) => {
    let u = users.find((x: any) => x.id === id)
    setUsers((p: any) =>
      p.map((x: any) => (x.id === id ? {...x, banned: !x.banned} : x)),
    )
    toast.success(u.banned ? "User unbanned" : "User banned")
  }

  let removeUser = (id: any) => {
    setUsers((p: any) => p.filter((x: any) => x.id !== id))
    setConfirmId(null)
    toast.success("User removed")
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
                tab === t.key
                  ? "text-white"
                  : "text-gray-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="users-tab"
                  transition={{type: "spring", stiffness: 400, damping: 32}}
                  className="absolute inset-0 rounded-lg bg-indigo-600"
                />
              )}
              <span className="relative">
                {t.label} ({count(t.key)})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div
          className={`hidden gap-4 border-b border-gray-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-zinc-800 dark:text-zinc-400 md:grid ${cols}`}
        >
          <span>
            {tab === "student"
              ? "Student"
              : tab === "instructor"
                ? "Instructor"
                : "User"}
          </span>
          {showRole && <span>Role</span>}
          <span>Joined</span>
          <span>Status</span>
          <span className="w-20 text-right">Actions</span>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {list.map((u: any) => (
            <motion.div
              key={u.id}
              layout
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, x: -24}}
              transition={{duration: 0.25, ease: "easeOut"}}
              className="border-b border-gray-100 transition-colors duration-200 last:border-b-0 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
            >
              <div
                className={`grid grid-cols-2 items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-5 sm:py-4 ${cols}`}
              >
                <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 sm:h-9 sm:w-9 sm:text-xs">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-50">
                      {u.name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
                      {u.email}
                    </p>
                  </div>
                </div>

                {showRole && (
                  <div>
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${
                        u.role === "instructor"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                  {u.joined}
                </p>
                <div>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                      u.banned
                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }`}
                  >
                    {u.banned ? "Banned" : "Active"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1 md:w-20">
                  <button
                    onClick={() => toggleBan(u.id)}
                    aria-label={u.banned ? "Unban user" : "Ban user"}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  >
                    {u.banned ? <ShieldCheck size={16} /> : <Ban size={16} />}
                  </button>
                  <button
                    onClick={() =>
                      setConfirmId(confirmId === u.id ? null : u.id)
                    }
                    aria-label="Remove user"
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {confirmId === u.id && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.2}}
                    className="overflow-hidden"
                  >
                    <div className="mx-3 mb-3 flex flex-col gap-3 rounded-lg border border-red-200 p-3 dark:border-red-500/30 sm:mx-5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-red-600 dark:text-red-400 sm:text-sm">
                        This account will be permanently removed. Continue?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 sm:flex-none sm:text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => removeUser(u.id)}
                          className="flex-1 cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95 sm:flex-none sm:text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            {tab === "student"
              ? "No students found"
              : tab === "instructor"
                ? "No instructors found"
                : "No users found"}
          </p>
        )}
      </div>
    </div>
  )
}
