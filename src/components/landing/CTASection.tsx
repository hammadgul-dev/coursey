"use client"

import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 dark:from-primary/80 dark:to-primary/60 py-20">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <motion.div
        initial={{opacity: 0, y: 24, scale: 0.97}}
        whileInView={{opacity: 1, y: 0, scale: 1}}
        viewport={{once: true}}
        transition={{duration: 0.6, ease: "easeOut"}}
        className="relative max-w-[700px] mx-auto px-6 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-3">Ready to start learning?</h2>
        <p className="text-white/80 mb-6">
          Join over 85,000 learners mastering new topics with distraction-free
          lessons.
        </p>
        <motion.div
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.97}}
          className="inline-block"
        >
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
          >
            Sign Up Free
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
