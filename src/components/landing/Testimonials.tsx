"use client"

import {motion} from "framer-motion"
import {Quote, UserRound} from "lucide-react"

const testimonials = [
  {
    quote:
      "Coursey completely changed how I study. No more scrubbing through hour-long videos to find one explanation — I just read, and the AI answers my doubts instantly.",
    name: "John Doe",
    role: "Student",
  },
  {
    quote:
      "As an instructor, publishing a course here took a fraction of the time video platforms need. The review process was smooth and the AI moderation feedback was genuinely useful.",
    name: "Emily Carter",
    role: "Instructor",
  },
  {
    quote:
      "I retain information so much better reading at my own pace. The progress tracking down to the paragraph level is a small detail that makes a huge difference.",
    name: "Michael Johnson",
    role: "Student",
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

export default function Testimonials() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <motion.h2
        initial={{opacity: 0, y: 10}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5}}
        className="text-3xl font-bold text-center mb-10"
      >
        What Learners Say
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{once: true}}
        className="grid md:grid-cols-3 gap-6"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={item}
            whileHover={{y: -6}}
            className="bg-card border border-border rounded-xl p-6 transition-colors duration-200 hover:border-primary/40"
          >
            <Quote className="w-6 h-6 text-primary/30 mb-3" />
            <p className="text-text-secondary text-sm text-justify mb-5">
              {t.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserRound className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-text-muted text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
