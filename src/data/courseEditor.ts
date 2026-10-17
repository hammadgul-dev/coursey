export let categories = [
  "Web Development",
  "Systems Architecture",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "Cyber Security",
  "AI & Machine Learning",
  "Databases",
]

export let levels = ["Beginner", "Intermediate", "Advanced"]

export let emptyCourse = {
  id: "",
  status: "draft",
  feedback: "",
  title: "",
  description: "",
  category: "",
  level: "",
  learn: [
    {id: "l1", text: ""},
    {id: "l2", text: ""},
    {id: "l3", text: ""},
  ],
}

export let editorCourses: any = {
  "1": {
    id: "1",
    status: "rejected",
    feedback:
      "Module 2 needs a checkpoint quiz before approval, and Lesson 3.2 is missing estimated read times. Please revise and resubmit.",
    title: "Modern TypeScript & Distributed Systems Architecture",
    description:
      "Master compile-time type mechanics, distributed state synchronization, Raft consensus validation and zero-runtime overhead pattern designs.",
    category: "Systems Architecture",
    level: "Advanced",
    learn: [
      {
        id: "l1",
        text: "Architect compile-time type-level validations using conditional types",
      },
      {id: "l2", text: "Implement leader election and log replication"},
      {
        id: "l3",
        text: "Handle network partitions and vector clocks in pure TypeScript",
      },
    ],
  },
  "2": {
    id: "2",
    status: "draft",
    feedback: "",
    title: "React Performance Patterns",
    description:
      "Learn memoization, code splitting and rendering strategies for fast React apps.",
    category: "Web Development",
    level: "Intermediate",
    learn: [{id: "l1", text: "Profile and fix slow renders"}],
  },
  "3": {id: "3", status: "pending", title: "Docker for Developers"},
  "4": {id: "4", status: "published", title: "Node.js Fundamentals"},
}

export let getEditorCourse = (id: any) => {
  let found = (editorCourses as any)[id]
  return {...emptyCourse, ...(found || {})} as any
}

export let dummyOutline = [
  {
    title: "Type-Level Foundations",
    lessons: [
      "Conditional Types & Distributive Inference",
      "Template Literal Synthesizers",
      "Recursive Tuple Manipulations",
    ],
  },
  {
    title: "Distributed RPC Primitives",
    lessons: [
      "Type-Safe Message Envelope Protocols",
      "Vector Clocks & Lamport Timestamps",
      "Connection Fault Simulation",
    ],
  },
  {
    title: "Raft Consensus Engine",
    lessons: [
      "Leader Election State Machine",
      "Log Append & Commit Index Consensus",
      "Safety Invariants & Partition Recovery",
    ],
  },
  {
    title: "Production Hardening",
    lessons: [
      "Snapshotting & Compaction Mechanisms",
      "Chaos Testing & Jepsen Simulation",
      "Deterministic Replay Benchmarks",
    ],
  },
]
