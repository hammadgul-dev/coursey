"use client"
import {useState} from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import {motion} from "framer-motion"
import {Eye, EyeOff, GraduationCap} from "lucide-react"

let container = {hidden: {}, show: {transition: {staggerChildren: 0.06}}}
let item = {
  hidden: {opacity: 0, y: 10},
  show: {opacity: 1, y: 0, transition: {duration: 0.3}},
}

let inputCls =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-[#4F46E5]/50 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10"

function Field({label, children}: any) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
    </div>
  )
}

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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  )
}

export default function LoginPage() {
  let [form, setForm] = useState<any>({
    email: "",
    password: "",
    remember: false,
  })

  let set = (k: string, v: any) => setForm({...form, [k]: v})

  let submit = (ev: any) => {
    ev.preventDefault()
    toast.success("Logged in")
  }

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.97}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.35}}
      className="w-full rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <motion.form
        variants={container}
        initial="hidden"
        animate="show"
        onSubmit={submit}
        className="space-y-3"
      >
        <motion.div variants={item} className="mb-1 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
              <GraduationCap size={16} />
            </span>
            <span className="font-semibold">Coursey</span>
          </div>
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Log in to continue learning or teaching
          </p>
        </motion.div>

        <motion.div variants={item}>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(ev: any) => set("email", ev.target.value)}
              placeholder="alex@example.com"
              className={inputCls}
            />
          </Field>
        </motion.div>

        <motion.div variants={item}>
          <Field label="Password">
            <PasswordInput
              value={form.password}
              onChange={(ev: any) => set("password", ev.target.value)}
            />
          </Field>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center justify-between text-xs"
        >
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.remember}
              onClick={() => set("remember", !form.remember)}
              className={`flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all duration-200 active:scale-90 ${
                form.remember
                  ? "border-[#4F46E5] bg-[#4F46E5]"
                  : "border-border hover:border-[#4F46E5]/60"
              }`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                className={`transition-all duration-200 ${
                  form.remember ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <path
                  d="M2 6l3 3 5-6"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            Remember me
          </label>
          <Link href="#" className="font-medium text-[#4F46E5] hover:underline">
            Forgot password?
          </Link>
        </motion.div>

        <motion.button
          variants={item}
          whileTap={{scale: 0.98}}
          type="submit"
          className="h-10 w-full cursor-pointer rounded-xl bg-[#4F46E5] text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-md hover:shadow-[#4F46E5]/30"
        >
          Log In
        </motion.button>

        <motion.div
          variants={item}
          className="flex items-center gap-3 text-xs text-muted-foreground"
        >
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        <motion.button
          variants={item}
          whileTap={{scale: 0.98}}
          type="button"
          onClick={() => toast("Google login coming soon")}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4F46E5]/50 hover:shadow-md"
        >
          <GoogleIcon />
          Log in with Google
        </motion.button>

        <motion.p
          variants={item}
          className="pt-1 text-center text-sm text-muted-foreground"
        >
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#4F46E5] hover:underline"
          >
            Sign Up
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  )
}
