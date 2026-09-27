"use client"

import {motion} from "framer-motion"
import Image from "next/image"
import {Button} from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-center md:text-left">
          <span className="text-primary">Learn Anything</span>
          <span className="text-text">, One Lesson at a Time</span>
        </h1>

        <p className="text-text-secondary text-justify text-sm mb-6 max-w-md">
          Free, text-based courses built by instructors and powered by AI to
          help you learn faster without scrubbing through endless video
          timelines.
        </p>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Browse Courses
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="transition-all duration-200 hover:bg-accent hover:border-primary hover:-translate-y-0.5"
          >
            Become an Instructor
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{opacity: 0, scale: 0.9, rotate: -2}}
        animate={{opacity: 1, scale: 1, rotate: 0}}
        transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
        whileHover={{scale: 1.02}}
        className="relative bg-surface-tint rounded-2xl p-4 border border-border overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <Image
          src="/images/hero.png"
          alt="Student learning"
          width={560}
          height={360}
          className="relative rounded-lg w-full h-auto"
          priority
        />
      </motion.div>
    </section>
  )
}
