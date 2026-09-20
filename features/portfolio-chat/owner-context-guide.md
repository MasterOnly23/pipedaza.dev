# Guía para ampliar el contexto público de Ask Pipe

El archivo que debes editar es:

`features/portfolio-chat/owner-context.ts`

Ese archivo se incorpora al conocimiento del asistente durante el build. No edites los archivos generados dentro de `static-landing/chat`; se sobrescriben cada vez que ejecutas el build del chatbot.

## Plantilla de una entrada

Cada sección tiene tres campos:

```ts
profile: {
  keywords: ["intereses", "gustos", "interests"],
  facts: [
    "A Juan Felipe le interesa [dato público concreto].",
  ],
  factsEn: [
    "Juan Felipe is interested in [the same public fact in English].",
  ],
},
```

- `keywords`: palabras o frases que una persona podría escribir en la pregunta. Usa términos cortos y específicos; el asistente normaliza mayúsculas y acentos.
- `facts`: hechos públicos en español, redactados en tercera persona y sin instrucciones para la IA.
- `factsEn`: traducción de cada hecho para que las preguntas en inglés también funcionen.

## Qué puedes agregar

### `profile`

Quién eres públicamente, tu rol, tu enfoque, intereses profesionales o la clase de problemas que te gusta resolver.

Ejemplos de preguntas que puedes habilitar:

```ts
keywords: ["intereses", "qué te interesa", "interests", "what interests you"],
```

### `work`

El tipo de aplicaciones, herramientas, automatizaciones o productos que construyes, además de tu forma pública de trabajar.

```ts
keywords: ["metodología", "cómo trabajas", "workflow", "how do you work"],
facts: [
  "Su proceso público empieza por entender el problema y termina cuidando los detalles de uso.",
],
factsEn: [
  "His public process starts by understanding the problem and ends by caring about usage details.",
],
```

### `stack`

Tecnologías, herramientas o prácticas que quieras declarar públicamente. Añade también una `keyword` si el término no existe todavía en el stack base.

### `partyup`, `zentrastock` y `kustral`

Características públicas, objetivo del producto, estado general o decisiones técnicas que puedas compartir. Mantén cada proyecto en su propia sección.

En `kustral`, limita el contexto a lo ya publicado en la tarjeta del portfolio. No agregues nombres, cifras, documentos, URLs ni información operativa del cliente.

### `contact`

Solo canales públicos que realmente quieras recibir: email, GitHub u otro enlace que haya sido aprobado para la landing.

## Qué no debes poner

No agregues contraseñas, tokens, claves API, datos personales de terceros, información interna de clientes, URLs privadas, ubicación, estudios, años de experiencia, disponibilidad, tarifas, métricas de negocio ni datos que no quieras mostrar a cualquier visitante.

Un dato no se vuelve público solo por estar en este archivo: antes de añadirlo, confirma que también está autorizado para aparecer en el portfolio.

## Después de editar

Desde la raíz del proyecto ejecuta:

```powershell
npm run check:portfolio-chat
npm run build:portfolio-chat
```

Después actualiza la referencia `?v=...` de `static-landing/index.html` con el hash que imprime el build, si el script no la actualiza automáticamente, y refresca `http://127.0.0.1:4173/`.

Si el dato requiere una respuesta corta y fija para una pregunta frecuente, además de añadirlo al contexto puede ser necesario actualizar la respuesta determinista correspondiente en `features/portfolio-chat/knowledge.ts`.
