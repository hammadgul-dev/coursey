export let tabs: any[] = [
  {id: "student", label: "For Students"},
  {id: "instructor", label: "For Instructors"},
]

export let steps: any = {
  student: [
    {
      title: "Create your account",
      text: "Sign up in seconds. No credit card, everything is free.",
    },
    {
      title: "Browse and enroll",
      text: "Find a course by category, level and read time, then enroll.",
    },
    {
      title: "Read lessons and pass checkpoints",
      text: "Read clean lessons at your own pace, answer checkpoints and ask AI when stuck.",
    },
    {
      title: "Track progress and finish",
      text: "Mark lessons complete and follow your progress from the student dashboard.",
    },
  ],
  instructor: [
    {
      title: "Create your account",
      text: "Sign up and switch to the instructor dashboard.",
    },
    {
      title: "Build your course",
      text: "Add modules and lessons, or generate an outline with AI and edit it.",
    },
    {
      title: "Submit for review",
      text: "Send your course to the admin when it is ready.",
    },
    {
      title: "Get published",
      text: "Approved courses go live. Rejected ones come back with a reason so you can fix and resubmit.",
    },
  ],
}

export let faqs: any[] = [
  {
    q: "Is Coursey really free?",
    a: "Yes. Every course, lesson and checkpoint is free. No subscriptions and no paywalls.",
  },
  {
    q: "Who reviews submitted courses?",
    a: "An admin reviews every submitted course. It is either published or sent back with a clear reason.",
  },
  {
    q: "Can I become an instructor?",
    a: "Yes. Create an account, open the instructor dashboard and start building your first course.",
  },
  {
    q: "Is there a certificate?",
    a: "Not right now. Coursey focuses on free, quality learning, and your progress is tracked in your dashboard.",
  },
]
