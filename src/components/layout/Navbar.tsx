"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {GraduationCap, Menu, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  let [open, setOpen] = useState(false)
  let [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    {href: "/courses", label: "Browse Courses"},
    {href: "/about", label: "About"},
    {href: "/why", label: "Why Coursey"},
    {href: "/how-it-works", label: "How It Works"},
  ]

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "mt-0 px-0" : "mt-4 px-4"}`}
    >
      <nav
        className={`bg-background/80 backdrop-blur border border-border mx-auto transition-all duration-300 ${
          scrolled ? "max-w-full rounded-none" : "max-w-[1200px] rounded-xl"
        }`}
      >
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white cursor-pointer transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/30">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="cursor-pointer font-semibold transition-colors duration-200 group-hover:text-primary">
              Coursey
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative transition-colors duration-200 hover:text-primary after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="transition-colors duration-200 hover:bg-accent hover:text-primary"
            >
              Log In
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-hover transition-all duration-200 hover:shadow-md hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border px-4 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1">
                Log In
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
