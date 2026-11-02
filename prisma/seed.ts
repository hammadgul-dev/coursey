import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"

let prisma = new PrismaClient()

async function main() {
  let email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
  let password = process.env.ADMIN_PASSWORD || ""

  if (!email || !password) {
    throw new Error("Admin Email And Password Are Required In Env")
  }

  if (password.length < 8) {
    throw new Error("Admin Password Must Be At Least 8 Characters")
  }

  let passwordHash = await bcrypt.hash(password, 12)

  let admin = await prisma.user.upsert({
    where: {email},
    update: {passwordHash, role: "ADMIN", banned: false},
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  })

  console.log("Admin Ready:", admin?.email)

  let sampleHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12)

  let instructor = await prisma.user.upsert({
    where: {email: "sample.instructor@coursey.com"},
    update: {},
    create: {
      name: "Sample Instructor",
      email: "sample.instructor@coursey.com",
      passwordHash: sampleHash,
      role: "INSTRUCTOR",
      headline: "Full Stack Developer And Teacher",
      bio: "Sample instructor account created by the seed script.",
    },
  })

  let existing = await prisma.course.findFirst({
    where: {
      instructorId: instructor.id,
      title: "JavaScript Basics For Beginners",
    },
    select: {id: true},
  })

  if (existing) {
    console.log("Sample Course Already Exists")
    return
  }

  await prisma.course.create({
    data: {
      title: "JavaScript Basics For Beginners",
      description:
        "Learn the core ideas of JavaScript from scratch with short text lessons and quick checkpoints.",
      category: "Web Development",
      level: "BEGINNER",
      learn: [
        "Understand variables and data types",
        "Write and call functions",
        "Work with arrays and objects",
        "Control flow with conditions and loops",
      ],
      status: "PUBLISHED",
      publishedAt: new Date(),
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Getting Started",
            position: 1,
            lessons: {
              create: [
                {
                  title: "What Is JavaScript",
                  content:
                    "# What Is JavaScript\n\nJavaScript is the language of the web. It runs in the browser and also on servers with Node.js.\n\nYou can use it to make pages interactive, build APIs, and much more.",
                  readMinutes: 4,
                  position: 1,
                  isFree: true,
                  checkpoints: {
                    create: [
                      {
                        question:
                          "Where does JavaScript run besides the browser?",
                        answer: "On servers with Node.js",
                        position: 1,
                      },
                      {
                        question:
                          "What is JavaScript mainly used for on web pages?",
                        answer: "Making pages interactive",
                        position: 2,
                      },
                    ],
                  },
                },
                {
                  title: "Variables And Data Types",
                  content:
                    "# Variables And Data Types\n\nVariables store values. Use let for values that change and const for values that do not.\n\nCommon types are string, number, boolean, null and undefined.",
                  readMinutes: 6,
                  position: 2,
                  isFree: false,
                  checkpoints: {
                    create: [
                      {
                        question:
                          "Which keyword declares a value that never changes?",
                        answer: "const",
                        position: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Functions And Collections",
            position: 2,
            lessons: {
              create: [
                {
                  title: "Writing Functions",
                  content:
                    "# Writing Functions\n\nA function is a reusable block of code. It can take parameters and return a value.\n\nArrow functions give a shorter syntax for the same idea.",
                  readMinutes: 7,
                  position: 1,
                  isFree: false,
                  checkpoints: {
                    create: [
                      {
                        question:
                          "What keyword sends a value back from a function?",
                        answer: "return",
                        position: 1,
                      },
                      {
                        question: "What do you call the inputs of a function?",
                        answer: "Parameters",
                        position: 2,
                      },
                    ],
                  },
                },
                {
                  title: "Arrays And Objects",
                  content:
                    "# Arrays And Objects\n\nArrays hold ordered lists of values. Objects hold key and value pairs.\n\nMethods like map and filter help you work with arrays in a clean way.",
                  readMinutes: 8,
                  position: 2,
                  isFree: false,
                  checkpoints: {
                    create: [
                      {
                        question:
                          "Which array method creates a new array from each item?",
                        answer: "map",
                        position: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log("Sample Course Ready")
}

main()
  .catch((e) => {
    console.error(e?.message || "Seed Failed")
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
