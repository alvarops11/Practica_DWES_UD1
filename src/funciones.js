export function obtenerPlazasRestantes(taller, inscripciones) {
  const totalInscritos = inscripciones.filter(
    (inscripcion) => inscripcion.tallerId === taller.id
  ).length;

  return taller.plazas - totalInscritos;
}

export function estaInscrito(tallerId, email, inscripciones) {
    if (!email) {
        email = '';
    }

    return inscripciones.some(
        (inscripcion) =>
            inscripcion.tallerId === tallerId &&
            typeof inscripcion.email === 'string' &&
            inscripcion.email.toLowerCase() === email.toLowerCase()
    );
}


export function validarInscripcion(datos) {
  const errores = {};

  const nombre = String(datos.nombre ?? '').trim();
  const email = String(datos.email ?? '').trim();

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (nombre.length > 100) {
    errores.nombre = 'El nombre no puede superar 100 caracteres';
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errores.email = 'El correo es obligatorio';
  } else if (email.length > 254 || !formatoEmail.test(email)) {
    errores.email = 'Introduce un correo válido';
  }

  return errores;
}