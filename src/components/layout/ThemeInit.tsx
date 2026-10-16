"use client"

import {useLayoutEffect} from "react"

export default function ThemeInit() {
  useLayoutEffect(() => {
    try {
      if (localStorage.getItem("theme") === "light") {
        document.documentElement.classList.remove("dark")
      }
    } catch (e) {}
  }, [])

  return null
}
