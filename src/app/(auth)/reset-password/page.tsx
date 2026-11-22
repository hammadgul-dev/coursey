"use client"
import {Suspense, useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion} from "framer-motion"
import {Eye, EyeOff, GraduationCap, LinkIcon} from "lucide-react"
import {useRouter, useSearchParams} from "next/navigation"

let inputCls =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-[#4F46E5]/50 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"

function PasswordInput({value, onChange}: any) {
  let [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className={`${inputCls} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

function ResetForm() {
  let router = useRouter()
  let params = useSearchParams()
  let token = params?.get("token") || ""
  let [loading, setLoading] = useState(false)
  let [password, setPassword] = useState("")
  let [confirm, setConfirm] = useState("")

  let submit = async (ev: any) => {
    ev.preventDefault()
    if (loading) return

    if (!password || !confirm) {
      toast.error("All Fields Are Required")
      return
    }
    if (password !== confirm) {
      toast.error("Passwords Do Not Match")
      return
    }

    setLoading(true)
    try {
      let res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token, password}),
      })
      let data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(data?.error || "Something Went Wrong")
        setLoading(false)
        return
      }

      toast.success("Password Reset, Please Log In")
      router.replace("/login")
    } catch {
      toast.error("Something Went Wrong")
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <LinkIcon size={22} />
        </span>
        <p className="text-sm font-medium">Invalid Or Expired Link</p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-medium text-[#4F46E5] hover:underline"
        >
          Request A New Link
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium">New Password</label>
        <PasswordInput
          value={password}
          onChange={(ev: any) => setPassword(ev.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">
          Confirm Password
        </label>
        <PasswordInput
          value={confirm}
          onChange={(ev: any) => setConfirm(ev.target.value)}
        />
      </div>
      <motion.button
        whileTap={{scale: 0.98}}
        type="submit"
        disabled={loading}
        className="h-10 w-full cursor-pointer rounded-xl bg-[#4F46E5] text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md hover:shadow-[#4F46E5]/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </motion.button>
    </form>
  )
}

export default function ResetPasswordPage() {
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
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Choose A New Password
        </p>
      </div>

      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>

      <Link
        href="/login"
        className="mt-4 block text-center text-sm font-medium text-[#4F46E5] hover:underline"
      >
        Back To Log In
      </Link>
    </motion.div>
  )
}
