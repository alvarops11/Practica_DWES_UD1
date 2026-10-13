# Sistema de inscripción a talleres y actividades

## Descripción

Aplicación web desarrollada con Node.js, Express y EJS para consultar talleres tecnológicos y gestionar inscripciones.

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- JavaScript
- HTML

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación se ejecuta en `http://localhost:3000`.

## Funcionalidades

### 1. Consulta de talleres

La ruta `GET /talleres` muestra el catálogo completo. Permite filtrar por categoría, nivel y disponibilidad mediante parámetros de consulta.

Ejemplos:

```bash
curl -i http://localhost:3000/talleres
curl -i 'http://localhost:3000/talleres?categoria=web'
curl -i 'http://localhost:3000/talleres?nivel=avanzado'
curl -i 'http://localhost:3000/talleres?disponibles=true'
curl -i 'http://localhost:3000/talleres?categoria=web&nivel=avanzado&disponibles=true'
```

### 2. Ficha de taller

La ruta `GET /talleres/:id` muestra los datos de un taller y calcula las plazas restantes a partir de las inscripciones.

```bash
curl -i http://localhost:3000/talleres/1
curl -i http://localhost:3000/talleres/999
curl -i http://localhost:3000/talleres/abc
```

### 3. Formulario de inscripción

La ruta `GET /talleres/:id/inscripcion` muestra el formulario de inscripción cuando el taller existe y dispone de plazas.

```bash
curl -i http://localhost:3000/talleres/1/inscripcion
```

### 4. Alta de inscripción

La ruta `POST /talleres/:id/inscripcion` valida los campos, comprueba las plazas y evita inscripciones duplicadas. Si el alta es correcta, redirige mediante PRG.

```bash
curl -i -X POST \
  http://localhost:3000/talleres/1/inscripcion \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "nombre=María López" \
  --data-urlencode "email=maria@example.com"
```

Prueba de duplicado:

```bash
curl -i -X POST \
  http://localhost:3000/talleres/1/inscripcion \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "nombre=Curro Ximénez" \
  --data-urlencode "email=currox@example.com"
```

### 5. Funciones auxiliares

El archivo `src/funciones.js` contiene:

- `obtenerPlazasRestantes()`: calcula las plazas restantes.
- `estaInscrito()`: comprueba si existe una inscripción para el taller y correo indicados.
- `validarInscripcion()`: comprueba los datos recibidos del formulario.

Se utilizan los métodos `find()`, `filter()`, `map()` y `some()`.

## Estructura del proyecto

- `src/app.js`: configuración de Express y rutas.
- `src/datos.js`: colecciones en memoria.
- `src/funciones.js`: funciones auxiliares.
- `views/`: plantillas EJS.
- `public/`: recursos estáticos.

## Apoyo utilizado

Chat de apoyo: [añadir aquí el enlace a la conversación utilizada].
