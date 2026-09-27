"use client"

import {motion} from "framer-motion"
import {BookMarked, MessageCircleQuestion, BadgeCheck} from "lucide-react"

const steps = [
  {
    num: "01",
    title: "Browse & Enroll",
    desc: "Choose from hundreds of structured curricula.",
    icon: BookMarked,
  },
  {
    num: "02",
    title: "Read Lessons & Ask AI",
    desc: "Get contextual explanations without leaving the page.",
    icon: MessageCircleQuestion,
  },
  {
    num: "03",
    title: "Complete & Track Progress",
    desc: "Test understanding with recall quizzes and badges.",
    icon: BadgeCheck,
  },
]

const container = {
  hidden: {},
  show: {
    transition: {staggerChildren: 0.15},
  },
}

const item = {
  hidden: {opacity: 0, x: -24},
  show: {opacity: 1, x: 0, transition: {duration: 0.5, ease: "easeOut"}},
}

export default function HowItWorks() {
  return (
    <section className="bg-surface-tint py-20">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <span className="text-primary text-xs font-semibold uppercase">
          Workflow
        </span>
        <motion.h2
          initial={{opacity: 0, y: 10}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5}}
          className="text-3xl font-bold mt-2 mb-10"
        >
          How It Works
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{once: true}}
          className="grid md:grid-cols-3 gap-6 text-left"
        >
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                variants={item}
                whileHover={{y: -6}}
                className="relative bg-card border border-border rounded-xl p-6 transition-colors duration-200 hover:border-primary/40 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors duration-200">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
