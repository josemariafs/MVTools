import { z } from 'zod'

const imgbbResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      url: z.string()
    })
    .optional(),
  error: z
    .object({
      message: z.string().optional()
    })
    .optional()
})

/**
 * Sube un blob (PNG o GIF) a [ImgBB](https://api.imgbb.com/) y devuelve la URL directa (`i.ibb.co`).
 */
export async function uploadImageBlobToImgbb(blob: Blob, apiKey: string): Promise<string> {
  const key = apiKey.trim()
  if (!key) {
    throw new Error('ImgBB: falta la clave API.')
  }

  const ext = blob.type === 'image/gif' ? 'gif' : 'png'
  const form = new FormData()
  form.append('key', key)
  form.append('image', blob, `mvtools.${ext}`)

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: form
  })

  const json: unknown = await res.json().catch(() => null)
  const parsed = imgbbResponseSchema.safeParse(json)
  if (parsed.success && parsed.data.success === true && parsed.data.data?.url?.trim()) {
    return parsed.data.data.url.trim()
  }

  const msg =
    parsed.success && parsed.data.success === false ? parsed.data.error?.message?.trim() : undefined
  throw new Error(msg && msg.length > 0 ? msg : `ImgBB HTTP ${res.status}`)
}
