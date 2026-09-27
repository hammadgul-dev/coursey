"use client"

import {motion} from "framer-motion"
import {Sparkles, Bot, Gauge} from "lucide-react"

const features = [
  {
    title: "100% Free",
    desc: "High-quality education without paywalls, upsells, or locked chapters.",
    icon: Sparkles,
  },
  {
    title: "AI-Powered Learning",
    desc: "Ask questions inline, get real-time clarifications and comprehension checks.",
    icon: Bot,
  },
  {
    title: "Learn at Your Pace",
    desc: "Track progress down to the exact paragraph, bookmark and jump back in.",
    icon: Gauge,
  },
]

const container = {
  hidden: {},
  show: {
    transition: {staggerChildren: 0.15},
  },
}

const item = {
  hidden: {opacity: 0, y: 30, scale: 0.96},
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {duration: 0.5, ease: "easeOut"},
  },
}

export default function WhyCoursey() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20 text-center">
      <motion.h2
        initial={{opacity: 0, y: 10}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.5}}
        className="text-3xl font-bold mb-10"
      >
        Why Coursey
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{once: true}}
        className="grid md:grid-cols-3 gap-6 text-left"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{y: -6}}
              className="relative overflow-hidden bg-card border border-border rounded-xl p-6 transition-colors duration-200 hover:border-primary/40 group"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl transition-all duration-300 group-hover:bg-primary/10" />

              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-semibold mb-2 relative">{feature.title}</h3>
              <p className="text-text-secondary text-sm relative">
                {feature.desc}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
