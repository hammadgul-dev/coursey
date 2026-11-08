export let detectImage = (buf: Buffer) => {
  if (!buf || buf.length < 12) return ""
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg"
  let png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (buf.subarray(0, 8).equals(png)) return "png"
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "webp"
  return ""
}

export let readImage = async (req: Request, maxBytes: number) => {
  let length = Number(req.headers.get("content-length") || 0)
  if (length > maxBytes + 100000) {
    return {error: "Image Is Too Large", buffer: null}
  }
  let form: any = await req.formData().catch(() => null)
  if (!form) return {error: "Invalid Request", buffer: null}
  let file: any = form.get("file")
  if (!file || typeof file === "string") {
    return {error: "Image Is Required", buffer: null}
  }
  if (file.size > maxBytes) return {error: "Image Is Too Large", buffer: null}
  let buffer = Buffer.from(await file.arrayBuffer())
  if (!detectImage(buffer)) {
    return {error: "Only Jpg, Png Or Webp Allowed", buffer: null}
  }
  return {error: "", buffer}
}
