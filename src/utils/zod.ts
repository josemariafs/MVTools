import { type RefinementCtx, z } from 'zod'

export const asyncValidator =
  <T extends string>(asyncFn: (value: T) => Promise<any>, needsValue = false) =>
  async (value: T, ctx: RefinementCtx) => {
    if (needsValue && !value) return value

    try {
      await asyncFn(value)
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: (error as Error).message
      })
    }
  }
