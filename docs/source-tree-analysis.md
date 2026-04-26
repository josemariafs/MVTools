# Análisis del árbol de fuentes: MVTools

Estructura orientada a la **navegación humana y a agentes de IA**; no es un listado exhaustivo de cada archivo.

## Raíz del repositorio

| Ruta | Propósito |
|------|------------|
| `package.json` / `pnpm-lock.yaml` | Dependencias, scripts, parches pnpm |
| `vite.config.ts` | Build, plugin web-extension, zip de releases |
| `tsconfig.json` / `components.json` | TypeScript y convención UI (shadcn) |
| `tailwind.config.ts` / `postcss` | Estilos |
| `patches/` | Parches a Radix y `@google/genai` |
| `README.md` | Documentación principal del producto |
| `docs/` | **Índice y documentación generada** para contexto (este conjunto) |
| `.cursor/skills/` | Skills BMad (workflows, agentes) para Cursor — **no** son parte del runtime de la extensión |
| `_bmad/` | Config e instalación BMad (scripts, `bmm/config.yaml`, etc.) |

## `src/` — código de la extensión

```
src/
├── manifest.ts              # Definición del manifest; matches de content scripts
├── constants/               # URLs y constantes (p. ej. orígenes permitidos)
├── entries/
│   ├── background/         # service-worker
│   ├── contentScript/      # main global, sections por página, inyectados, utils
│   ├── popup/              # app React del popup, secciones de configuración
│   └── enableDevHmr.ts
├── features/                # Módulos por dominio: thread, reports, markers, chollometro, pinned-threads, private-messages, …
├── components/ui/          # Primitivos de interfaz reutilizables
├── services/                # Lógica de red, config, almacenamiento, IA
├── store/                  # Estado global (p. ej. config)
├── providers/              # React Query, tema
├── hooks/                  # Hooks compartidos
├── types/                  # Tipos TypeScript, Zod, storage, mensajes
└── utils/                  # DOM, logging, sombra, aserciones, etc.
```

### Entradas críticas

- **`entries/popup/`** — *entry* del popup: `main.tsx`, `App.tsx`, formularios de usuarios, Gemini, estilos.
- **`entries/contentScript/global/main.ts`** — script global con match amplio en Mediavida.
- **`entries/contentScript/sections/*`** — un bundle por área (hilo, favoritos, ignorados, MP, reportes, clones, Chollometro, marcadores, …).
- **`entries/background/service-worker.ts`** — eventos de extensión y mensajería.

### Features (dominio de producto)

- `features/thread/` — hilo, posts, usuarios (ignorar, notas, resaltado, IA).
- `features/reports/`, `features/markers/`, `features/pinned-threads/`, `features/private-messages/`, `features/chollometro/` — funcionalidad por sección del sitio.

## Activos y estáticos

- `src/shared/icons/` — iconos referenciados en el manifest.
- Hojas de estilo de content script: p. ej. `content-script.css`, `premium-styles.css` bajo `contentScript/`.

## Salida de build

- **`dist/`** — no versionar como “fuente”; es el build consumido por `web-ext` o tiendas.
- **`releases/`** — ZIPs cuando `ZIP=true`.

---

*Para añadir archivos o renombrar carpetas, actualizar este documento o regenerar con un escaneo más profundo.*
