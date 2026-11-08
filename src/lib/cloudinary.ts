import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000,
})

export let uploadImage = (
  buffer: Buffer,
  folder: string,
  publicId: string,
  transformation: any,
) => {
  return new Promise<any>((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        transformation,
        timeout: 60000,
      },
      (err: any, result: any) => {
        if (err || !result) {
          reject(err || new Error("Upload Failed"))
          return
        }
        resolve(result)
      },
    )
    stream.end(buffer)
  })
}

export let deleteImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  })
}
