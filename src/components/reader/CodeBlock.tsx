"use client"

import {useState} from "react"
import {Check, Copy} from "lucide-react"

export default function CodeBlock({code, file}: any) {
  let [copied, setCopied] = useState(false)

  let copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-300 hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/50">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
        <span className="text-xs text-gray-500 dark:text-gray-400">{file}</span>
        <button
          onClick={copy}
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600 active:scale-95 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:text-indigo-400"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-gray-800 dark:text-gray-200">
        {code.split("\n").map((line: string, i: number) => (
          <div key={i} className="flex gap-4">
            <span className="w-5 shrink-0 select-none text-right text-gray-400">
              {i + 1}
            </span>
            <code className="whitespace-pre">{line}</code>
          </div>
        ))}
      </pre>
    </div>
  )
}
