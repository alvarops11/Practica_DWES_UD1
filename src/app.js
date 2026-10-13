import express from 'express';

import { talleres, inscripciones } from './datos.js';

import {
  obtenerPlazasRestantes,
  estaInscrito,
  validarInscripcion
} from './funciones.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/talleres', (req, res) => {
  const categoria = String(req.query.categoria ?? '')
    .trim()
    .toLowerCase();

  const nivel = String(req.query.nivel ?? '')
    .trim()
    .toLowerCase();

  const disponibles = req.query.disponibles === 'true';

  let resultado = talleres;

  if (categoria) {
    resultado = resultado.filter(
      (taller) => taller.categoria.toLowerCase() === categoria
    );
  }

  if (nivel) {
    resultado = resultado.filter(
      (taller) => taller.nivel.toLowerCase() === nivel
    );
  }

  if (disponibles) {
    resultado = resultado.filter(
      (taller) => obtenerPlazasRestantes(taller, inscripciones) > 0
    );
  }

  const talleresVista = resultado.map((taller) => ({
    ...taller,
    plazasRestantes: obtenerPlazasRestantes(taller, inscripciones)
  }));

  return res.render('talleres', {
    talleres: talleresVista,
    filtros: { categoria, nivel, disponibles }
  });
});

app.get('/talleres/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Identificador no válido');
  }

  const taller = talleres.find((item) => item.id === id);

  if (!taller) {
    return res.status(404).send('Taller no encontrado');
  }

  const plazasRestantes = obtenerPlazasRestantes(
    taller,
    inscripciones
  );

  let estado;

  if (plazasRestantes === 0) {
    estado = 'Completo';
  } else if (plazasRestantes === 1) {
    estado = 'Última plaza disponible';
  } else {
    estado = `${plazasRestantes} plazas disponibles`;
  }

  return res.render('taller', {
    taller,
    plazasRestantes,
    estado
  });
});

app.get('/talleres/:id/inscripcion', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Identificador no válido');
  }

  const taller = talleres.find((item) => item.id === id);

  if (!taller) {
    return res.status(404).send('Taller no encontrado');
  }

  const plazasRestantes = obtenerPlazasRestantes(
    taller,
    inscripciones
  );

  if (plazasRestantes <= 0) {
    return res.status(409).send('El taller está completo');
  }

  return res.render('inscripcion', {
    taller,
    valores: { nombre: '', email: '' },
    errores: {}
  });
});

app.post('/talleres/:id/inscripcion', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Identificador no válido');
  }

  const taller = talleres.find((item) => item.id === id);

  if (!taller) {
    return res.status(404).send('Taller no encontrado');
  }

  const valores = {
    nombre: String(req.body.nombre ?? '').trim(),
    email: String(req.body.email ?? '').trim()
  };

  const errores = validarInscripcion(valores);

  if (Object.keys(errores).length > 0) {
    return res.status(400).render('inscripcion', {
      taller,
      valores,
      errores
    });
  }

  const plazasRestantes = obtenerPlazasRestantes(
    taller,
    inscripciones
  );

  if (plazasRestantes <= 0) {
    return res.status(409).render('inscripcion', {
      taller,
      valores,
      errores: {
        general: 'El taller está completo'
      }
    });
  }

  if (estaInscrito(taller.id, valores.email, inscripciones)) {
    return res.status(400).render('inscripcion', {
      taller,
      valores,
      errores: {
        email: 'Este correo ya está inscrito en el taller'
      }
    });
  }

  const siguienteId = inscripciones.reduce(
    (maximo, inscripcion) => Math.max(maximo, inscripcion.id),
    0
  ) + 1;

  inscripciones.push({
    id: siguienteId,
    tallerId: taller.id,
    nombre: valores.nombre,
    email: valores.email
  });

  return res.redirect(303, `/talleres/${taller.id}`);
});

app.use((req, res) => {
  return res.status(404).send('Recurso no encontrado');
});

app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});