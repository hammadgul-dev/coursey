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
