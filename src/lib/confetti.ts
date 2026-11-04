import confetti from "canvas-confetti"

export function fireConfetti() {
  let end = Date.now() + 1500
  let colors = ["#4F46E5", "#818CF8", "#F59E0B", "#10B981", "#EC4899"]

  let frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: {x: 0, y: 0.7},
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: {x: 1, y: 0.7},
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }

  frame()
}

export function stopConfetti() {
  confetti.reset()
}
