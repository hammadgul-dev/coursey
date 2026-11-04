"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import CodeBlock from "./CodeBlock"

let components: any = {
  h1: ({children}: any) => (
    <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
      {children}
    </h2>
  ),
  h2: ({children}: any) => (
    <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
      {children}
    </h2>
  ),
  h3: ({children}: any) => (
    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
      {children}
    </h3>
  ),
  p: ({children}: any) => (
    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
      {children}
    </p>
  ),
  ul: ({children}: any) => (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({children}: any) => (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  blockquote: ({children}: any) => (
    <blockquote className="mt-4 rounded-r-xl border-l-4 border-indigo-600 bg-indigo-50/60 px-4 py-1 dark:bg-indigo-500/10">
      {children}
    </blockquote>
  ),
  a: ({href, children}: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
    >
      {children}
    </a>
  ),
  strong: ({children}: any) => (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),
  table: ({children}: any) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({children}: any) => (
    <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold dark:border-gray-800 dark:bg-gray-900">
      {children}
    </th>
  ),
  td: ({children}: any) => (
    <td className="border border-gray-200 px-3 py-2 dark:border-gray-800">
      {children}
    </td>
  ),
  pre: ({children}: any) => <div className="mt-4">{children}</div>,
  code: ({className, children}: any) => {
    let text = String(children || "").replace(/\n$/, "")
    let lang = /language-(\w+)/.exec(className || "")?.[1] || ""
    if (lang || text.includes("\n")) {
      return <CodeBlock code={text} file={lang || "code"} />
    }
    return (
      <code className="rounded bg-indigo-50 px-1.5 py-0.5 text-[13px] font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
        {text}
      </code>
    )
  },
}

export default function LessonContent({content}: any) {
  if (!content) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This Lesson Has No Content Yet
      </p>
    )
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
