/**
 * Normalización de imágenes remotas en el **service worker** (sin DOM):
 * - GIF → bytes tal cual (`image/gif`).
 * - WebP animado → primer fotograma PNG.
 * - Resto → PNG vía `createImageBitmap` + `OffscreenCanvas`.
 */

function isAnimatedWebpBuffer(buf: ArrayBuffer): boolean {
  const u8 = new Uint8Array(buf)
  if (u8.length < 20) return false
  const head = String.fromCharCode(...u8.slice(0, 4))
  if (head !== 'RIFF') return false
  const webp = String.fromCharCode(...u8.slice(8, 12))
  if (webp !== 'WEBP') return false
  const dec = new TextDecoder('latin1')
  const early = dec.decode(u8.slice(12, Math.min(u8.length, 65536)))
  return early.includes('ANIM') || early.includes('ANMF')
}

async function bitmapToPngBlob(bmp: ImageBitmap): Promise<Blob> {
  const canvas = new OffscreenCanvas(bmp.width, bmp.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('OffscreenCanvas 2d')
  ctx.drawImage(bmp, 0, 0)
  const blob = await canvas.convertToBlob({ type: 'image/png' })
  if (!blob) throw new Error('convertToBlob vacío')
  return blob
}

async function blobToPngBlob(blob: Blob): Promise<Blob> {
  const bmp = await createImageBitmap(blob)
  try {
    return await bitmapToPngBlob(bmp)
  } finally {
    bmp.close()
  }
}

/**
 * Descarga una URL de imagen y devuelve un `Blob` listo para ImgBB (`image/png` o `image/gif`).
 */
export async function normalizeRemoteImageForForumUpload(imageUrl: string): Promise<Blob | null> {
  const u = imageUrl.trim()
  if (!u || u.startsWith('data:')) return null

  try {
    const res = await fetch(u, { credentials: 'omit', mode: 'cors' })
    if (!res.ok) return null
    const blob = await res.blob()
    const type = blob.type.toLowerCase()
    const urlLooksGif = /\.gif(\?|$)/i.test(u)

    if (type === 'image/gif' || urlLooksGif) {
      const buf = await blob.arrayBuffer()
      return new Blob([buf], { type: 'image/gif' })
    }

    if (type === 'image/webp' || /\.webp(\?|$)/i.test(u)) {
      const buf = await blob.arrayBuffer()
      if (isAnimatedWebpBuffer(buf)) {
        const bmp = await createImageBitmap(new Blob([buf], { type: 'image/webp' }))
        try {
          return await bitmapToPngBlob(bmp)
        } finally {
          bmp.close()
        }
      }
    }

    return await blobToPngBlob(blob)
  } catch {
    return null
  }
}
