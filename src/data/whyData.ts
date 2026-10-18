export let features: any[] = [
  {
    tag: "01 / Reading",
    title: "Text-first lessons",
    text: "Clean, scannable lessons with code you can copy in one click. Read at your own speed, no buffering.",
    points: ["Copyable code", "Read time shown"],
    mock: {
      label: "Lesson 2 · 6 min read",
      title: "Memory allocation in Rust",
      lines: [
        "Stack allocations are automatic and fast.",
        "let buffer = Vec::new();",
        "Heap data needs clear ownership.",
      ],
      hi: -1,
    },
  },
  {
    tag: "02 / Recall",
    title: "Checkpoint quizzes",
    text: "Short quizzes inside lessons make you recall what you read before you move on.",
    points: ["Instant feedback", "Active recall"],
    mock: {
      label: "Checkpoint · Question 2 of 4",
      title: "What happens when a borrow outlives its owner?",
      lines: [
        "Pointer becomes null",
        "Compiler rejects it",
        "Garbage collector keeps it",
      ],
      hi: 1,
    },
  },
  {
    tag: "03 / Help",
    title: "Ask AI inside the lesson",
    text: "Stuck on a line? Ask the AI right inside the lesson and get an answer based on that lesson.",
    points: ["Lesson-aware answers", "No tab switching"],
    mock: {
      label: "Lesson assistant",
      title: "You: Why is a clone needed here?",
      lines: [
        "AI: Line 14 moves ownership, so the original can't be used afterwards.",
      ],
      hi: 0,
    },
  },
  {
    tag: "04 / Revision",
    title: "AI summaries and quizzes",
    text: "Get a quick recap of any lesson and practice questions when you want to revise.",
    points: ["Quick recap", "Practice questions"],
    mock: {
      label: "AI summary",
      title: "Key points",
      lines: [
        "Stack is fast, heap is flexible",
        "Ownership decides who frees memory",
        "Borrows can't outlive owners",
      ],
      hi: -1,
    },
  },
  {
    tag: "05 / Quality",
    title: "Reviewed courses",
    text: "Every course is checked by an admin before it is published. Rejected courses go back with a reason.",
    points: ["Admin reviewed", "Clear feedback"],
    mock: {
      label: "Review status",
      title: "Rust Memory Basics",
      lines: ["Submitted by instructor", "Reviewed by admin", "Published"],
      hi: 2,
    },
  },
]

export let compare: any[] = [
  {
    label: "Pace",
    video: "Fixed speed, scrub to find things",
    text: "Read at your own pace",
  },
  {
    label: "Search",
    video: "Content hidden inside video",
    text: "Searchable text lessons",
  },
  {
    label: "Code",
    video: "Retype it from the screen",
    text: "Copy in one click",
  },
  {
    label: "Speed",
    video: "Heavy on slow connections",
    text: "Light pages that load fast",
  },
]
