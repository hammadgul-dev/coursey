"use client"

import {useEffect, useRef, useState} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import {AnimatePresence, motion} from "framer-motion"
import toast from "react-hot-toast"
import {
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"

let SOUND_OPEN = "chat-open"
let SOUND_SEND = "chat-send"
let SOUND_RECEIVE = "chat-receive"
let SOUND_KEY = "coursey-chat-sound"

let SUGGESTIONS = [
  "Summarize This Lesson",
  "Explain The Main Idea Simply",
  "Give Me A Simple Example",
]

let play = (name: string) => {
  try {
    let a = new Audio(`/sounds/${name}.mp3`)
    a.volume = 0.5
    a.play().catch(() => {})
  } catch {}
}

let mdComponents: any = {
  p: ({children}: any) => <p className="mt-2 first:mt-0">{children}</p>,
  ul: ({children}: any) => (
    <ul className="mt-2 list-disc space-y-1 pl-4">{children}</ul>
  ),
  ol: ({children}: any) => (
    <ol className="mt-2 list-decimal space-y-1 pl-4">{children}</ol>
  ),
  strong: ({children}: any) => (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),
  a: ({children}: any) => <span>{children}</span>,
  pre: ({children}: any) => (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-200/70 p-2.5 text-xs dark:bg-gray-800">
      {children}
    </pre>
  ),
  code: ({children}: any) => (
    <code className="rounded bg-indigo-50 px-1 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
      {children}
    </code>
  ),
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
          style={{animationDelay: `${i * 150}ms`}}
        />
      ))}
    </span>
  )
}

