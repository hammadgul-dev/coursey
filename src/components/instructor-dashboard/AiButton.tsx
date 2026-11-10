"use client"

import {Loader2, Sparkles} from "lucide-react"

export default function AiButton({
  label,
  busyLabel,
  busy,
  disabled,
  onClick,
  className,
}: any) {
  return (
    <button
      type="button"
      disabled={!!disabled || !!busy}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all hover:border-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 ${className || ""}`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {!busy && <Sparkles className="h-4 w-4" />}
      {busy ? busyLabel || label : label}
    </button>
  )
}
