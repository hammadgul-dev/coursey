import {
  LayoutDashboard,
  BookOpen,
  PlusSquare,
  Settings,
  Library,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react"

export let instructor = {name: "Sarah Jenkins"}

export let sidebarLinks = [
  {
    label: "Dashboard",
    href: "/instructor-dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {label: "My Courses", href: "#my-courses", icon: BookOpen, active: false},
  {label: "Create Course", href: "#", icon: PlusSquare, active: false},
  {label: "Profile / Settings", href: "#", icon: Settings, active: false},
]

export let stats = [
  {label: "Total Courses", value: "6", note: "+1 this month", icon: Library},
  {
    label: "Total Students",
    value: "14,820",
    note: "+12% vs last mo",
    icon: Users,
  },
  {label: "Awaiting Review", value: "2", note: "Pending", icon: Clock},
  {
    label: "Avg. Completion Rate",
    value: "78.4%",
    note: "+3.1% benchmark",
    icon: TrendingUp,
  },
]

export let instructorCourses = [
  {
    id: "1",
    code: "TS",
    title: "Modern TypeScript & Systems Architecture",
    category: "TypeScript",
    meta: "24 Text Lessons • 3 Checkpoints",
    status: "published",
    students: "14,820",
    updated: "2 days ago",
    feedback: "",
  },
  {
    id: "2",
    code: "GO",
    title: "Distributed Systems & Consensus in Go",
    category: "Distributed Systems",
    meta: "18 Text Lessons • 4 Checkpoints",
    status: "published",
    students: "8,450",
    updated: "1 week ago",
    feedback: "",
  },
  {
    id: "3",
    code: "RS",
    title: "High-Throughput Compiler Plugins in Rust",
    category: "Compilers",
    meta: "15 Text Lessons",
    status: "pending",
    students: "—",
    updated: "Submitted Oct 24, 2025",
    feedback: "",
  },
  {
    id: "4",
    code: "DB",
    title: "Database Indexing & Query Optimizers",
    category: "Databases",
    meta: "20 Text Lessons",
    status: "pending",
    students: "—",
    updated: "Submitted yesterday",
    feedback: "",
  },
  {
    id: "5",
    code: "BPF",
    title: "Linux Kernel BPF Tracing for Engineers",
    category: "Kernel",
    meta: "12 Text Lessons",
    status: "rejected",
    students: "—",
    updated: "Reviewed 3 days ago",
    feedback:
      "Course curriculum needs more interactive checkpoint quizzes for Modules 3 and 4 before approval. Please revise and resubmit for verification.",
  },
  {
    id: "6",
    code: "ASY",
    title: "Asynchronous Runtime Internals",
    category: "Runtimes",
    meta: "8 Lessons Drafted",
    status: "draft",
    students: "—",
    updated: "Saved 4 hours ago",
    feedback: "",
  },
]
