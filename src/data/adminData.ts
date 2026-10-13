export let adminStats = {users: 28450, courses: 142, published: 134} as any

export let adminPending = [
  {
    id: 101,
    title: "High-Throughput Compiler Plugins in Rust",
    category: "Rust",
    instructor: "Aris Thorne",
    submitted: "4 hours ago",
    duration: "4.5 hrs",
    lessons: 15,
    checkpoints: 2,
    aiScore: 96,
    aiNote:
      "Content follows the text-first standard. Code snippets are clean and every lesson is well structured.",
    summary:
      "A deep dive into abstract syntax tree mutation, LLVM pass integration and static safety guarantees for Rust runtimes.",
    curriculum: [
      {
        title: "Module 1: Foundations",
        lessons: [
          "Intro to compiler plugins",
          "Abstract syntax trees",
          "Setting up the toolchain",
        ],
      },
      {
        title: "Module 2: Passes",
        lessons: [
          "Writing a custom pass",
          "LLVM integration",
          "Testing your plugin",
        ],
      },
    ],
  },
  {
    id: 102,
    title: "Database Indexing & Query Optimizers",
    category: "Databases",
    instructor: "Elena Rostova",
    submitted: "11 hours ago",
    duration: "3.2 hrs",
    lessons: 11,
    checkpoints: 0,
    aiScore: 72,
    aiNote:
      "Text structure is solid, but Module 4 lacks checkpoint quizzes and Module 2 has duplicate headings.",
    summary:
      "B-Trees, LSM Trees, cost-based query planners and buffer pool eviction policies in modern relational engines.",
    curriculum: [
      {
        title: "Module 1: Storage Basics",
        lessons: ["Pages and heap files", "B-Tree internals", "LSM Trees"],
      },
      {
        title: "Module 2: Query Planning",
        lessons: [
          "Cost-based planning",
          "Join strategies",
          "Reading EXPLAIN output",
        ],
      },
    ],
  },
  {
    id: 103,
    title: "Practical Prompt Engineering for Developers",
    category: "AI",
    instructor: "Sara Malik",
    submitted: "1 day ago",
    duration: "2.8 hrs",
    lessons: 9,
    checkpoints: 3,
    aiScore: 88,
    aiNote:
      "Clear writing and good examples. Minor repetition between lessons 3 and 4.",
    summary:
      "Structured prompting, output validation and building reliable AI features into real products.",
    curriculum: [
      {
        title: "Module 1: Prompt Basics",
        lessons: [
          "How models read prompts",
          "Roles and context",
          "Output formats",
        ],
      },
      {
        title: "Module 2: In Production",
        lessons: [
          "Validation with schemas",
          "Handling failures",
          "Cost control",
        ],
      },
    ],
  },
] as any[]

export let adminCourses = [
  {
    id: 1,
    title: "Modern TypeScript & Systems Architecture",
    instructor: "Sarah Jenkins",
    status: "published",
    students: 14820,
    date: "Oct 12, 2024",
  },
  {
    id: 2,
    title: "Distributed Systems & Consensus in Go",
    instructor: "Kenji Sato",
    status: "published",
    students: 8450,
    date: "Nov 03, 2024",
  },
  {
    id: 3,
    title: "Linux Kernel BPF Tracing for Engineers",
    instructor: "Liam Gallagher",
    status: "rejected",
    students: 0,
    date: "",
  },
  {
    id: 4,
    title: "Practical Large Language Models from Scratch",
    instructor: "Alex Rivera",
    status: "published",
    students: 5180,
    date: "Sep 18, 2024",
  },
  {
    id: 5,
    title: "Deprecated Microservices in Python",
    instructor: "Unknown Org",
    status: "removed",
    students: 120,
    date: "Jun 10, 2023",
  },
  {
    id: 6,
    title: "React Server Components in Depth",
    instructor: "Maya Chen",
    status: "published",
    students: 3290,
    date: "Jan 21, 2026",
  },
] as any[]

export let adminUsers = [
  {
    id: 1,
    name: "Ayesha Khan",
    email: "ayesha@mail.com",
    role: "student",
    joined: "Jan 10, 2026",
    banned: false,
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    email: "sarah@mail.com",
    role: "instructor",
    joined: "Mar 02, 2025",
    banned: false,
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    email: "bilal@mail.com",
    role: "student",
    joined: "Feb 14, 2026",
    banned: false,
  },
  {
    id: 4,
    name: "Kenji Sato",
    email: "kenji@mail.com",
    role: "instructor",
    joined: "Aug 19, 2025",
    banned: false,
  },
  {
    id: 5,
    name: "Hira Noor",
    email: "hira@mail.com",
    role: "student",
    joined: "May 05, 2026",
    banned: true,
  },
  {
    id: 6,
    name: "Liam Gallagher",
    email: "liam@mail.com",
    role: "instructor",
    joined: "Oct 30, 2025",
    banned: false,
  },
  {
    id: 7,
    name: "Usman Tariq",
    email: "usman@mail.com",
    role: "student",
    joined: "Jul 22, 2026",
    banned: false,
  },
] as any[]
