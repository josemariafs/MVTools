import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai'

import { RULES } from '@/constants/templates'

export const ACTIONS = {
  RULES: 'rules',
  SUMMARY: 'summary'
} as const

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS]

const DEFAULT_MODEL = 'gemini-1.5-pro'

const getCommentPrompt = (action: Action, comment?: string) => {
  if (action === ACTIONS.RULES) {
    return `Analiza y dime el número de normas que se incumple del siguiente texto '${RULES}' en el siguiente comentario '${comment}'.
      - Devuélveme el resultado únicamente en formato de tabla HTML con la clase 'reporte-ia' sin que empiece con  \`\`\`html.
      - Si no se incumple ninguna norma, devuélveme únicamente un texto entre tags 'p' que diga 'No se incumple ninguna norma' y no incluyas la tabla html del punto anterior'.
      - Esta tabla HTML debe de tener dos columnas: Columna 0: 'Norma' y columna 1: 'Motivo'.`
  }

  return `Resúmeme el siguiente texto en un máximo de 2 frases: ${comment}`
}

export const analyzeComment = async ({ comment, action, apiKey }: { comment: string; action: Action; apiKey: string }) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL })
    const prompt = getCommentPrompt(action, comment)
    const result = await model.generateContent([prompt])
    return result.response.text()
  } catch (error) {
    let errorMessage = 'Ha habido un error al intentar analizar el comentario. Por favor, inténtalo de nuevo.'
    if (error instanceof GoogleGenerativeAIFetchError) {
      errorMessage = error.status === 429 ? 'Se ha alcanzado el límite de uso de la API Key' : errorMessage
    }
    throw new Error(errorMessage)
  }
}

export type AnalyzeCommentParams = Parameters<typeof analyzeComment>[0]

export const checkApiKey = async (apiKey: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL })
    await model.generateContent(['Test'])
  } catch (error) {
    let errorMessage = 'No se ha podido validar la API Key. Por favor, inténtalo de nuevo.'
    if (error instanceof GoogleGenerativeAIFetchError) {
      errorMessage = error.status === 400 ? 'La API Key no es válida' : errorMessage
    }
    throw new Error(errorMessage)
  }
}
