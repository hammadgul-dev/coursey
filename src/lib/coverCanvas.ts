let palettes = [
  ["#4F46E5", "#7C3AED"],
  ["#2563EB", "#06B6D4"],
  ["#059669", "#14B8A6"],
  ["#EA580C", "#E11D48"],
  ["#DB2777", "#7C3AED"],
  ["#0F172A", "#4F46E5"],
]

let levelNames: any = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

let wrapLines = (ctx: any, text: string, maxWidth: number) => {
  let words = text.split(/\s+/).filter(Boolean)
  let lines: string[] = []
  let line = ""
  for (let w of words) {
    let test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export let makeCover = async (
  short: string,
  palette: number,
  category: string,
  level: string,
): Promise<File | null> => {
  let canvas = document.createElement("canvas")
  canvas.width = 1280
  canvas.height = 720
  let ctx: any = canvas.getContext("2d")
  if (!ctx) return null

  let index = Math.min(5, Math.max(0, Math.round(Number(palette) || 0)))
  let colors = palettes[index]

  let grad = ctx.createLinearGradient(0, 0, 1280, 720)
  grad.addColorStop(0, colors[0])
  grad.addColorStop(1, colors[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1280, 720)

  ctx.fillStyle = "rgba(255,255,255,0.08)"
  ctx.beginPath()
  ctx.arc(1120, 120, 260, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(140, 640, 220, 0, Math.PI * 2)
  ctx.fill()

  let family = "Poppins, system-ui, sans-serif"
  let maxWidth = 1000
  let size = 120
  let lines: string[] = []
  while (size >= 56) {
    ctx.font = `700 ${size}px ${family}`
    lines = wrapLines(ctx, short, maxWidth)
    let fits = lines.every((l) => ctx.measureText(l).width <= maxWidth)
    if (lines.length <= 2 && fits) break
    size -= 8
  }

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#FFFFFF"
  ctx.font = `700 ${size}px ${family}`
  let lineHeight = size * 1.2
  let startY = 340 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => ctx.fillText(l, 640, startY + i * lineHeight))

  ctx.textAlign = "left"
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.font = `700 36px ${family}`
  ctx.fillText("Coursey", 80, 90)

  let bottom = [category || "", levelNames[level] || ""]
    .filter(Boolean)
    .join("  •  ")
  if (bottom) {
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.font = `500 30px ${family}`
    ctx.fillText(bottom, 80, 640)
  }

  let blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  )
  if (!blob) return null
  return new File([blob], "cover.jpg", {type: "image/jpeg"})
}
