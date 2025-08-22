# API Endpoints

Esta documentación describe todos los endpoints disponibles del backend. Cada petición a rutas protegidas requiere un **JWT** en el encabezado `Authorization` con el formato:

```http
Authorization: Bearer <token>
```

## Módulos
- [Usuarios](#usuarios)
- [Eventos](#eventos)
- [Asistencia](#asistencia)
- [Ubicación](#ubicación)
- [Dashboard](#dashboard)
- [Justificaciones](#justificaciones)
- [Pruebas](#pruebas)

---

## Usuarios

### Registrar usuario
- **POST** `/api/usuarios/registrar`
- **Descripción:** Registra un nuevo usuario (estudiante o docente).
- **Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@correo.com",
  "contrasena": "123456",
  "rol": "docente"
}
```
- **Respuesta exitosa:**
```json
{
  "mensaje": "✅ Docente registrado. Usa el botón para enviar el código de verificación."
}
```
- **Respuesta de error:**
```json
{
  "error": "Todos los campos son obligatorios"
}
```

### Enviar código a docente
- **POST** `/api/usuarios/docente/enviar-codigo`
- **Descripción:** Envía un código de verificación al correo del docente pendiente.
- **Body:**
```json
{ "correo": "juan@correo.com" }
```
- **Respuesta exitosa:**
```json
{ "ok": true, "mensaje": "Código enviado" }
```
- **Respuesta de error:**
```json
{ "ok": false, "mensaje": "Docente pendiente no encontrado" }
```

### Verificar correo
- **POST** `/api/usuarios/verificar-correo`
- **Descripción:** Verifica el correo usando un código enviado.
- **Body:**
```json
{ "correo": "juan@correo.com", "codigo": "123456" }
```
- **Respuesta exitosa:**
```json
{ "ok": true, "mensaje": "Correo verificado correctamente" }
```
- **Respuesta de error:**
```json
{ "ok": false, "mensaje": "Código inválido" }
```

### Inicio de sesión
- **POST** `/api/usuarios/login`
- **Descripción:** Autentica a un usuario y devuelve un JWT.
- **Body:**
```json
{ "correo": "juan@correo.com", "contrasena": "123456" }
```
- **Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "Inicio de sesión exitoso",
  "token": "<jwt>",
  "usuario": { "id": "...", "nombre": "Juan Pérez", "correo": "juan@correo.com", "rol": "docente" }
}
```
- **Respuesta de error:**
```json
{ "ok": false, "mensaje": "Credenciales inválidas" }
```

### Obtener perfil
- **GET** `/api/usuarios/perfil/:id`
- **Descripción:** Devuelve los datos del usuario por su ID.
- **Parámetros de ruta:** `id` – ID del usuario.
- **Respuesta exitosa:**
```json
{ "ok": true, "usuario": { "id": "...", "nombre": "Juan" } }
```
- **Respuesta de error:**
```json
{ "ok": false, "mensaje": "Usuario no encontrado" }
```

### Listar docentes
- **GET** `/api/usuarios/docentes`
- **Auth:** `admin`
- **Descripción:** Lista todos los docentes y su estado de verificación.
- **Respuesta exitosa:**
```json
{ "ok": true, "docentes": [ { "id": "...", "nombre": "Docente" } ] }
```

### Actualizar usuario
- **PUT** `/api/usuarios/:id`
- **Auth:** `estudiante`, `docente` o `admin`
- **Descripción:** Actualiza nombre, correo o contraseña del usuario.
- **Parámetros de ruta:** `id` – ID del usuario.
- **Body:**
```json
{ "nombre": "Nuevo Nombre" }
```
- **Respuesta exitosa:**
```json
{
  "mensaje": "✅ Usuario actualizado correctamente",
  "usuario": { "id": "...", "nombre": "Nuevo Nombre", "correo": "juan@correo.com", "rol": "docente" }
}
```
- **Respuesta de error:**
```json
{ "error": "Usuario no encontrado" }
```

---

## Eventos

### Obtener mis eventos
- **GET** `/api/eventos/mis`
- **Auth:** `docente` o `admin`
- **Descripción:** Lista eventos creados por el usuario autenticado.
- **Query opcional:** `estado` – filtra por estado del evento.
- **Respuesta exitosa:**
```json
[ { "_id": "...", "nombre": "Evento" } ]
```

### Crear evento
- **POST** `/api/eventos/crear`
- **Auth:** `docente` o `admin`
- **Descripción:** Crea un nuevo evento.
- **Body mínimo:**
```json
{
  "nombre": "Clase de Matemáticas",
  "tipo": "clase",
  "lugar": "Aula 101",
  "coordenadas": { "latitud": -0.1, "longitud": -78.4 }
}
```
- **Respuesta exitosa:**
```json
{ "mensaje": "Evento creado exitosamente", "evento": { "_id": "..." } }
```
- **Respuesta de error:**
```json
{ "mensaje": "Faltan campos obligatorios del evento" }
```

### Listar eventos
- **GET** `/api/eventos`
- **Descripción:** Devuelve todos los eventos.
- **Respuesta exitosa:**
```json
[ { "_id": "...", "nombre": "Evento" } ]
```

### Obtener evento por ID
- **GET** `/api/eventos/:id`
- **Descripción:** Devuelve la información de un evento específico.
- **Parámetros de ruta:** `id` – ID del evento.
- **Respuesta exitosa:**
```json
{ "_id": "...", "nombre": "Evento" }
```
- **Respuesta de error:**
```json
{ "mensaje": "Evento no encontrado" }
```

### Actualizar evento
- **PUT** `/api/eventos/:id`
- **Auth:** `docente` o `admin`
- **Descripción:** Actualiza los campos del evento.
- **Parámetros de ruta:** `id` – ID del evento.
- **Body ejemplo:**
```json
{ "descripcion": "Actualizada" }
```
- **Respuesta exitosa:**
```json
{ "mensaje": "Evento actualizado", "evento": { "_id": "..." } }
```

### Finalizar evento
- **POST** `/api/eventos/:id/finalizar`
- **Auth:** `docente` o `admin`
- **Descripción:** Marca el evento como finalizado y genera un PDF en Base64.
- **Respuesta exitosa:**
```json
{ "mensaje": "Evento finalizado", "pdfBase64": "..." }
```

### Generar reporte PDF
- **GET** `/api/eventos/:id/generarPDF`
- **Auth:** `docente` o `admin`
- **Descripción:** Genera un reporte PDF del evento con métricas.
- **Respuesta exitosa:** Archivo PDF.

### Eliminar evento
- **DELETE** `/api/eventos/:id`
- **Auth:** `docente` o `admin`
- **Descripción:** Marca un evento como cancelado.
- **Respuesta exitosa:**
```json
{ "mensaje": "Evento eliminado correctamente" }
```

---

## Asistencia

### Registrar asistencia
- **POST** `/api/asistencia/registrar`
- **Auth:** `estudiante`
- **Descripción:** Registra la asistencia de un estudiante a un evento activo.
- **Body:**
```json
{ "eventoId": "<id>", "latitud": -0.1, "longitud": -78.4 }
```
- **Respuesta exitosa:**
```json
{
  "mensaje": "Asistencia registrada correctamente",
  "asistencia": { "estado": "Presente" }
}
```
- **Respuesta de error:**
```json
{ "mensaje": "Evento no encontrado" }
```

---

## Ubicación

### Actualizar ubicación de usuario
- **POST** `/api/location/update`
- **Descripción:** Guarda la ubicación del usuario y verifica si está dentro de la geocerca.
- **Body:**
```json
{ "userId": "<id>", "latitude": -0.1, "longitude": -78.4, "previousState": true, "eventoId": "<id>" }
```
- **Respuesta exitosa:**
```json
{ "insideGeofence": true, "distance": 5.3 }
```
- **Respuesta de error:**
```json
{ "error": "Faltan datos obligatorios." }
```

---

## Dashboard

### Obtener métricas
- **GET** `/api/dashboard/metrics`
- **Auth:** `admin` o `docente`
- **Descripción:** Devuelve todas las métricas almacenadas.
- **Respuesta exitosa:**
```json
[ { "metric": "usuarios", "value": 10 } ]
```

### Actualizar métrica
- **POST** `/api/dashboard/metrics`
- **Auth:** `admin` o `docente`
- **Descripción:** Crea o actualiza una métrica.
- **Body:**
```json
{ "metric": "usuarios", "value": 11 }
```
- **Respuesta exitosa:**
```json
{ "metric": "usuarios", "value": 11 }
```
- **Respuesta de error:**
```json
{ "error": "metric y value son requeridos" }
```

### Métricas de evento
- **GET** `/api/dashboard/metrics/event/:id`
- **Auth:** `admin` o `docente`
- **Descripción:** Obtiene las métricas de un evento específico.
- **Parámetros de ruta:** `id` – ID del evento.
- **Respuesta exitosa:**
```json
{ "evento": "<id>", "dentroDelRango": 5 }
```

### Resumen de dashboard
- **GET** `/api/dashboard/overview`
- **Auth:** `admin` o `docente`
- **Descripción:** Devuelve estadísticas generales.
- **Respuesta exitosa:**
```json
{ "totalEventos": 5, "eventosActivos": 2 }
```

---

## Justificaciones

### Crear justificación
- **POST** `/api/justificaciones/crear`
- **Auth:** `estudiante`
- **Descripción:** Crea una solicitud de justificación para un evento.
- **Body:**
```json
{
  "eventoId": "<id>",
  "motivo": "Enfermedad",
  "descripcion": "Fiebre alta"
}
```
- **Respuesta exitosa:**
```json
{ "mensaje": "Justificación creada", "justificacion": { "_id": "..." } }
```

### Pendientes del docente
- **GET** `/api/justificaciones/pendientes/:docenteId`
- **Auth:** `docente` o `admin`
- **Descripción:** Lista las justificaciones pendientes de eventos del docente.
- **Parámetros de ruta:** `docenteId` – ID del docente.
- **Respuesta exitosa:**
```json
[ { "_id": "...", "motivo": "Enfermedad" } ]
```

### Aprobar justificación
- **PUT** `/api/justificaciones/:id/aprobar`
- **Auth:** `docente` o `admin`
- **Descripción:** Marca una justificación como aprobada.
- **Parámetros de ruta:** `id` – ID de la justificación.
- **Body opcional:** `{ "comentario": "Recupérate pronto" }`
- **Respuesta exitosa:**
```json
{ "mensaje": "Justificación aprobada", "justificacion": { "estado": "aprobada" } }
```

### Rechazar justificación
- **PUT** `/api/justificaciones/:id/rechazar`
- **Auth:** `docente` o `admin`
- **Descripción:** Marca una justificación como rechazada.
- **Parámetros de ruta:** `id` – ID de la justificación.
- **Body opcional:** `{ "comentario": "Fuera de tiempo" }`
- **Respuesta exitosa:**
```json
{ "mensaje": "Justificación rechazada", "justificacion": { "estado": "rechazada" } }
```

### Justificaciones por estudiante
- **GET** `/api/justificaciones/estudiante/:id`
- **Auth:** `estudiante`, `docente` o `admin`
- **Descripción:** Obtiene todas las justificaciones de un estudiante.
- **Parámetros de ruta:** `id` – ID del estudiante.
- **Respuesta exitosa:**
```json
[ { "_id": "...", "motivo": "Enfermedad" } ]
```

### Subir documento
- **POST** `/api/justificaciones/subir-documento`
- **Auth:** `estudiante`
- **Descripción:** Sube un archivo asociado a una justificación.
- **Body:** Form-data con campo `archivo`.
- **Respuesta exitosa:**
```json
{ "url": "/uploads/archivo.pdf" }
```

### Historial por evento
- **GET** `/api/justificaciones/historial/:eventoId`
- **Auth:** `docente` o `admin`
- **Descripción:** Lista justificaciones realizadas para un evento.
- **Parámetros de ruta:** `eventoId` – ID del evento.
- **Respuesta exitosa:**
```json
[ { "_id": "...", "estado": "aprobada" } ]
```

---

## Pruebas

### Comprobar API
- **GET** `/api/test`
- **Descripción:** Verifica que la API está activa.
- **Respuesta exitosa:**
```json
{ "message": "API is reachable" }
```

---

## Índice de Endpoints

| Módulo | Método | Endpoint |
| ------ | ------ | -------- |
| Usuarios | POST | `/api/usuarios/registrar` |
| Usuarios | POST | `/api/usuarios/docente/enviar-codigo` |
| Usuarios | POST | `/api/usuarios/verificar-correo` |
| Usuarios | POST | `/api/usuarios/login` |
| Usuarios | GET | `/api/usuarios/perfil/:id` |
| Usuarios | GET | `/api/usuarios/docentes` |
| Usuarios | PUT | `/api/usuarios/:id` |
| Eventos | GET | `/api/eventos/mis` |
| Eventos | POST | `/api/eventos/crear` |
| Eventos | GET | `/api/eventos` |
| Eventos | GET | `/api/eventos/:id` |
| Eventos | PUT | `/api/eventos/:id` |
| Eventos | POST | `/api/eventos/:id/finalizar` |
| Eventos | GET | `/api/eventos/:id/generarPDF` |
| Eventos | DELETE | `/api/eventos/:id` |
| Asistencia | POST | `/api/asistencia/registrar` |
| Ubicación | POST | `/api/location/update` |
| Dashboard | GET | `/api/dashboard/metrics` |
| Dashboard | POST | `/api/dashboard/metrics` |
| Dashboard | GET | `/api/dashboard/metrics/event/:id` |
| Dashboard | GET | `/api/dashboard/overview` |
| Justificaciones | POST | `/api/justificaciones/crear` |
| Justificaciones | GET | `/api/justificaciones/pendientes/:docenteId` |
| Justificaciones | PUT | `/api/justificaciones/:id/aprobar` |
| Justificaciones | PUT | `/api/justificaciones/:id/rechazar` |
| Justificaciones | GET | `/api/justificaciones/estudiante/:id` |
| Justificaciones | POST | `/api/justificaciones/subir-documento` |
| Justificaciones | GET | `/api/justificaciones/historial/:eventoId` |
| Pruebas | GET | `/api/test` |

