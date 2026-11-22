import {promises as dns} from "dns"

export async function hasMailServer(email: string) {
  let domain = (email || "").split("@")[1] || ""
  if (!domain) return false

  try {
    let mx = await dns.resolveMx(domain)
    if ((mx || []).length > 0) return true
  } catch (e: any) {
    if (e?.code !== "ENOTFOUND" && e?.code !== "ENODATA") return true
  }

  try {
    let a = await dns.resolve4(domain)
    return (a || []).length > 0
  } catch (e: any) {
    if (e?.code !== "ENOTFOUND" && e?.code !== "ENODATA") return true
    return false
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
  let key = process.env.RESEND_API_KEY || ""
  let from = process.env.EMAIL_FROM || ""
  if (!key || !from) return false

  try {
    let res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({from, to: [to], subject, html}),
    })
    return res.ok
  } catch {
    return false
  }
}

export function resetEmailHtml(link: string) {
  return (
    '<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">' +
    '<h2 style="color:#4F46E5;margin:0 0 12px">Reset Your Password</h2>' +
    '<p style="color:#374151;font-size:14px;line-height:1.6">We received a request to reset your Coursey password. This link works for 1 hour and can be used once.</p>' +
    '<p style="margin:24px 0"><a href="' +
    link +
    '" style="background:#4F46E5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-size:14px">Reset Password</a></p>' +
    '<p style="color:#6B7280;font-size:12px;line-height:1.6">If you did not request this, you can safely ignore this email.</p>' +
    "</div>"
  )
}
