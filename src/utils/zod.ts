import type { FormValidateAsyncFn } from '@tanstack/react-form'
import { type RefinementCtx, z, type ZodIssue, type ZodSchema } from 'zod'
export const asyncValidator =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We need to handle any async function
  <T>(asyncFn: (value: T) => Promise<any>, needsValue = false) =>
    async (value: T, ctx: RefinementCtx) => {
      if (needsValue && value == null) return value

      try {
        await asyncFn(value)
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: (error as Error).message
        })
      }
    }

const prefixSchemaToErrors = (issues: readonly ZodIssue[]) => {
  const schema = new Map<string, ZodIssue[]>()

  for (const issue of issues) {
    const path = [...issue.path]
      .map(segment => (typeof segment === 'number' ? `[${segment}]` : segment))
      .join('.')
      .replace(/\.\[/g, '[')

    schema.set(path, (schema.get(path) ?? []).concat(issue))
  }

  return Object.fromEntries(schema)
}

export const checkSchemaOnSubmitAsync =
  <TFormData>(schema: ZodSchema<TFormData>): FormValidateAsyncFn<TFormData> =>
  async ({ value }) => {
    const validation = await schema.safeParseAsync(value)
    if (!validation.success) {
      const schemaErrors = prefixSchemaToErrors(validation.error.issues)
      return {
        form: schemaErrors,
        fields: schemaErrors
      }
    }
  }
