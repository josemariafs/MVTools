# MVTools v3.0.0

[![Mediavida](https://img.shields.io/badge/Target-Mediavida.com-orange)](https://www.mediavida.com)
[![Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/Aleksnako/MVTools)
[![Tech Stack](https://img.shields.io/badge/Stack-React_19_/_Vite_/_TS-brightgreen)](https://github.com/Aleksnako/MVTools/tree/refactor/new-stack)
[![Version](https://img.shields.io/badge/Version-3.0.0-blue)](package.json)

Herramientas adicionales y mejoras para la web [www.mediavida.com](https://www.mediavida.com).

Esta versión (v3.0.0) representa una reescritura utilizando un stack tecnológico moderno basado en React 19, Vite, TypeScript y Tailwind CSS, desarrollada originalmente por `@josemariafs` y mantenida/evolucionada en este fork.

MVTools es una extensión de navegador diseñada para mejorar la experiencia de usuario en el foro de Mediavida, ofreciendo herramientas adicionales para la navegación, organización de contenido, gestión de usuarios y más.

## Funcionalidades

### Mejoras de Hilos y Reportes
* Integración con IA para análisis de contenido

### Sistema de Gestión de Usuarios
* Funcionalidad para ignorar usuarios
* Sistema de notas de usuario
* Resaltado de usuarios

### Organización de Contenido
* Gestión mejorada de hilos favoritos e ignorados
* Interfaz mejorada de mensajes privados

### Extensiones del Sitio
* Integración con Chollometro.com
* Herramientas de moderación (reportes, clones)
* Mejoras globales del sitio

### Interfaz de Usuario
* Interfaz emergente para configuraciones y acciones rápidas
* Estilo consistente con mediavida.com
* Diseño responsivo para varios tamaños de pantalla
* Cumplimiento de accesibilidad

## Stack Tecnológico Principal

* **Framework:** React 19 + TypeScript
* **Bundler:** Vite con `@samrum/vite-plugin-web-extension`
* **Gestor de Paquetes:** pnpm
* **UI:** Radix UI Primitives + shadcn/ui (implícito) + Tailwind CSS
* **Estado/Datos:** TanStack Query (Server State) + TanStack Store (Client State?) + Zod (Validación)
* **Formularios:** TanStack Form
* **APIs Extensión:** `webextension-polyfill`
* **Iconos:** Lucide Icons
* **IA:** `@google/generative-ai`
* **Linting/Formatting:** ESLint (Config: `eslint-config-love`) + Prettier
* **Análisis Dependencias:** Knip

## Configuración del Proyecto

**Requisitos Previos:**

* Node.js (v22 o superior)
* pnpm (Instálalo con `npm install -g pnpm` si no lo tienes)

**Pasos:**

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/Aleksnako/MVTools.git](https://github.com/Aleksnako/MVTools.git)
    # O clona una rama específica si es necesario:
    # git clone [https://github.com/Aleksnako/MVTools.git](https://github.com/Aleksnako/MVTools.git) -b refactor/new-stack
    cd MVTools
    ```

2.  **Instalar Dependencias:**
    ```bash
    pnpm install
    ```
    *Nota: Al instalar, pnpm aplicará automáticamente los parches necesarios para Radix UI (ver sección "Dependencias Parchadas").*

## Desarrollo

El desarrollo de esta extensión tiene flujos ligeramente diferentes dependiendo del navegador destino, debido a las capacidades actuales de HMR con la configuración utilizada.

**1. Desarrollo en Chrome / Chromium (Recomendado - Con HMR)**

Este es el flujo más rápido y recomendado gracias al Hot Module Replacement (HMR). Requiere dos terminales.

* **Terminal 1: Servidor de Desarrollo (`pnpm dev`)**
    ```bash
    pnpm dev
    ```
  Inicia el servidor Vite. El plugin `@samrum/vite-plugin-web-extension` habilita HMR y prepara `dist/` para que `pnpm serve` pueda conectarse. **Mantenla abierta.**

* **Terminal 2: Ejecutar Extensión (`pnpm serve`)**
    ```bash
    pnpm serve
    ```
  Lanza Chromium con un perfil aislado, cargando la extensión desde `dist/` y conectándola al servidor de `pnpm dev`. Navega a Mediavida.

* **Experiencia:** Los cambios en el código (UI, content/background scripts) se reflejarán **automáticamente** en el navegador la mayoría de las veces gracias al HMR. **No suele requerir recarga manual**. Ocasionalmente, para cambios profundos, una recarga manual de la extensión (🔄 en `chrome://extensions`) puede ser necesaria.

**2. Desarrollo en Firefox (Requiere Recarga Manual)**

Actualmente, el flujo con `pnpm dev` y HMR no funciona correctamente para Firefox con esta configuración. Por lo tanto, se usa un flujo basado en `watch` que requiere recargas manuales. También requiere dos terminales.

* **Terminal 1: Compilar y Observar (`pnpm watch:firefox`)**
    ```bash
    pnpm watch:firefox
    ```
  Compila la extensión para Firefox en `dist/` y re-compila automáticamente al guardar cambios. **Mantenla abierta.**

* **Terminal 2: Ejecutar Extensión (`pnpm serve:firefox`)**
    ```bash
    pnpm serve:firefox
    ```
  Lanza Firefox con un perfil aislado (`--wsl` se usa si estás en WSL), cargando la extensión desde `dist/`. Navega a Mediavida.

* **Experiencia:** Después de guardar cambios y esperar a que `watch:firefox` termine de recompilar en la Terminal 1, **DEBES ir al navegador Firefox (abierto por `serve:firefox`) y recargar manualmente la extensión** (desde `about:debugging#/runtime/this-firefox`, botón "Recargar"). Luego refresca la página de Mediavida para ver los cambios.

* **Nota sobre Builds de Desarrollo vs Producción:** Los comandos `dev` y `watch` generan builds de *desarrollo* (no optimizadas). Para la versión final, usa `pnpm build` (ver sección siguiente).

**Resumen del Flujo:**

* Desarrolla y prueba principalmente en Chrome usando `pnpm dev` + `pnpm serve` para aprovechar el HMR.
* Periódicamente, o cuando termines una funcionalidad, prueba en Firefox usando `pnpm watch:firefox` + `pnpm serve:firefox`, recordando recargar manualmente la extensión para ver los cambios.
* Aplica parches o ajustes específicos para Firefox si es necesario.

## Build para Producción

Cuando quieras generar la versión final de la extensión lista para ser publicada o distribuida, utiliza los siguientes comandos específicos para producción:

* **Para Chrome / Chromium:**
    ```bash
    pnpm build
    ```
* **Para Firefox:**
    ```bash
    pnpm build:firefox
    ```

Estos comandos generan un build **optimizado y minificado** en la carpeta `dist/`, adecuado para subir a las tiendas de extensiones (Chrome Web Store, Complementos de Mozilla) o para distribución manual.

## Contribución

Si deseas contribuir a MVTools, aquí hay algunas formas de hacerlo:

### Reportar Problemas
* Utiliza el [sistema de issues](https://github.com/Aleksnako/MVTools/issues) para reportar bugs
* Incluye pasos detallados para reproducir el problema
* Menciona tu navegador y versión de la extensión

### Sugerir Mejoras
* Las sugerencias para mejorar la extensión son bienvenidas
* Describe claramente el caso de uso y los beneficios de tu sugerencia

### Contribuir Código
* Haz fork del repositorio y crea una rama para tu contribución
* Sigue las convenciones de código existentes
* Asegúrate de que tu código pase las comprobaciones de linting (`pnpm lint`)
* Envía un pull request con una descripción clara de los cambios

## Scripts Útiles

* **Instalar Dependencias:** `pnpm install`
* **Desarrollo Chrome (HMR):** `pnpm dev` (Usar junto con `pnpm serve`)
* **Desarrollo Firefox (Manual Reload):** `pnpm watch:firefox` (Usar junto con `pnpm serve:firefox`)
* **Build Dev y Watch (Chrome - Manual Reload):** `pnpm watch` (Alternativa menos usada)
* **Ejecutar Extensión Compilada (Entorno Aislado):**
    * Chrome: `pnpm serve` (Usar con `pnpm dev` o después de `pnpm build`)
    * Firefox: `pnpm serve:firefox` (Usar con `pnpm watch:firefox` o después de `pnpm build:firefox`)
    * *Nota: Usan `web-ext` y perfiles separados (`./chromium-profile/`, `./firefox-profile/`). Cargan desde `dist/`.*
* **Build de Producción:**
    * Chrome: `pnpm build`
    * Firefox: `pnpm build:firefox`
    * (Salida minificada en `dist/`)
* **Crear Zip de Lanzamiento:**
    * Chrome: `ZIP=true pnpm build`
    * Firefox: `ZIP=true pnpm build:firefox`
    * (Salida en `releases/`)
* **Linting & Formatting:**
    * Comprobar: `pnpm lint` / Arreglar: `pnpm lint:fix`
    * (Incluye Prettier y ESLint)
* **Comprobación de Tipos:** `pnpm ts:check`
* **Análisis de Dependencias (Knip):**
    * Comprobar: `pnpm knip` / Arreglar: `pnpm knip:fix`

## Dependencias Parchadas (Importante)

Este proyecto utiliza `pnpm patch` para aplicar correcciones locales a las siguientes dependencias:

* `@radix-ui/react-alert-dialog`
* `@radix-ui/react-dialog`

**Motivo:** Se ha aplicado un parche basado en la PR [radix-ui/primitives#3384](https://github.com/radix-ui/primitives/pull/3384) para solucionar un falso positivo en la advertencia de accesibilidad (`TitleWarning`) cuando el contenido del diálogo se renderiza dentro de un Shadow DOM (necesario en esta extensión para aislamiento de estilos). El parche permite que el chequeo funcione correctamente en dicho contexto.

**Acción Futura:** Una vez que Radix UI lance una versión oficial (`>1.1.6` para `@radix-ui/react-alert-dialog` o la versión correspondiente de dialog) que incluya esta corrección, se deberá:
1.  Actualizar las dependencias de Radix a la nueva versión en `package.json`.
2.  Eliminar las entradas correspondientes del campo `pnpm.patchedDependencies` en `package.json`.
3.  Eliminar los archivos `.patch` asociados de la carpeta `patches/` del proyecto.
4.  Ejecutar `pnpm install` de nuevo.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE) - consulta el archivo LICENSE para más detalles.
