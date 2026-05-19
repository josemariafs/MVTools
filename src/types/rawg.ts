import { z } from 'zod'

export const rawgShortScreenshotSchema = z.object({
  id: z.number(),
  image: z.string()
})

/**
 * `parent_platforms` agrupa las plataformas en familias (PC, PlayStation, Xbox,
 * Nintendo, iOS, Mac, Linux, Android, Web…). Más conveniente para iconos que el
 * `platforms` granular (PS5 vs PS4 vs PS Vita…).
 */
const rawgParentPlatformEntrySchema = z
  .object({
    platform: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional()
      })
      .partial()
      .optional()
  })
  .partial()

export const rawgGameListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  released: z.string().nullable(),
  background_image: z.string().nullable().optional(),
  short_screenshots: z.array(rawgShortScreenshotSchema).optional(),
  parent_platforms: z.array(rawgParentPlatformEntrySchema).nullable().optional()
})

export const rawgGamesPageSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  results: z.array(rawgGameListItemSchema)
})

export type RawgGameListItem = z.infer<typeof rawgGameListItemSchema>

export const rawgUpcomingCacheSchema = z.object({
  /** YYYY-MM-DD,YYYY-MM-DD (misma que se usó en la petición) */
  dateRangeKey: z.string(),
  fetchedAt: z.number(),
  games: z.array(rawgGameListItemSchema)
})

export type RawgUpcomingCache = z.infer<typeof rawgUpcomingCacheSchema>

/** Respuesta parcial de GET /api/games/{id} (Épica 2) */
const rawgPlatformEntrySchema = z
  .object({
    platform: z.object({ name: z.string().optional(), slug: z.string().optional() }).partial().optional()
  })
  .partial()

const rawgNamedEntitySchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    slug: z.string().optional()
  })
  .partial()

const rawgStoreInfoSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    domain: z.string().optional()
  })
  .partial()

/**
 * En GET /api/games/{id} la tienda viene anidada en `store`. La `url` real (Steam, GOG…)
 * suele venir de GET /api/games/{id}/stores; aquí la dejamos opcional.
 */
const rawgGameStoreSchema = z
  .object({
    id: z.number().optional(),
    url: z.string().optional(),
    store: rawgStoreInfoSchema.optional(),
    store_id: z.number().optional()
  })
  .partial()

/** Vínculos de vídeo en RAWG (`data.max`, `data.480`, a menudo YouTube embed). */
export const rawgMovieSchema = z
  .object({
    data: z.record(z.string(), z.unknown()).optional()
  })
  .passthrough()

export type RawgMovieItem = z.infer<typeof rawgMovieSchema>

/** GET /api/games/{id}/movies */
export const rawgGameMoviesPageSchema = z.object({
  count: z.number().optional(),
  results: z.array(rawgMovieSchema).optional()
})

export const rawgGameDetailSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().optional().nullable(),
    description_raw: z.string().optional().nullable(),
    released: z.string().nullable().optional(),
    background_image: z.string().nullable().optional(),
    background_image_additional: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    short_screenshots: z.array(rawgShortScreenshotSchema).nullable().optional(),
    /**
     * En GET /api/games/{id} `platforms` viene como ARRAY de `{ platform: { name } }`.
     * En GET /api/games (lista) también es un array. La forma `{ results: [...] }`
     * sólo aplica a otros endpoints anidados.
     */
    platforms: z.array(rawgPlatformEntrySchema).nullable().optional(),
    /** Mismas entradas que en listados; a veces útil si `platforms` no es granular. */
    parent_platforms: z.array(rawgParentPlatformEntrySchema).nullable().optional(),
    developers: z.array(rawgNamedEntitySchema).nullable().optional(),
    publishers: z.array(rawgNamedEntitySchema).nullable().optional(),
    genres: z.array(rawgNamedEntitySchema).nullable().optional(),
    stores: z.array(rawgGameStoreSchema).nullable().optional(),
    movies: z.array(rawgMovieSchema).nullable().optional()
  })
  .passthrough()

export type RawgGameDetail = z.infer<typeof rawgGameDetailSchema>

/** GET /api/games/{id}/stores: trae la `url` real de la tienda (Steam, GOG…). */
export const rawgGameStoresPageSchema = z.object({
  count: z.number().optional(),
  results: z
    .array(
      z
        .object({
          id: z.number().optional(),
          game_id: z.number().optional(),
          store_id: z.number().optional(),
          url: z.string().optional()
        })
        .partial()
    )
    .default([])
})

export type RawgGameStoresPage = z.infer<typeof rawgGameStoresPageSchema>