export default function LessonChat({lessonId}: any) {
  let [open, setOpen] = useState(false)
  let [msgs, setMsgs] = useState([] as any[])
  let [text, setText] = useState("")
  let [busy, setBusy] = useState(false)
  let [muted, setMuted] = useState(false)
  let [nudge, setNudge] = useState(false)
  let bottomRef = useRef(null as any)
  let areaRef = useRef(null as any)

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(SOUND_KEY) === "off")
    } catch {}
  }, [])

  useEffect(() => {
    let show = setTimeout(() => setNudge(true), 2500)
    let hide = setTimeout(() => setNudge(false), 9500)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: busy ? "auto" : "smooth",
      block: "end",
    })
  }, [msgs, open, busy])

  useEffect(() => {
    let el = areaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 96) + "px"
  }, [text, open])

  useEffect(() => {
    if (!open) return
    let onEsc = (e: any) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [open])

  let beep = (name: string) => {
    if (!muted) play(name)
  }

  let toggleSound = () => {
    let next = !muted
    setMuted(next)
    try {
      localStorage.setItem(SOUND_KEY, next ? "off" : "on")
    } catch {}
  }

  let toggleOpen = () => {
    if (!open) beep(SOUND_OPEN)
    setNudge(false)
    setOpen(!open)
  }

  let clearChat = () => {
    if (busy) return
    setMsgs([])
  }

  let dropLast = () => setMsgs((p: any) => p.slice(0, -2))

  let send = async (override?: string) => {
    let q = String(override || text).trim()
    if (!q || busy) return
    let history = msgs
      .slice(-6)
      .map((m: any) => ({
        role: m.role,
        content: String(m.content || "").slice(0, 500),
      }))
      .filter((m: any) => m.content)

    beep(SOUND_SEND)
    setMsgs((p: any) => [
      ...p,
      {role: "user", content: q},
      {role: "assistant", content: ""},
    ])
    setText("")
    setBusy(true)
    let acc = ""
    let first = true
    try {
      let res = await fetch(`/api/student/lessons/${lessonId}/ai/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question: q, history}),
      })
      if (!res.ok) {
        let data = await res.json().catch(() => null)
        toast.error(data?.error || "Something Went Wrong")
        dropLast()
        setText(q)
        return
      }
      let reader: any = res.body?.getReader()
      if (!reader) {
        toast.error("Something Went Wrong")
        dropLast()
        setText(q)
        return
      }
      let decoder = new TextDecoder()
      while (true) {
        let {done, value} = await reader.read()
        if (done) break
        acc += decoder.decode(value, {stream: true})
        if (first && acc.trim()) {
          first = false
          beep(SOUND_RECEIVE)
        }
        let snap = acc
        setMsgs((p: any) => {
          let c = [...p]
          c[c.length - 1] = {role: "assistant", content: snap}
          return c
        })
      }
      if (!acc.trim()) {
        toast.error("AI Response Invalid")
        dropLast()
        setText(q)
      }
    } catch {
      toast.error("Something Went Wrong")
      if (!acc.trim()) {
        dropLast()
        setText(q)
      }
    } finally {
      setBusy(false)
    }
  }

  let onKey = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <AnimatePresence>
        {nudge && !open && (
          <motion.div
            initial={{opacity: 0, x: 12, scale: 0.95}}
            animate={{opacity: 1, x: 0, scale: 1}}
            exit={{opacity: 0, x: 12, scale: 0.95}}
            transition={{duration: 0.25, ease: "easeOut"}}
            className="fixed bottom-6 right-20 z-30 max-w-[200px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            Stuck? Ask AI About This Lesson
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileHover={{scale: 1.07}}
        whileTap={{scale: 0.9}}
        transition={{type: "spring", stiffness: 400, damping: 20}}
        className="fixed bottom-4 right-4 z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-colors duration-200 hover:bg-indigo-700"
      >
        {!open && msgs.length === 0 && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/40" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{rotate: -90, opacity: 0, scale: 0.6}}
            animate={{rotate: 0, opacity: 1, scale: 1}}
            exit={{rotate: 90, opacity: 0, scale: 0.6}}
            transition={{duration: 0.18}}
            className="flex"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, y: 24, scale: 0.9}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 24, scale: 0.9}}
            transition={{type: "spring", stiffness: 380, damping: 30}}
            className="fixed inset-x-3 bottom-[5.5rem] z-30 flex h-[min(70vh,560px)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:inset-x-auto sm:right-4 sm:w-[400px]"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Sparkles size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  Ask AI Tutor
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Answers From This Lesson Only
                </p>
              </div>
              {msgs.length > 0 && (
                <button
                  onClick={clearChat}
                  disabled={busy}
                  title="Clear Chat"
                  className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                >
                  <RotateCcw size={15} />
                </button>
              )}
              <button
                onClick={toggleSound}
                title={muted ? "Sound Off" : "Sound On"}
                className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {msgs.length === 0 && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1, duration: 0.3}}
                  className="flex h-full flex-col items-center justify-center text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                    <Sparkles size={22} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Ask Anything About This Lesson
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Try One Of These To Start
                  </p>
                  <div className="mt-4 flex w-full flex-col gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2 + i * 0.07, duration: 0.25}}
                        onClick={() => send(s)}
                        disabled={busy}
                        className="w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {msgs.map((m: any, i: number) => {
                if (m.role === "user") {
                  return (
                    <motion.div
                      key={i}
                      initial={{opacity: 0, y: 10, scale: 0.97}}
                      animate={{opacity: 1, y: 0, scale: 1}}
                      transition={{duration: 0.2, ease: "easeOut"}}
                      className="flex justify-end"
                    >
                      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-indigo-600 px-3.5 py-2 text-sm text-white shadow-sm">
                        {m.content}
                      </p>
                    </motion.div>
                  )
                }
                return (
                  <motion.div
                    key={i}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.25, ease: "easeOut"}}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      <Sparkles size={12} />
                    </span>
                    <div className="max-w-[88%] break-words rounded-2xl rounded-tl-md bg-gray-100 px-3.5 py-2 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {m.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={mdComponents}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <TypingDots />
                      )}
                    </div>
                  </motion.div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-end gap-2 rounded-xl border border-gray-300 bg-white p-1.5 transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 dark:border-gray-700 dark:bg-gray-900">
                <textarea
                  ref={areaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKey}
                  maxLength={500}
                  rows={1}
                  placeholder="Ask A Question About This Lesson"
                  className="max-h-24 w-full resize-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                />
                <motion.button
                  onClick={() => send()}
                  disabled={busy || !text.trim()}
                  whileTap={{scale: 0.88}}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={15} />
                </motion.button>
              </div>
              <p className="mt-1.5 px-1 text-[11px] text-gray-400 dark:text-gray-500">
                {text.length}/500 · AI Can Make Mistakes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
