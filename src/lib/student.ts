import {prisma} from "@/lib/prisma"

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

let DAY = 86400000

function dayKey(ms: number) {
  return new Date(ms).toISOString().slice(0, 10)
}

function levelLabel(level: any) {
  let s = String(level || "")
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
}

function shortDate(d: any) {
  if (!d) return ""
  let x = new Date(d)
  return `${months[x.getUTCMonth()]} ${x.getUTCDate()}`
}

export async function getStudentDashboard(userId: string) {
  let user = await prisma.user.findUnique({
    where: {id: userId},
    select: {name: true, role: true, banned: true},
  })
  if (!user || user.banned) return null

  let enrollments: any = await prisma.enrollment.findMany({
    where: {userId, course: {status: "PUBLISHED"}},
    orderBy: {createdAt: "desc"},
    take: 50,
    select: {
      createdAt: true,
      completedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          level: true,
          instructor: {select: {name: true}},
          modules: {
            orderBy: {position: "asc"},
            select: {
              lessons: {
                orderBy: {position: "asc"},
                select: {id: true, readMinutes: true},
              },
            },
          },
        },
      },
    },
  })

  let allIds: string[] = []
  for (let e of enrollments) {
    for (let m of e?.course?.modules || []) {
      for (let l of m?.lessons || []) allIds.push(l.id)
    }
  }

  let progressRows: any = []
  if (allIds.length) {
    progressRows = await prisma.lessonProgress.findMany({
      where: {userId, lessonId: {in: allIds}},
      select: {lessonId: true, completedAt: true},
    })
  }

  let doneAt: any = {}
  for (let p of progressRows) {
    doneAt[p.lessonId] = new Date(p.completedAt).getTime()
  }

  let courses = enrollments.map((e: any) => {
    let course = e.course
    let lessons: any[] = []
    for (let m of course?.modules || []) {
      for (let l of m?.lessons || []) lessons.push(l)
    }

    let total = lessons.length
    let done = 0
    let readLeft = 0
    let last = 0
    let next: any = null
    for (let l of lessons) {
      if (doneAt[l.id]) {
        done += 1
        if (doneAt[l.id] > last) last = doneAt[l.id]
      } else {
        readLeft += l?.readMinutes || 0
        if (!next) next = l
      }
    }

    let finished = total > 0 && done === total

    return {
      id: course.id,
      title: course.title,
      description: course.description || "",
      category: course.category || "",
      level: levelLabel(course.level),
      instructor: course?.instructor?.name || "",
      lessonsCount: total,
      done,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
      status: finished ? "completed" : "progress",
      nextLessonId: next?.id || lessons[0]?.id || "",
      readLeft,
      activityAt: last || new Date(e.createdAt).getTime(),
      finished: finished ? shortDate(e.completedAt) || shortDate(last) : "",
    }
  })

  let continueLearning = courses
    .filter((c: any) => c.status === "progress")
    .sort((a: any, b: any) => b.activityAt - a.activityAt)
    .slice(0, 2)

  let enrolledIds = new Set(courses.map((c: any) => c.id))

  let wl: any = await prisma.watchlist.findMany({
    where: {userId, course: {status: "PUBLISHED"}},
    orderBy: {createdAt: "desc"},
    take: 50,
    select: {
      course: {
        select: {
          id: true,
          title: true,
          category: true,
          level: true,
          instructor: {select: {name: true}},
          modules: {select: {lessons: {select: {id: true}}}},
        },
      },
    },
  })

  let watchlist = wl
    .filter((w: any) => !enrolledIds.has(w?.course?.id))
    .map((w: any) => {
      let count = 0
      for (let m of w?.course?.modules || []) count += m?.lessons?.length || 0
      return {
        id: w.course.id,
        tag: w.course.category || "",
        title: w.course.title,
        instructor: w?.course?.instructor?.name || "",
        lessons: count,
        level: levelLabel(w.course.level),
      }
    })

  let since = new Date(Date.now() - 365 * DAY)
  let recent: any = await prisma.lessonProgress.findMany({
    where: {userId, completedAt: {gte: since}},
    select: {completedAt: true},
  })

  let daySet = new Set<string>()
  for (let r of recent) daySet.add(dayKey(new Date(r.completedAt).getTime()))

  let now = new Date()
  let todayMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  )
  let cursor = todayMs
  if (!daySet.has(dayKey(cursor))) cursor -= DAY
  let streakDays = 0
  while (daySet.has(dayKey(cursor))) {
    streakDays += 1
    cursor -= DAY
  }

  let monday = todayMs - ((now.getUTCDay() + 6) % 7) * DAY
  let week: boolean[] = []
  for (let i = 0; i < 7; i++) week.push(daySet.has(dayKey(monday + i * DAY)))

  let lessonsThisWeek = 0
  for (let r of recent) {
    if (new Date(r.completedAt).getTime() >= monday) lessonsThisWeek += 1
  }

  let completedCount = courses.filter(
    (c: any) => c.status === "completed",
  ).length
  let sum = 0
  for (let c of courses) sum += c.progress

  return {
    name: user.name || "",
    role: user.role,
    courses,
    continueLearning,
    watchlist,
    stats: {
      enrolledCount: courses.length,
      activeCount: courses.length - completedCount,
      completedCount,
      avgProgress: courses.length > 0 ? Math.round(sum / courses.length) : 0,
      watchlistCount: watchlist.length,
    },
    streak: {
      days: streakDays,
      week,
      weekCount: week.filter(Boolean).length,
      goal: 5,
    },
    lessonsThisWeek,
  }
}
