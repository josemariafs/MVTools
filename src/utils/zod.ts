import type { FormValidateAsyncFn } from '@tanstack/react-form'
import { type RefinementCtx, z, type ZodIssue, type ZodSchema } from 'zod'
export const asyncValidator =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We need to handle any async function
  <T>(asyncFn: (value: T) => Promise<any>, needsValue = false) =>
    async (value: T, ctx: RefinementCtx) => {
      if (needsValue && (value == null || value === '')) return z.NEVER

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

const checkSchemaOnValidatorAsync = async <TFieldData>({
  schema,
  value,
  validationSource = 'field'
}: {
  schema: ZodSchema<TFieldData>
  value: TFieldData
  validationSource?: 'field' | 'form'
}) => {
  const validation = await schema.safeParseAsync(value)
  if (!validation.success) {
    if (validationSource === 'field') return validation.error.issues

    const schemaErrors = prefixSchemaToErrors(validation.error.issues)
    return {
      form: schemaErrors,
      field: schemaErrors
    }
  }
}

export const checkSchemaOnFieldValidatorAsync =
  <TData>(schema: ZodSchema<TData>) =>
  ({ value }: { value: TData }) =>
    checkSchemaOnValidatorAsync({ schema, value, validationSource: 'field' })

export const checkSchemaOnFormValidatorAsync =
  <TFormData>(schema: ZodSchema<TFormData>): FormValidateAsyncFn<TFormData> =>
  ({ value }) =>
    checkSchemaOnValidatorAsync({ schema, value, validationSource: 'form' })
