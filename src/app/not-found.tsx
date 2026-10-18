import Link from "next/link"
import {Home, ArrowRight} from "lucide-react"
import NotFoundScene from "@/components/not-found/NotFoundScene"

export const metadata = {
  title: "Page not found | Coursey",
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center overflow-hidden px-4 py-6 text-center sm:py-10">
      <div className="fade-up w-full">
        <NotFoundScene />
      </div>

      <span
        className="fade-up rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-600 sm:px-4 sm:py-1.5 sm:text-xs dark:border-zinc-800 dark:text-indigo-400"
        style={{animationDelay: "100ms"}}
      >
        Error 404
      </span>
      <h1
        className="fade-up mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:mt-4 sm:text-4xl dark:text-white"
        style={{animationDelay: "180ms"}}
      >
        Page not found
      </h1>
      <p
        className="fade-up mt-2 max-w-md text-xs leading-relaxed text-gray-600 sm:mt-3 sm:text-base dark:text-zinc-400"
        style={{animationDelay: "260ms"}}
      >
        This page doesn't exist or has been moved. Head back home or find
        something to learn.
      </p>

      <div
        className="fade-up mt-5 flex w-full flex-col items-center justify-center gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:gap-3"
        style={{animationDelay: "340ms"}}
      >
        <Link
          href="/"
          className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-95 sm:w-auto sm:px-6 sm:py-3"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/courses"
          className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 sm:w-auto sm:px-6 sm:py-3 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          Browse Courses
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  )
}
