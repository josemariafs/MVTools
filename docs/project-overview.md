# Resumen del proyecto: MVTools

**Nombre:** `mv-tools` (MVTools)  
**Versión:** 3.2.1 (según `package.json`)  
**Propósito:** extensión de navegador que añade herramientas y mejoras de UX para [www.mediavida.com](https://www.mediavida.com) (foro) y funcionalidades relacionadas (p. ej. integración con Chollometro).

## Resumen ejecutivo

MVTools se empaqueta como extensión **Manifest V3** (con variaciones para Firefox) usando **Vite** y **React 19**. El código se organiza en **puntos de entrada** de extensión: popup, varios *content scripts* alineados con rutas concretas del sitio, y un *service worker* en segundo plano. La configuración del usuario y el estado viven en el almacenamiento del navegador (`chrome.storage` vía `webextension-polyfill`), con esquemas validados (p. ej. Zod) donde aplica.

Además del producto (extensión), el repositorio incluye **recursos BMad** bajo `.cursor/skills/` y `_bmad/`, orientados a flujos de análisis y documentación con IA en Cursor; no forman parte del *bundle* de la extensión.

## Tipo de repositorio y documentación

| Aspecto | Valor |
|--------|--------|
| Tipo | Monolito (un solo artefacto: extensión) |
| Clasificación funcional | Extensión de navegador (WebExtension) |
| Documentación de usuario y desarrollador (canónica) | [README.md](../README.md) en la raíz |
| Documentación para contexto de IA (este directorio) | `docs/index.md` y documentos vinculados |

## Pila tecnológica (síntesis)

| Categoría | Tecnologías |
|-----------|-------------|
| UI | React 19, Radix UI, Tailwind CSS, shadcn-style (`src/components/ui/`) |
| Compilación | Vite 5, `@samrum/vite-plugin-web-extension` |
| Datos y estado | TanStack Query, TanStack Store, TanStack Form, Zod |
| Extensión | `webextension-polyfill`, *content scripts*, MV3, builds Chrome/Firefox |
| Calidad | ESLint (eslint-config-love), Prettier, TypeScript estricto, Knip |
| IA (cliente) | `@google/genai` |

## Enlaces a documentación generada

- [Arquitectura](./architecture.md) — entradas, mensajes, capas
- [Árbol de fuentes](./source-tree-analysis.md) — carpetas y responsabilidades
- [Guía de desarrollo](./development-guide.md) — comandos y flujos
- [Inventario de componentes UI](./component-inventory.md)
- [Modelo de datos (almacenamiento)](./data-models.md)

## Primeros pasos (desarrollador)

1. Requisitos: Node 22+, pnpm (ver [README.md](../README.md))
2. `pnpm install`
3. Desarrollo Chrome: `pnpm dev` + `pnpm serve` (ver guía de desarrollo)

---

*Documento generado en el flujo *document project* (escaneo inicial, nivel quick). Para detalle de producto, priorizar el README y el código bajo `src/`.*
