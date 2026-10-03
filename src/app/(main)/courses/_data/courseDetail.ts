export let highlights = [
  {
    title: "Distraction-Free Reading",
    desc: "Optimized line measure for sustained technical focus.",
  },
  {
    title: "Zero Video Scrubbing",
    desc: "Instant Ctrl+F for any concept, snippet or API.",
  },
  {
    title: "Interactive Checkpoints",
    desc: "Embedded code diagnostics right inside each lesson.",
  },
]

export let learn = [
  {
    title: "Advanced Type Manipulation",
    desc: "Master conditional types, recursive inference and template literal types.",
  },
  {
    title: "Nominal Typing & Safety",
    desc: "Enforce compile-time boundaries with branded primitives.",
  },
  {
    title: "Compiler Architecture",
    desc: "Unpack the scanner, parser and type-checker pipeline.",
  },
  {
    title: "Type-Checking Speed",
    desc: "Profile slow builds and cut expensive union instantiations.",
  },
  {
    title: "Clean Architecture in TS",
    desc: "Build ports and adapters that isolate your domain logic.",
  },
  {
    title: "Monorepo Tooling",
    desc: "Project references, composite flags and Turborepo caching.",
  },
]

export let modules = [
  {
    title: "Foundational Type Theory",
    lessons: [
      {t: "The Type System as a Set-Theoretic Algebra", m: 7, free: true},
      {t: "Deep-dive into Distributive Conditional Types", m: 9, free: true},
      {t: "Exhaustive Checking and the never Type", m: 8},
    ],
  },
  {
    title: "Generic Metaprogramming",
    lessons: [
      {t: "Mastering the infer Keyword", m: 10},
      {t: "Template Literal Types for Typed Routing", m: 8},
      {t: "Currying and Fluent Generic Interfaces", m: 9},
    ],
  },
  {
    title: "Scalable Domain Modeling",
    lessons: [
      {t: "Branded Primitives in Practice", m: 7},
      {t: "Hexagonal Architecture with TypeScript", m: 11},
      {t: "Designing Type-Safe Boundaries", m: 8},
    ],
  },
  {
    title: "Compiler Performance",
    lessons: [
      {t: "Reading generateTrace Output", m: 9},
      {t: "Project References and Composite Builds", m: 10},
      {t: "Turborepo Caching Strategies", m: 8},
    ],
  },
]

export let instructor = {
  name: "Sarah Jenkins",
  role: "Principal Systems Architect",
  bio: "12+ years architecting web applications and compiler toolchains at scale. She breaks complex type theory into practical patterns engineers can ship.",
  courses: 4,
  students: "48,200",
  rating: "4.9",
}

export let totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0)
