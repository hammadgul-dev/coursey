import {BookOpen, Unlock, ShieldCheck} from "lucide-react"

export let mission: string[] = [
  "Video courses often slow down deliberate learning with fluff, unsearchable timestamps and passive watching.",
  "Coursey brings back focused lessons: structured text, clear code snippets and checkpoint quizzes that respect your time. No 40-minute monologues when a crisp paragraph says it in two minutes.",
]

export let beliefs: any[] = [
  {
    icon: BookOpen,
    title: "Text-first learning",
    text: "Skim at your own pace, copy code easily and learn without buffering or audio scrubbers.",
  },
  {
    icon: Unlock,
    title: "Free for everyone",
    text: "Knowledge should never sit behind paywalls or subscriptions. Every course on Coursey is free.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-reviewed courses",
    text: "Every course is reviewed by an admin before it reaches learners.",
  },
]

export let steps: any[] = [
  {
    n: "01",
    tag: "Authoring",
    title: "Instructor submits",
    text: "Instructors write their lessons, add checkpoints and submit the course for review.",
  },
  {
    n: "02",
    tag: "Review",
    title: "Admin reviews",
    text: "An admin checks clarity, depth and quality before anything goes live.",
  },
  {
    n: "03",
    tag: "Decision",
    title: "Published or rejected",
    text: "Approved courses go live in the catalog. Rejected ones come back with a clear reason to fix.",
  },
]
