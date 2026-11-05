import {prisma} from "@/lib/prisma"

export let REVIEWS_PER_PAGE = 5

function mapReview(r: any) {
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment || "",
    createdAt: r.createdAt.toISOString(),
    name: r.user?.name || "Student",
  }
}

export async function getReviewsPage(courseId: string, page: number) {
  let total = await prisma.review.count({where: {courseId}})
  let list = await prisma.review.findMany({
    where: {courseId},
    orderBy: [{createdAt: "desc"}, {id: "desc"}],
    skip: (page - 1) * REVIEWS_PER_PAGE,
    take: REVIEWS_PER_PAGE,
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {select: {name: true}},
    },
  })
  let reviews = (list || []).map(mapReview)
  let hasMore = page * REVIEWS_PER_PAGE < total
  return {reviews, total, hasMore}
}

export async function getReviewsData(courseId: string, userId: string | null) {
  let rows: any = []
  rows = await prisma.review.groupBy({
    by: ["rating"],
    where: {courseId},
    _count: {rating: true},
  })

  let counts: number[] = [0, 0, 0, 0, 0]
  let total = 0
  let sum = 0
  for (let r of rows || []) {
    let n = r?._count?.rating || 0
    let idx = (r?.rating || 1) - 1
    if (idx >= 0 && idx < 5) {
      counts[idx] += n
      total += n
      sum += n * (idx + 1)
    }
  }
  let average = 0
  if (total > 0) average = Math.round((sum / total) * 10) / 10

  let first = await getReviewsPage(courseId, 1)

  let mine: any = null
  if (userId) {
    let m = await prisma.review.findUnique({
      where: {userId_courseId: {userId, courseId}},
      select: {rating: true, comment: true},
    })
    if (m) mine = {rating: m.rating, comment: m.comment || ""}
  }

  return {average, total, counts, reviews: first.reviews, mine}
}
