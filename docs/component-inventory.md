# Inventario de componentes UI: MVTools

Inventario basado en la carpeta `src/components/ui/` (patrón **shadcn/ui** / Radix). Lista orientativa; los *features* añaden componentes bajo `src/features/**/components/` no listados aquí de uno en uno.

## Primitivos en `src/components/ui/`

| Componente (archivo) | Rol típico |
|----------------------|------------|
| `alert-dialog.tsx` | Diálogos de confirmación (Radix Alert Dialog) |
| `button.tsx` | Botones |
| `checkbox.tsx` | Casillas |
| `command.tsx` | Paleta/comando (cmdk) |
| `form.tsx` | Integración con formularios (TanStack Form + Radix Label) |
| `label.tsx` | Etiquetas accesibles |
| `popover.tsx` | Contenido flotante |
| `separator.tsx` | Divisores visuales |
| `sonner.tsx` | Toasts (sonner) |
| `switch.tsx` | Interruptores |
| `table.tsx` | Tablas de datos |
| `tooltip.tsx` | Tooltips |
| `password-input.tsx` | Entrada de contraseña (variante) |

## Componentes de feature y *shared*

- **`src/features/shared/components/`** — `portal`, piezas UI reutilizadas entre secciones (p. ej. `ignore-user`, `ai-button`, `ai-message`).
- **`src/features/**/components/`** — UI específica de hilo, marcadores, MP, Chollometro, etc.
- **Popup** — composición de secciones bajo `src/entries/popup/components/sections/` (configuración global, estilos, formularios de usuarios, Gemini, migración desde localStorage).

## Sistema de diseño

- **Estilos:** Tailwind CSS + `class-variance-authority` + `tailwind-merge` (ver `src/utils/tailwind.ts`).
- **Iconos:** Lucide (`lucide-react`).
- **Tema:** claro/oscuro vía `theme-provider` y CSS variables acordes al popup.

## Nota de escaneo

En modo **quick** no se listan los ~150+ archivos de `features/`; un **deep scan** podría ampliar esta tabla con componentes por dominio (thread, reports, …).

---

*Última actualización: generación document-project (inicial, quick).*
