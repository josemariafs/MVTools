import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import loveConfig from 'eslint-config-love'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'

const files = ['**/*.{js,cjs,mjs,mts,ts,jsx,tsx}']
const ignoreFiles = ['**/old-code/**']

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const gitignorePath = path.resolve(_dirname, '.gitignore')

/** @type {import("eslint").Linter.Config} */
export default [
  { ignores: [...ignoreFiles, ...includeIgnoreFile(gitignorePath).ignores!] },
  loveConfig,
  reactPlugin.configs.flat.recommended,
  ...tanstackQuery.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    files,
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended!.languageOptions,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      tailwindcss: {
        config: './tailwind.config.js',
        cssFiles: []
      }
    },

    rules: {
      // react
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unstable-nested-components': 'error',
      'react/no-deprecated': 'off',
      'react/no-children-prop': 'off',
      // @typescript-eslint
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false
        }
      ],

      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true,
          allowNumber: true,
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: true
        }
      ],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      // simple-import-sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // tailwindcss
      'tailwindcss/no-custom-classname': 'off',
      // @tanstack/query
      '@tanstack/query/prefer-query-object-syntax': 'off',
      // @atlaskit/design-system
      '@atlaskit/design-system/no-unsafe-style-overrides': 'off',
      '@atlaskit/design-system/ensure-design-token-usage': 'off',
      '@atlaskit/design-system/no-unsafe-design-token-usage': 'off',
      'max-nested-callbacks': ['error', 4],
      // custom rules
      // error on console.log
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console'][callee.property.name=/^(log)$/]",
          message: 'Unexpected console.log found, please remove it.'
        }
      ]
    }
  }
]
