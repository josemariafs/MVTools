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
    return `Analiza y dime el numero de normas que se incumple del siguiente texto '${RULES}' en el siguiente comentario '${comment}'.
    Devuelveme el resultado en formato html table con clase 'reporte-ia'. Esta tabla html debe de tener dos columnas. 
    Columna 0: 'Norma' y columna 1: 'Motivo'. `
  }

  return `Resumeme el siguiente texto en un máximo de 2 frases: ${comment}`
}

export const analyzeComment = async ({ comment, action, apiKey }: { comment: string; action: Action; apiKey: string }) => {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL })
  const prompt = getCommentPrompt(action, comment)
  const result = await model.generateContent([prompt])
  return result.response.text()
}

export type AnalyzeCommentParams = Parameters<typeof analyzeComment>[0]

export const testApiKey = async (apiKey: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL })
    await model.generateContent(['Test'])
    return { ok: true, status: 200 }
  } catch (error) {
    const response = { ok: false, status: 500 }
    if (error instanceof GoogleGenerativeAIFetchError) {
      response.status = error.status ?? 500
    }
    return response
  }
}
