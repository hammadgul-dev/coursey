import Link from "next/link"
import {ArrowLeft} from "lucide-react"

export default function AuthLayout({children}: any) {
  return (
    <div className="h-dvh overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 py-4">
        <Link
          href="/"
          className="group flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to home
        </Link>
        <main className="flex flex-1 items-center py-3">{children}</main>
      </div>
    </div>
  )
}
