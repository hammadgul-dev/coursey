"use client"

import {useEffect, useRef, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {Ban, Search, ShieldCheck} from "lucide-react"
import {request} from "@/lib/request"

let tabs = [
  {key: "", label: "All"},
  {key: "STUDENT", label: "Students"},
  {key: "INSTRUCTOR", label: "Instructors"},
]

let initials = (n: string) =>
  (n || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

let fmt = (d: any) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default function UsersTable({counts}: {counts: any}) {
  let [users, setUsers] = useState([] as any[])
  let [tab, setTab] = useState("")
  let [query, setQuery] = useState("")
  let [search, setSearch] = useState("")
  let [page, setPage] = useState(1)
  let [totalPages, setTotalPages] = useState(1)
  let [loading, setLoading] = useState(true)
  let [busyId, setBusyId] = useState(null as any)
  let reqId = useRef(0)

  let showRole = tab === ""

  let cols = showRole
    ? "md:grid-cols-[2fr_1fr_1.2fr_1fr_auto]"
    : "md:grid-cols-[2fr_1.2fr_1fr_auto]"

  let count = (k: string) => {
    if (k === "STUDENT") return counts?.students || 0
    if (k === "INSTRUCTOR") return counts?.instructors || 0
    return (counts?.students || 0) + (counts?.instructors || 0)
  }

  useEffect(() => {
    let t = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let id = ++reqId.current
    let run = async () => {
      setLoading(true)
      let url = `/api/admin/users?page=${page}&limit=10`
      if (tab) url += `&role=${tab}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      let res: any = await request(url, "GET")
      if (id !== reqId.current) return
      if (res?.ok) {
        setUsers(res?.data?.users || [])
        setTotalPages(res?.data?.totalPages || 1)
      } else {
        toast.error(res?.error || "Something Went Wrong")
      }
      setLoading(false)
    }
    run()
  }, [tab, search, page])

  let changeTab = (k: string) => {
    setTab(k)
    setPage(1)
  }

  let toggleBan = async (u: any) => {
    setBusyId(u.id)
    let res: any = await request(`/api/admin/users/${u.id}/ban`, "POST", {
      banned: !u.banned,
    })
    setBusyId(null)
    if (!res?.ok) {
      toast.error(res?.error || "Something Went Wrong")
      return
    }
    setUsers((p: any) =>
      p.map((x: any) => (x.id === u.id ? {...x, banned: !u.banned} : x)),
    )
    toast.success(u.banned ? "User Unbanned" : "User Banned")
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
            maxLength={100}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900 sm:w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
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
            {tab === "STUDENT"
              ? "Student"
              : tab === "INSTRUCTOR"
                ? "Instructor"
                : "User"}
          </span>
          {showRole && <span>Role</span>}
          <span>Joined</span>
          <span>Status</span>
          <span className="w-16 text-right">Actions</span>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {users.map((u: any) => (
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
                        u.role === "INSTRUCTOR"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {(u.role || "").toLowerCase()}
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
                  {fmt(u.createdAt)}
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
                <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1 md:w-16">
                  <button
                    onClick={() => toggleBan(u)}
                    disabled={busyId === u.id}
                    aria-label={u.banned ? "Unban User" : "Ban User"}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  >
                    {u.banned ? <ShieldCheck size={16} /> : <Ban size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && users.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            Loading...
          </p>
        )}

        {!loading && users.length === 0 && (
          <p className="px-5 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            {tab === "STUDENT"
              ? "No Students Found"
              : tab === "INSTRUCTOR"
                ? "No Instructors Found"
                : "No Users Found"}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            Page {page} Of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
