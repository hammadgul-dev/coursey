"use client"

import {useEffect} from "react"
import {motion, useMotionValue, useSpring, useTransform} from "framer-motion"
import {BookOpen, Search, HelpCircle} from "lucide-react"

export default function NotFoundScene() {
  let x = useMotionValue(0)
  let y = useMotionValue(0)
  let sx = useSpring(x, {stiffness: 110, damping: 16})
  let sy = useSpring(y, {stiffness: 110, damping: 16})

  let rotateY = useTransform(sx, [-1, 1], [-22, 22])
  let rotateX = useTransform(sy, [-1, 1], [16, -16])
  let eyeX = useTransform(sx, [-1, 1], [-5, 5])
  let eyeY = useTransform(sy, [-1, 1], [-5, 5])
  let mouthX = useTransform(sx, [-1, 1], [-3, 3])
  let digitX = useTransform(sx, [-1, 1], [-28, 28])
  let digitY = useTransform(sy, [-1, 1], [-18, 18])
  let iconX = useTransform(sx, [-1, 1], [36, -36])
  let iconY = useTransform(sy, [-1, 1], [24, -24])
  let shadowX = useTransform(sx, [-1, 1], [14, -14])

  useEffect(() => {
    let move = (e: any) => {
      x.set((e?.clientX / window.innerWidth - 0.5) * 2)
      y.set((e?.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [x, y])

  let eye =
    "absolute top-[34%] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white sm:h-8 sm:w-8"
  let pupil = "h-3 w-3 rounded-full bg-zinc-900 sm:h-4 sm:w-4"

  return (
    <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[380px]">
      <motion.span
        style={{x: digitX, y: digitY}}
        className="pointer-events-none absolute select-none text-[8.5rem] font-extrabold leading-none tracking-tighter text-indigo-600/10 sm:text-[15rem] dark:text-indigo-500/15"
      >
        404
      </motion.span>

      <motion.div
        style={{x: iconX, y: iconY}}
        className="pointer-events-none absolute inset-0"
      >
        <BookOpen className="absolute left-[8%] top-[18%] h-6 w-6 text-indigo-500/50 sm:h-8 sm:w-8" />
        <Search className="absolute right-[10%] top-[26%] h-5 w-5 text-indigo-500/50 sm:h-7 sm:w-7" />
        <HelpCircle className="absolute bottom-[22%] right-[18%] h-6 w-6 text-indigo-500/50 sm:h-8 sm:w-8" />
      </motion.div>

      <div style={{perspective: 900}} className="relative z-10">
        <motion.div
          animate={{y: [0, -14, 0]}}
          transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
        >
          <motion.div
            style={{rotateX, rotateY, transformStyle: "preserve-3d"}}
            className="relative h-[170px] w-[144px] sm:h-[210px] sm:w-[176px]"
          >
            <svg viewBox="0 0 160 190" className="h-full w-full">
              <defs>
                <radialGradient id="ghostBody" cx="35%" cy="25%" r="85%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="55%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#3730A3" />
                </radialGradient>
              </defs>
              <path
                d="M10 90 C10 40 45 10 80 10 C115 10 150 40 150 90 L150 170 Q135 150 120 170 Q100 190 80 170 Q60 190 40 170 Q25 150 10 170 Z"
                fill="url(#ghostBody)"
              />
              <ellipse
                cx="52"
                cy="40"
                rx="20"
                ry="10"
                fill="#fff"
                opacity="0.25"
                transform="rotate(-25 52 40)"
              />
              <ellipse
                cx="8"
                cy="105"
                rx="9"
                ry="15"
                fill="#4338CA"
                transform="rotate(20 8 105)"
              />
              <ellipse
                cx="152"
                cy="105"
                rx="9"
                ry="15"
                fill="#4338CA"
                transform="rotate(-20 152 105)"
              />
            </svg>

            <motion.div style={{z: 40}} className="absolute inset-0">
              <div className={`${eye} left-[24%]`}>
                <motion.span style={{x: eyeX, y: eyeY}} className={pupil} />
              </div>
              <div className={`${eye} right-[24%]`}>
                <motion.span style={{x: eyeX, y: eyeY}} className={pupil} />
              </div>
              <span className="absolute left-[14%] top-[54%] h-2.5 w-4 rounded-full bg-pink-300/70" />
              <span className="absolute right-[14%] top-[54%] h-2.5 w-4 rounded-full bg-pink-300/70" />
              <motion.span
                style={{x: mouthX}}
                className="absolute left-1/2 top-[58%] h-4 w-3 -translate-x-1/2 rounded-full bg-indigo-950/70 sm:h-5 sm:w-4"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{x: shadowX}}
          animate={{scale: [1, 0.78, 1], opacity: [0.35, 0.18, 0.35]}}
          transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
          className="mx-auto mt-3 h-3 w-24 rounded-full bg-gray-900 blur-sm sm:w-32 dark:bg-black"
        />
      </div>
    </div>
  )
}
