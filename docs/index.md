# Índice de documentación del proyecto (MVTools)

Documentación generada para **contexto de IA y onboarding técnico**. La guía de producto y desarrollo detallada sigue en el [README principal](../README.md).

## Descripción rápida

| Campo | Valor |
|--------|--------|
| Tipo de repositorio | Monolito (extensión WebExtension) |
| Producto | MVTools — mejoras para mediavida.com (y rutas relacionadas) |
| Idioma de los artefactos | Español (`document_output_language` en `_bmad/bmm/config.yaml`) |
| Pila principal | React 19, TypeScript, Vite, pnpm, Tailwind, TanStack, Radix |

## Documentación generada en `docs/`

- [Resumen del proyecto](./project-overview.md) — propósito, pila, enlaces
- [Arquitectura](./architecture.md) — popup, content scripts, background, diagrama
- [Árbol de fuentes](./source-tree-analysis.md) — estructura de `src/` y raíz
- [Guía de desarrollo](./development-guide.md) — comandos, flujos Chrome/Firefox
- [Inventario de componentes UI](./component-inventory.md) — primitivos bajo `components/ui/`
- [Modelo de datos (almacenamiento)](./data-models.md) — claves y mensajes

## Documentación existente (repositorio)

- [README.md](../README.md) — funcionalidades, requisitos, desarrollo, build, parches, licencia

## Recursos de método BMad (no son el bundle de la extensión)

- **`.cursor/skills/`** — skills y workflows (PRD, UX, arquitectura, agentes, documentación, etc.)
- **`_bmad/`** — configuración del instalador BMad y scripts de resolución

## Cómo empezar (desarrollador)

1. Leer [README.md](../README.md) (instalación y `pnpm dev` + `pnpm serve`).
2. Abrir [Guía de desarrollo](./development-guide.md) y [Arquitectura](./architecture.md) para contexto.
3. Usar [Índice de fuentes](./source-tree-analysis.md) para localizar *features*.

## Estado del flujo *document project*

- **Modo:** escaneo inicial (`initial_scan`)
- **Nivel:** quick (patrones, manifiestos, estructura; sin lectura exhaustiva de cada fuente)
- **Estado detallado:** [project-scan-report.json](./project-scan-report.json)

---

*Índice maestro — punto de entrada recomendado para PRD brownfield o tareas con agentes de código.*
