export type Course = {
  id: number
  tag: string
  color: "indigo" | "purple" | "green" | "amber" | "cyan" | "rose"
  rating: number
  title: string
  desc: string
  author: string
  lessons: number
  level: "Beginner" | "Intermediate" | "Advanced"
}

export let courses: Course[] = [
  {
    id: 1,
    tag: "TypeScript",
    color: "indigo",
    rating: 4.9,
    title: "Modern TypeScript & Systems Architecture",
    desc: "Master advanced utility types, nominal typing patterns, compiler internals…",
    author: "Sarah Jenkins",
    lessons: 24,
    level: "Intermediate",
  },
  {
    id: 2,
    tag: "Machine Learning",
    color: "purple",
    rating: 4.9,
    title: "Practical Large Language Models from Scratch",
    desc: "Tokenization, attention heads, backprop derivation, and fine-tuning…",
    author: "Dr. Alex Rivera",
    lessons: 18,
    level: "Advanced",
  },
  {
    id: 3,
    tag: "Data Systems",
    color: "green",
    rating: 5.0,
    title: "High-Performance SQL & Database Internals",
    desc: "B-Trees, WAL logs, MVCC isolation levels, index access paths, and…",
    author: "Marcus Chen",
    lessons: 20,
    level: "Advanced",
  },
  {
    id: 4,
    tag: "Product & UX",
    color: "amber",
    rating: 4.8,
    title: "Information Architecture & UI Micropcopy",
    desc: "Construct navigation hierarchies, error message conventions, and cognitive…",
    author: "Elena Rostova",
    lessons: 14,
    level: "Beginner",
  },
  {
    id: 5,
    tag: "Systems Architecture",
    color: "cyan",
    rating: 4.9,
    title: "Distributed Systems in Go",
    desc: "Build a fault-tolerant Raft consensus engine, peer discovery protocols, an…",
    author: "Kenji Sato",
    lessons: 22,
    level: "Intermediate",
  },
  {
    id: 6,
    tag: "Web Development",
    color: "rose",
    rating: 4.7,
    title: "CSS for Software Engineers",
    desc: "The rendering pipeline, stacking contexts, CSS cascade algorithms,…",
    author: "Maya Lin",
    lessons: 12,
    level: "Beginner",
  },
  {
    id: 7,
    tag: "Systems Architecture",
    color: "amber",
    rating: 4.9,
    title: "Rust Memory Management & Concurrency",
    desc: "Lifetimes, non-lexical lifetimes, pinned memory, lock-free queues…",
    author: "David K. Miller",
    lessons: 26,
    level: "Advanced",
  },
  {
    id: 8,
    tag: "Business & Leadership",
    color: "cyan",
    rating: 4.8,
    title: "Product Strategy for Tech Leads",
    desc: "Bridging engineering roadmaps with business objectives, managing…",
    author: "Priya Sharma",
    lessons: 16,
    level: "Intermediate",
  },
  {
    id: 9,
    tag: "Data Systems",
    color: "green",
    rating: 4.9,
    title: "Python Data Engineering with Polars",
    desc: "Lazy evaluation query plans, Arrow memory buffers, multithreaded…",
    author: "Liam O'Connor",
    lessons: 15,
    level: "Intermediate",
  },
  {
    id: 10,
    tag: "Web Development",
    color: "indigo",
    rating: 4.7,
    title: "React Server Components Deep Dive",
    desc: "Streaming, suspense boundaries, server/client boundaries, caching…",
    author: "Nina Patel",
    lessons: 19,
    level: "Intermediate",
  },
  {
    id: 11,
    tag: "Machine Learning",
    color: "purple",
    rating: 4.6,
    title: "Vector Databases & RAG Pipelines",
    desc: "Embeddings, ANN search, chunking strategies, retrieval evaluation…",
    author: "Omar Farid",
    lessons: 17,
    level: "Intermediate",
  },
  {
    id: 12,
    tag: "Systems Architecture",
    color: "rose",
    rating: 4.8,
    title: "Designing Event-Driven Microservices",
    desc: "Sagas, outbox pattern, idempotency, message broker trade-offs…",
    author: "Julia Novak",
    lessons: 21,
    level: "Advanced",
  },
  {
    id: 13,
    tag: "Product & UX",
    color: "amber",
    rating: 4.5,
    title: "Accessibility for Web Engineers",
    desc: "ARIA patterns, keyboard navigation, screen reader testing…",
    author: "Tariq Hassan",
    lessons: 11,
    level: "Beginner",
  },
  {
    id: 14,
    tag: "Data Systems",
    color: "cyan",
    rating: 4.9,
    title: "Kafka Internals & Stream Processing",
    desc: "Partitioning, consumer groups, exactly-once semantics…",
    author: "Elif Kaya",
    lessons: 23,
    level: "Advanced",
  },
  {
    id: 15,
    tag: "Web Development",
    color: "green",
    rating: 4.6,
    title: "Next.js Performance at Scale",
    desc: "ISR, edge caching, bundle splitting, Core Web Vitals…",
    author: "Carlos Mendez",
    lessons: 18,
    level: "Intermediate",
  },
]

export let categories = [
  {label: "All Topics", count: 450},
  {label: "Web Development", count: 124},
  {label: "Machine Learning & AI", count: 98},
  {label: "Data Systems", count: 64},
  {label: "Systems Architecture", count: 52},
  {label: "Product & UX", count: 46},
  {label: "Business & Leadership", count: 38},
]

export let levels = [
  {label: "All Levels", count: 450},
  {label: "Beginner", count: 180},
  {label: "Intermediate", count: 195},
  {label: "Advanced", count: 75},
]

export let readingTimeOptions = [
  {label: "< 2 hours", count: 94},
  {label: "2 – 5 hours", count: 248},
  {label: "5+ hours", count: 108},
]

export let features = [
  "Interactive Code Snippets",
  "Practice Quizzes",
  "Verified Certificate",
]
