"use client"
import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion} from "framer-motion"
import {ArrowLeft, GraduationCap, MailCheck} from "lucide-react"

let inputCls =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-[#4F46E5]/50 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"

export default function ForgotPasswordPage() {
  let [loading, setLoading] = useState(false)
  let [sent, setSent] = useState(false)
  let [email, setEmail] = useState("")

  let submit = async (ev: any) => {
    ev.preventDefault()
    if (loading) return

    let value = (email || "").trim().toLowerCase()
    if (!value) {
      toast.error("Email Is Required")
      return
    }

    setLoading(true)
    try {
      let res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: value}),
      })
      let data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(data?.error || "Something Went Wrong")
        setLoading(false)
        return
      }

      setSent(true)
      setLoading(false)
    } catch {
      toast.error("Something Went Wrong")
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.97}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.35}}
      className="w-full rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="mb-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
            <GraduationCap size={16} />
          </span>
          <span className="font-semibold">Coursey</span>
        </div>
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          We Will Email You A Reset Link
        </p>
      </div>

      {sent ? (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{type: "spring", stiffness: 300, damping: 24}}
          className="space-y-3 text-center"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5]">
            <MailCheck size={24} />
          </span>
          <p className="text-sm font-medium">Check Your Email</p>
          <p className="text-xs text-muted-foreground">
            If The Email Exists, A Reset Link Has Been Sent. The Link Works For
            1 Hour.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(ev: any) => setEmail(ev.target.value)}
              placeholder="alex@example.com"
              className={inputCls}
            />
          </div>
          <motion.button
            whileTap={{scale: 0.98}}
            type="submit"
            disabled={loading}
            className="h-10 w-full cursor-pointer rounded-xl bg-[#4F46E5] text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md hover:shadow-[#4F46E5]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:underline"
      >
        <ArrowLeft size={14} />
        Back To Log In
      </Link>
    </motion.div>
  )
}
