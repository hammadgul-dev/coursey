"use client"

import {motion} from "framer-motion"
import Link from "next/link"
import {GraduationCap} from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.5}}
      className="border-t border-border py-10"
    >
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>© 2026 Coursey Inc. All rights reserved.</p>

        <div className="flex items-center gap-2 transition-colors duration-200 hover:text-primary">
          <GraduationCap className="w-4 h-4" />
          <span>Learn without limits</span>
        </div>
      </div>
    </motion.footer>
  )
}
