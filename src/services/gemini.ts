import { GoogleGenAI, type ListModelsConfig } from '@google/genai'

import { RULES } from '@/constants/templates'

export const ACTIONS = {
  RULES: 'rules',
  SUMMARY: 'summary'
} as const

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS]

export const DEFAULT_MODEL = 'gemini-2.0-flash-lite'

const ERROR_MESSAGES = {
  400: 'La API Key no es válida',
  429: 'Se ha alcanzado el límite de uso de la API Key',
  404: 'El modelo no existe o no es accesible con la API Key proporcionada'
} as const

type ErrorMessageKey = keyof typeof ERROR_MESSAGES

const isDocumentedErrorCode = (status: number): status is ErrorMessageKey => Object.keys(ERROR_MESSAGES).includes(status.toString())

interface CustomError extends Error {
  code?: number;
}

const getCustomError = (error: unknown, defaultMessage: string): CustomError => {
  const customError = new Error(defaultMessage) as CustomError;
  
  if (error instanceof Error) {
    const status = (error as any).status || (error as any).code;
    if (status && isDocumentedErrorCode(status)) {
      customError.message = ERROR_MESSAGES[status];
      customError.code = status;
    }
  }
  
  return customError;
}

const getCommentPrompt = (action: Action, comment?: string) => {
  if (action === ACTIONS.RULES) {
    return `Analiza y dime el número de normas que se incumple del siguiente texto '${RULES}' en el siguiente comentario '${comment}'.
      - Devuélveme el resultado únicamente en formato de tabla HTML con la clase 'reporte-ia' sin que empiece con  \`\`\`html.
      - Si no se incumple ninguna norma, devuélveme únicamente un texto entre tags 'p' que diga 'No se incumple ninguna norma' y no incluyas la tabla html del punto anterior'.
      - Esta tabla HTML debe de tener dos columnas: Columna 0: 'Norma' y columna 1: 'Motivo'.`
  }

  return `Resúmeme el siguiente texto en un máximo de 2 frases: ${comment}`
}

export interface AnalyzeCommentParams {
  comment: string
  action: Action
  apiKey: string
  model: string
}

export const analyzeComment = async ({ comment, action, apiKey, model }: AnalyzeCommentParams) => {
  try {
    const genAI = new GoogleGenAI({ apiKey })
    const response = await genAI.models.generateContent({ model, contents: getCommentPrompt(action, comment) })
    return response.text ?? 'No se ha podido analizar el comentario. Por favor, inténtalo de nuevo.'
  } catch (error) {
    throw getCustomError(error, 'Ha habido un error al intentar analizar el comentario. Por favor, inténtalo de nuevo.')
  }
}

export const getModels = async (apiKey: string, config?: ListModelsConfig) => {
  try {
    const genAI = new GoogleGenAI({ apiKey })
    const pager = await genAI.models.list({ config: { pageSize: 1000, ...config } })
    const models = pager.page
    // If the page size is 1, we asume that is for checking the API Key
    if (config?.pageSize === 1) return models

    while (pager.hasNextPage()) {
      const nextPage = await pager.nextPage()
      models.push(...nextPage)
    }

    return models
  } catch (error) {
    throw getCustomError(error, 'No se ha podido obtener la lista de modelos. Por favor, inténtalo de nuevo.')
  }
}

export const checkApiKey = async (apiKey: string) => {
  try {
    await getModels(apiKey, { pageSize: 1 })
  } catch (error) {
    throw getCustomError(error, 'No se ha podido validar la API Key. Por favor, inténtalo de nuevo.')
  }
}
