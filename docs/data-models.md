# Modelo de datos y persistencia: MVTools

La extensión **no** expone una base de datos propia. El estado relevante vive en el **almacenamiento del navegador** (`chrome.storage` a través de `webextension-polyfill`), con claves lógicas centralizadas y esquemas de validación donde el código lo exige (p. ej. Zod para mensajes y payloads).

## Claves de almacenamiento (browser)

Definidas en `src/types/storage.ts`:

| Clave lógica | Constante | Uso aproximado |
|--------------|-----------|----------------|
| Configuración de estilos | `STYLES_CONFIG` / `stylesConfig` | Preferencias de apariencia en el sitio |
| Configuración global | `GLOBAL_CONFIG` / `globalConfig` | Ajustes generales de la extensión |
| Tareas de actualización | `PERFORMED_UPGRADE_TASKS` / `performedUpgradeTasks` | Seguimiento de migraciones/ upgrades |
| Versión de migración | `EXTENSION_MIGRATED_FROM_VERSION` / `extensionMigratedFromVersion` | Trazabilidad de versión previa |
| Preferencias de usuario | `USER_PREFERENCES` / `userPreferences` | Preferencias por usuario o UI |

*Los valores concretos (forma JSON) se implementan en `src/services/config.ts`, `src/services/storage.ts` y tipos asociados en `src/types/` — conviene leer el código al cambiar el esquema.*

## Mensajes en tiempo de ejecución

- **`src/types/event-messages.ts`** — tipos y esquemas Zod para mensajes entre *popup*, *content* y *background* (p. ej. `DefaultEventListenerPayloadSchema`, payloads de negocio como `Deal` / *deals* de Chollometro).
- El **service worker** valida mensajes entrantes antes de enrutarlos (`service-worker.ts`).

## Datos de dominio (Mediavida / sitio)

- **`src/types/media-vida.ts`** y similares — estructuras que reflejan el dominio del foro y APIs del propio sitio, no un esquema SQL.

## Fuentes externas (API)

- **Google Gemini** — uso vía `@google/genai` desde la lógica de servicios; no implica almacenamiento estructurado en repo, sino llamadas bajo claves de API del usuario (según flujo de configuración en el popup).

## Relación con “data models” del workflow

En la fila `extension` de `documentation-requirements.csv`, `requires_data_models` es *false*; este documento describe **persistencia y contratos lógicos** en lugar de tablas o ORM.

---

*Para un inventario exhaustivo de cada campo JSON, un escaneo *deep* leería `services/config.ts` y esquemas Zod asociados línea a línea.*
