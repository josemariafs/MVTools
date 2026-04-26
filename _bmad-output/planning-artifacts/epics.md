---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "Requisitos proporcionados por RA_MeSiAs (sesión: CE - calendario RAWG, hilos, notificaciones)"
  - "docs/index.md, docs/architecture.md (contexto producto extensión MVTools — referencia, no PRD formal)"
  - "Nota: no se encontró PRD.md ni Architecture.md dedicados al feature en {planning_artifacts}"
---

# MVTools - Epic Breakdown: Lanzamientos de videojuegos (RAWG + hilos + notificaciones)

## Overview

Desglose de **épicas e historias de usuario** para integrar la API **RAWG**, mostrar un **calendario de lanzamientos** (30 días) en la **página principal** de [mediavida.com](https://www.mediavida.com), generar un **hilo en el foro de juegos** con **markdown** enriquecido (incl. sintaxis de imágenes del foro) y **avisar el día de lanzamiento** vía extensión (icono / notificaciones), en el contexto de una extensión de navegador (Manifest V3).

## Requirements Inventory

### Functional Requirements

```
FR1: La extensión obtiene de la API RAWG los videojuegos con fecha de lanzamiento en los próximos 30 días (ventana deslizante o equivalente acordada con el producto).
FR2: En la página principal de www.mediavida.com, la extensión muestra un calendario (o vista calendario/lista agregada por día) con esos lanzamientos futuros.
FR3: Al hacer clic en un juego del calendario, el usuario accede al flujo de **nuevo hilo** en la URL `https://www.mediavida.com/foro/juegos/nuevo-hilo` (o equivalente en el foro) con el contenido listo en **código markdown**.
FR4: El cuerpo del hilo se compone con información básica del juego (título, fechas, plataformas, resumen, etc. según acuerde el producto) obtenida de **fuentes en línea**; como mínimo la API RAWG y, si aplica, enlaces o datos complementarios para completar el texto.
FR5: El hilo incluye **varias capturas de pantalla** y una **cabecera** con la **imagen principal** del juego; las imágenes embebidas en el cuerpo usan el formato exigido por el foro: `[img]URL_DE_LA_IMAGEN[/img]`.
FR6: La extensión informa al usuario el **día de lanzamiento** de un videojuego mediante **notificación del navegador y/o señal en el icono** de la extensión, según permisos y plataforma.
```

### NonFunctional Requirements

```
NFR1: Cumplir términos de uso, límites de tasa (rate limit) y clave de API de RAWG; almacenamiento seguro de credenciales (p. ej. almacenamiento del navegador) si el usuario aporta API key.
NFR2: Tolerancia a fallos: degradación clara ant errores de red, 429, o indisponibilidad de RAWG (mensajes, reintentos acotados).
NFR3: No degradar de forma inaceptable el rendimiento de la home de mediavida (carga perezosa, límites de frecuencia, cancelación de peticiones).
NFR4: Cumplir políticas de permisos de WebExtension: `notifications`, `alarms` u otras según el diseño; solicitar permisos de forma explicable al usuario.
NFR5: Respeto a privacidad: minimizar datos enviados a terceros; trazabilidad de qué se llama a RAWG y con qué parámetros.
NFR6: Accesibilidad: interacción por teclado donde proceda, textos alternativos si la UX incluye imágenes decorativas en UI de extensión.
NFR7: Compatibilidad: al menos con el flujo de build actual (Chrome; Firefox de forma acorde a las limitaciones ya documentadas en el repo).
```

### Additional Requirements

```
- La integración vive en la extensión MVTools: content scripts en orígenes permitidos, posible lógica en background/service worker para alarmas o badge, y almacenamiento para preferencias y caché.
- Definir host_permissions o permisos de API de RAWG (HTTPS) y matches para mediavida.com.
- El selector del DOM de la home y del formulario de “nuevo hilo” es frágil ante cambios del sitio: acotar riesgo con pruebas manuales o selectores estables; documentar supuestos.
- Sintaxis de imágenes del foro: obligatorio `[img]URL[/img]`; validar que las URLs de imágenes sean https y permitidas por el foro.
- Nuevo hilo: si el foro requiere campos adicionales (categoría, título) no especificados, el producto debe fijar valores por defecto o dejar título rellenable por el usuario antes de publicar.
```

### UX Design Requirements

```
UX-DR1: El calendario en home debe ser legible (jerarquía visual por fecha), con estados de carga y vacío (“sin lanzamientos en 30 días”) y error (“no se pudo cargar RAWG”).
UX-DR2: El paso a “nuevo hilo” no debe perder el trabajo del usuario: si el formulario no está listo, mostrar previsualización o portapapeles como respaldo.
UX-DR3: La notificación o badge debe ser reconocible (p. ej. contador o punto) y no spam: solo días con lanzamientos en la ventana de seguimiento acordada.
```

### FR Coverage Map

| FR  | Epica | Notas breves |
|-----|--------|----------------|
| FR1 | Epic 1 | Cliente y datos de lanzamientos 30d |
| FR2 | Epic 1 | Calendario en home |
| FR3 | Epic 2 | Navegación y markdown al nuevo hilo |
| FR4 | Epic 2 | Composición de texto desde API / web |
| FR5 | Epic 2 | Imágenes y cabecera con formato foro |
| FR6 | Epic 3 | Notificación / icono día de salida |
| NFR1–NFR7 | Épicas 1–3 | Repartidos en historias técnicas correspondientes |
| UX-DR1 | Epic 1 | Estados UI calendario |
| UX-DR2 | Epic 2 | Resiliencia y borrador / portapapeles |
| UX-DR3 | Epic 3 | Política de avisos y badge |

## Epic List

### Epic 1: Calendario de lanzamientos con RAWG en la home
Tras este épico, el usuario ve en la home de Mediavida los próximos lanzamientos (30 días) alimentados por RAWG, con estados de carga/error y caché razonable.

**FRs cubiertos:** FR1, FR2, UX-DR1, NFR1–NFR3, NFR5–NFR7 (parcial)

### Epic 2: Hilo de foro con markdown enriquecido desde un juego
Tras este épico, al elegir un juego en el calendario se abre (o se prepara) el nuevo hilo en `/foro/juegos/nuevo-hilo` con título y cuerpo en markdown, datos del juego, cabecera e imágenes en formato `[img]URL[/img]`.

**FRs cubiertos:** FR3, FR4, FR5, UX-DR2, NFR1, NFR2, NFR6 (parcial)

### Epic 3: Aviso el día de lanzamiento (icono y/o notificación)
Tras este épico, el usuario recibe señal el día de lanzamiento de juegos de su interés (definir regla: todos los del calendario vs marcados), vía notificación del sistema y/o badge en el icono.

**FRs cubiertos:** FR6, UX-DR3, NFR4

---

## Epic 1: Calendario de lanzamientos con RAWG en la home

**Objetivo del épica:** Poner a disposición en la home de mediavida.com la vista de “próximos 30 días” usando datos de RAWG, con experiencia de carga aceptable y límites de API respetados.

### Story 1.1: Cliente RAWG y ventana de 30 días

Como **usuario de la extensión**,  
Quiero **que la extensión consulte la API de RAWG con parámetros correctos (fechas, paginación si aplica)**,  
Para **obtener la lista de juegos a estrenar en los próximos 30 días**.

**Acceptance Criteria:**

**Given** el usuario ha configurado (o el producto inyecta) una **API key de RAWG** donde proceda, almacenada de forma acorde a NFR1  
**When** se solicita la actualización de lanzamientos (manual o al cargar el calendario)  
**Then** se construye la petición a endpoints documentados de RAWG para juegos cuya fecha de estreno cae en la ventana [hoy, hoy+30 días] (o criterio equivalente documentado)  
**And** se normaliza la respuesta a un **modelo interno** (id, nombre, fechas, plataformas, assets mínimos)  
**And** si RAWG responde 401/403/429, se muestra mensaje o estado recuperable (NFR2) y no se bloquea el navegador

---

### Story 1.2: UI del calendario inyectada en la home

Como **visitante frecuente de Mediavida**,  
Quiero **ver en la home un bloque con calendario o lista por días** de los lanzamientos,  
Para **saber de un vistazo qué juegos salen pronto** (FR2, UX-DR1).

**Given** el usuario abre `www.mediavida.com` (o la URL de home acordada) y el content script corresponde al match del manifest  
**When** el DOM está disponible, la extensión **monta** un contenedor (Shadow DOM o estrategia existente en el repo) con el listado o rejilla del calendario  
**Then** cada entrada muestra al menos: **nombre del juego**, **fecha** y un **mecanismo de click** hacia el flujo del Epic 2 (evento aún sin implementar puede ser un stub con log en 1.2 si 1.3 define el handoff — preferible: 1.2 emite `CustomEvent` o callback contratado)  
**And** existen estados visibles: **cargando**, **vacío** y **error** (UX-DR1)  
**And** se documenta el **selector/anchor** de la home usado; si el DOM cambia, el fallo es acotado (Additional Requirements)

---

### Story 1.3: Caché, frescura y frecuencia de actualización

Como **usuario**,  
Quiero **que el calendario no recargue RAWG en exceso**,  
Para **respetar límites y no ralentizar la página** (NFR1, NFR3).

**Given** existen datos previamente obtenidos con marca temporal  
**When** el usuario vuelve a abrir o refresca la home en un intervalo breve  
**Then** se reutilizan datos en caché mientras no superen un **TTL** definido (p. ej. 1–6 h, configurable por producto)  
**And** forzar refresco anula la caché o marca pull-to-refresh si el producto lo incluye  
**And** las peticiones se cancelan al navegar o desmontar el widget si aplica (NFR3)

---

## Epic 2: Hilo de foro con markdown enriquecido desde un juego

**Objetivo del épica:** Completar el recorrido desde el click en un juego hasta un hilo de foro con markdown útil, imágenes en formato foro e información básica.

### Story 2.1: Navegación a “nuevo hilo” y plantilla mínima

Como **forero**,  
Quiero **al pulsar un juego abrir (o rellenar) el formulario de nuevo hilo** en el subforo de juegos,  
Para **iniciar un hilo sin copiar a mano la estructura básica** (FR3).

**Given** el usuario hace clic en un juego en el calendario (Epic 1)  
**When** se navega a `https://www.mediavida.com/foro/juegos/nuevo-hilo` (o ruta final equivalente)  
**Then** el content script localiza el **título** y/o el **cuerpo** del hilo (textarea/contenteditable) según el DOM real  
**And** se inserta una **plantilla mínima** (título sugerido + cuerpo con secciones vacías) en markdown, sin publicar aún al usuario (confirmación explícita de envío)  
**And** si el foro requiere campos adicionales no mapeables, se documenta y se deja al usuario el paso faltante (Additional Requirements)

---

### Story 2.2: Ensamblar ficha y capturas vía RAWG (y fuentes adicionales si hace falta)

Como **forero**,  
Quiero **que el cuerpo incluya ficha básica y capturas reales del juego**,  
Para **crear un hilo informativo sin buscar a mano todo** (FR4).

**Given** se conoce el `id` o slug del juego en RAWG a partir de la fila del calendario  
**When** se compone el markdown del hilo  
**Then** se rellenan al menos: **nombre**, **fecha de estreno**, **plataformas** y un **párrafo de descripción** o datos del endpoint de detalle de RAWG  
**And** se incorporan **varias** URLs de imagen (p. ej. `short_screenshots` o `background_image`) válidas y https  
**And** si RAWG no cubre un dato, el texto indica claramente “N/D” o se omite según criterio de producto, **sin inventar** hechos (FR4 de honestidad informativa)

---

### Story 2.3: Imágenes con sintaxis de foro y cabecera visual

Como **forero**,  
Quiero **imágenes en formato [img]URL[/img] y una imagen de cabecera destacada**,  
Para **que el foro renderice bien las capturas y el hilo tenga un encabezado atractivo** (FR5).

**Given** se dispone de al menos una **imagen principal** y N capturas  
**When** se genera el markdown final del cuerpo  
**Then** la **cabecera** usa un bloque acordado (p. ej. título H1/H2 + `[img]URL_cabecera[/img]`) y debajo el resto de contenido y capturas, cada una como `[img]URL[/img]` en línea separada o agrupada según criterio de producto  
**And** se valida que no queden imágenes en sintaxis distinta a la del foro en el cuerpo generado (FR5)  
**And** si alguna URL falla al comprobar cabecera, se ofrece alternativa o captura de RAWG (UX-DR2, respaldo: copia al portapapeles con aviso)

---

## Epic 3: Aviso el día de lanzamiento (icono y/o notificación)

**Objetivo del épica:** Reducir el olvido: el día de salida, el usuario ve aviso o badge asociado a un lanzamiento de interés (FR6).

### Story 3.1: Modelo de “seguimiento” y alarma diaria o por fecha

Como **usuario de la extensión**,  
Quiero **que la extensión recuerde qué juegos con fecha de estreno debo avisar**,  
Para **recibir señal el día adecuado** (FR6, NFR4).

**Given** el usuario ha visto al menos un calendario poblado o ha confirmado qué títulos desea seguir (regla: **todos los visibles** vs **lista explícita**; dejar nota de producto en implementación)  
**When** se programa la lógica de recordatorios (p. ej. `chrome.alarms` o comprobación al `startup` + `onAlarm` diaria)  
**Then** a fecha de estreno, el conjunto a notificar se evalúa contra la **fecha local** del usuario o UTC documentado  
**And** se persisten en almacenamiento las fechas/ids mínimos necesarios, sin PII (NFR5)  
**And** se solicita permiso de **notificaciones** con texto claro; si se deniega, solo badge o in-app (NFR4)

---

### Story 3.2: Notificación y/o icono (badge) el día de lanzamiento

Como **usuario de la extensión**,  
Quiero **ver una notificación del sistema o un distintivo en el icono** el día del estreno,  
Para **entrar al foro o al calendario** sin perder el hito (FR6, UX-DR3).

**Given** un juego alcanza su **fecha de lanzamiento** y está bajo la regla de seguimiento (Story 3.1)  
**When** se dispara el evento del día (alarm o comprobación al abrir el navegador)  
**Then** se muestra **al menos una** de: notificación con nombre del juego, o **badge** en el icono de acción, según plataforma y permisos  
**And** al hacer clic en la notificación o en el icono, el usuario accede a un destino acordado (calendario en home, o hilo) sin duplicar spam el mismo día (UX-DR3)  
**And** en Firefox, el comportimiento respeta el soporte real de `notifications` (NFR7)

---

## Resumen de validación (Paso 4)

| Comprobación | Resultado |
|--------------|-----------|
| Cobertura FR1–FR6 | Cada FR aparece al menos en una historia |
| NFR/UX | Tratados en criterios o en épicas técnicas asociadas |
| Dependencia entre historias (misma épica) | 1.1 → 1.2 → 1.3; 2.1–2.3 en secuencia; 3.1 → 3.2. Epic 1 puede entregar valor sin Epic 2/3; Epic 2 requiere datos de 1.1+1.2 mín; Epic 3 requiere fechas (Epic 1) |
| Epics por valor | No se separó en “API / DB / UI” en seco: agrupado por resultados de usuario |
| Tamaño de historias | Acotado a un agente dev por entrega, con riesgo DOM/RAWG explícito |

**Riesgos abiertos para producto/ingeniería:** selectores de mediavida en home y form de nuevo hilo; política de seguimiento de notificaciones (todos vs marcados); límites exactos de RAWG y almacenamiento de API key.

---

**Fin del desglose.** Para afinar prioridad (solo Chrome primero, mínimo viable sin notificaciones, etc.) conviene un corto corte con el equipo o un PRD corto; este documento sirve como base de refinamiento e implementación.
