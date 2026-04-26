# Guía de desarrollo: MVTools

Esta guía **complementa** [README.md](../README.md) con enfoque en estructura del repo y comandos. Ante duda sobre flujos detallados (Firefox vs Chrome, parches Radix, ZIP), el README sigue siendo la referencia.

## Requisitos

- **Node.js** 22 o superior (recomendado en README).
- **pnpm** (gestor usado en el proyecto).

## Instalación

```bash
pnpm install
```

Los parches de `pnpm.patchedDependencies` se aplican en la instalación.

## Comandos principales

| Comando | Uso |
|---------|-----|
| `pnpm dev` | Servidor Vite con HMR (Chrome) |
| `pnpm serve` | Lanza Chromium con `web-ext` apuntando a `dist/` y Mediavida |
| `pnpm watch` / `pnpm watch:firefox` | Watch con minify desactivado o variante Firefox |
| `pnpm serve:firefox` | Firefox + extensión desde `dist/` |
| `pnpm build` | Build producción Chrome → `dist/` |
| `pnpm build:firefox` | Build producción Firefox |
| `ZIP=true pnpm build` (o `build:firefox`) | ZIP en `releases/` |
| `pnpm lint` / `pnpm lint:fix` | Prettier + ESLint |
| `pnpm ts:check` | `tsc --noEmit` |
| `pnpm knip` / `pnpm knip:fix` | Análisis de dependencias y dead code |

## Flujos de trabajo

### Chrome (recomendado, con HMR)

1. Terminal 1: `pnpm dev`
2. Terminal 2: `pnpm serve`
3. Cargar extensión desde `dist/` conectada al dev server; ver README para matices de recarga.

### Firefox

- `pnpm watch:firefox` + `pnpm serve:firefox`; suele requerir **recarga manual** de la extensión tras cambios (README).

## Variables y entorno de build

- `BROWSER` — `chrome` o `firefox` (véase `vite.config.ts`, por defecto Chrome).
- `ZIP` — `true` para generar archivo en `releases/`.
- Variables Vite estándar vía `loadEnv` (prefijos según configuración del proyecto).

## Calidad de código

- **ESLint** con `eslint-config-love` y plugins React, Prettier, Tailwind, etc.
- **Prettier** para formato.
- Alias `@/` → `src/` (Vite y TS).

## Recursos de IA en el repo (no runtime)

- **`.cursor/skills/`** — skills BMad (PRD, arquitectura, agentes, etc.): útiles para quien usa Cursor, no se empaquetan en la extensión.
- **`_bmad/`** — configuración y scripts del instalador BMad; `bmm/config.yaml` define `project_knowledge: docs/`, alineado con esta carpeta.

## Incidencias frecuentes

- Tras parches a Radix: si publican versión con fix, seguir el checklist del README para quitar `patches/`.
- Cambios en `manifest.ts` o en *matches* de content scripts: probar en las URLs reales listadas en constantes y manifest.

---

*Escaneo quick; validar en CI local con `pnpm lint` y `pnpm ts:check` antes de un PR.*
