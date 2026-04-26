import { z } from 'zod'

/**
 * Cliente ligero para `store.steampowered.com/api/appdetails`.
 *
 * - Llamado SIEMPRE desde el background (CORS prohibe la llamada desde un content
 *   script que vive en mediavida.com). Ver `entries/background/steam-handlers.ts`.
 * - Pedimos `cc=es&l=spanish` para conseguir descripción en castellano cuando exista.
 */

/** ID de tienda RAWG → Steam */
export const RAWG_STORE_ID = {
  STEAM: 1,
  GOG: 5,
  EPIC: 11
} as const

/** Extrae el AppID numérico de una URL `store.steampowered.com/app/{id}/...`. */
export function extractSteamAppIdFromUrl(url: string | null | undefined): number | null {
  if (!url) return null
  const match = /store\.steampowered\.com\/app\/(\d+)/i.exec(url)
  const raw = match?.[1]
  if (!raw) return null
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

const screenshotSchema = z
  .object({
    id: z.number().optional(),
    path_thumbnail: z.string().optional(),
    path_full: z.string().optional()
  })
  .partial()

const appDetailsDataSchema = z
  .object({
    name: z.string().optional(),
    short_description: z.string().optional(),
    detailed_description: z.string().optional(),
    about_the_game: z.string().optional(),
    header_image: z.string().optional(),
    capsule_image: z.string().optional(),
    screenshots: z.array(screenshotSchema).optional()
  })
  .partial()

const appDetailsResponseEntrySchema = z.object({
  success: z.boolean(),
  data: appDetailsDataSchema.optional()
})

/** Respuesta cruda: `{ "<appid>": { success, data? } }` */
export const appDetailsResponseSchema = z.record(z.string(), appDetailsResponseEntrySchema)
export type AppDetailsResponse = z.infer<typeof appDetailsResponseSchema>

/** Subconjunto que usamos para enriquecer la ficha. */
export interface SteamGameInfo {
  appId: number
  name?: string
  shortDescription?: string
  headerImage?: string
  /** URL canónica de tienda (sin parámetros de tracking). */
  storeUrl: string
  /** URLs `path_full` (1920×1080), limitadas. */
  screenshots: string[]
}

const STEAM_API_BASE = 'https://store.steampowered.com/api/appdetails'
const MAX_SCREENSHOTS = 6

/**
 * Llama a `appdetails` y normaliza los datos. Lanza con mensaje legible si falla,
 * porque el caller decide si tolerar el error o propagarlo.
 */
export async function fetchSteamAppDetails(appId: number, languageCc: { l?: string; cc?: string } = {}): Promise<SteamGameInfo> {
  if (!Number.isFinite(appId) || appId <= 0) {
    throw new Error(`AppID Steam inválido: ${String(appId)}`)
  }
  const url = new URL(STEAM_API_BASE)
  url.searchParams.set('appids', String(appId))
  url.searchParams.set('l', languageCc.l ?? 'spanish')
  url.searchParams.set('cc', languageCc.cc ?? 'es')

  const res = await fetch(url.toString(), { method: 'GET' })
  if (!res.ok) {
    throw new Error(`Steam appdetails ${res.status}`)
  }
  const json: unknown = await res.json()
  const parsed = appDetailsResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Formato inesperado de Steam appdetails.')
  }
  const entry = parsed.data[String(appId)]
  if (!entry?.success || !entry.data) {
    throw new Error('Steam no devolvió datos para este AppID.')
  }
  const d = entry.data
  const screenshots = (d.screenshots ?? [])
    .map(s => s.path_full)
    .filter((s): s is string => typeof s === 'string' && s.trim() !== '')
    .slice(0, MAX_SCREENSHOTS)

  return {
    appId,
    name: d.name,
    shortDescription: d.short_description,
    headerImage: d.header_image,
    storeUrl: `https://store.steampowered.com/app/${appId}/`,
    screenshots
  }
}
