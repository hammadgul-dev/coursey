"use client"

import {motion} from "framer-motion"
import {BookOpen, Users, GraduationCap} from "lucide-react"

const stats = [
  {
    label: "450+ Courses",
    sub: "Bite-sized, reading-first modules",
    icon: BookOpen,
  },
  {label: "85,000+ Students", sub: "Active readers worldwide", icon: Users},
  {
    label: "1,200+ Instructors",
    sub: "Industry engineers & researchers",
    icon: GraduationCap,
  },
]

const container = {
  hidden: {},
  show: {
    transition: {staggerChildren: 0.15},
  },
}

const item = {
  hidden: {opacity: 0, y: 24},
  show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: "easeOut"}},
}

export default function Stats() {
  return (
    <section className="bg-surface-tint py-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{once: true}}
        className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{y: -4}}
              className="bg-background border border-border rounded-xl p-6 text-center transition-colors duration-200 hover:border-primary/40"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-lg">{stat.label}</p>
              <p className="text-text-muted text-sm">{stat.sub}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
