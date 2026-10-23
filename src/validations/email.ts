import {z} from "zod"

let emailRegex =
  /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,10}$/

let allowedTlds = [
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "info",
  "biz",
  "io",
  "co",
  "dev",
  "app",
  "ai",
  "me",
  "tech",
  "online",
  "site",
  "xyz",
  "pk",
  "in",
  "uk",
  "us",
  "ca",
  "au",
  "de",
  "fr",
  "es",
  "it",
  "nl",
  "se",
  "no",
  "ae",
  "sa",
  "bd",
  "cn",
  "jp",
  "kr",
  "sg",
  "my",
  "id",
  "tr",
  "ru",
  "br",
  "mx",
  "za",
  "ng",
  "eg",
  "nz",
  "ie",
  "ch",
  "at",
  "be",
  "pl",
]

let blockedDomains = [
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "throwawaymail.com",
  "gmial.com",
  "gmal.com",
  "gamil.com",
  "gmaill.com",
  "hotmial.com",
  "hotmal.com",
  "outlok.com",
  "outloook.com",
  "yahooo.com",
  "yaho.com",
  "yahho.com",
  "iclod.com",
]

let providers: Record<string, string[]> = {
  gmail: ["gmail.com"],
  yahoo: ["yahoo.com", "yahoo.co.uk", "yahoo.co.in", "yahoo.in"],
  outlook: ["outlook.com"],
  hotmail: ["hotmail.com", "hotmail.co.uk"],
  icloud: ["icloud.com"],
}

export let emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(6, "Email Is Too Short")
  .max(254, "Email Is Too Long")
  .regex(emailRegex, "Enter A Valid Email Address")
  .refine((v) => !(v || "").includes(".."), "Enter A Valid Email Address")
  .refine((v) => {
    let domain = (v || "").split("@")[1] || ""
    let tld = domain.split(".").pop() || ""
    return allowedTlds.includes(tld)
  }, "Enter A Valid Email Address")
  .refine((v) => {
    let domain = (v || "").split("@")[1] || ""
    if (blockedDomains.includes(domain)) return false
    let brand = domain.split(".")[0] || ""
    let list = providers[brand] || []
    if ((list || []).length > 0 && !list.includes(domain)) return false
    return true
  }, "This Email Domain Is Not Allowed")
