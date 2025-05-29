# Documentación de la API de Citas Médicas

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Doctores

#### Obtener Doctor por ID
```http
GET /doctores/{id}
```
**Respuesta Exitosa (200)**
```json
{
  "doctor_id": 1,
  "primer_nombre": "Juan",
  "apellido_paterno": "Pérez",
  "especialidad": "Cardiología Pediátrica",
  "consultorio_id": 1
}
```

#### Actualizar Doctor
```http
PUT /doctores/{id}
```
**Cuerpo de la Petición**
```json
{
  "primer_nombre": "Juan",
  "apellido_paterno": "Pérez",
  "especialidad": "Cardiología Pediátrica",
  "consultorio_id": 1
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Doctor actualizado exitosamente"
}
```

### Pacientes

#### Obtener Paciente por ID
```http
GET /pacientes?pacienteId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "paciente_id": 26,
  "primer_nombre": "Rodrigo",
  "segundo_nombre": "Alberto",
  "apellido_paterno": "Fernandez",
  "apellido_materno": "Garcia",
  "email": "rod@rg.com",
  "fecha_nacimiento": "1990-01-01",
  "sexo": "M",
  "doctor_id": 1
}
```

#### Actualizar Paciente
```http
PUT /pacientes
```
**Cuerpo de la Petición**
```json
{
  "paciente_id": 26,
  "primer_nombre": "Rodrigo",
  "segundo_nombre": "Alberto",
  "apellido_paterno": "Fernandez",
  "apellido_materno": "Garcia",
  "email": "rod@rg.com",
  "fecha_nacimiento": "1990-01-01",
  "sexo": "M",
  "doctor_id": 1
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Paciente actualizado exitosamente"
}
```

### Expedientes

#### Crear Expediente
```http
POST /expedientes
```
**Cuerpo de la Petición**
```json
{
  "paciente_id": 30,
  "notas_generales": "Notas de prueba"
}
```
**Respuesta Exitosa (201)**
```json
{
  "message": "Expediente creado exitosamente",
  "expediente_id": 9
}
```

#### Obtener Expediente por ID
```http
GET /expedientes?expedienteId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "expediente_id": 1,
  "paciente_id": 26,
  "notas_generales": "Notas actualizadas"
}
```

#### Obtener Expediente por Paciente
```http
GET /expedientes?pacienteId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "expediente_id": 1,
  "paciente_id": 26,
  "notas_generales": "Notas actualizadas"
}
```

#### Actualizar Expediente
```http
PUT /expedientes
```
**Cuerpo de la Petición**
```json
{
  "expediente_id": 1,
  "notas_generales": "Notas actualizadas"
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Expediente actualizado exitosamente"
}
```

### Historial Médico

#### Crear Registro de Historial
```http
POST /historial
```
**Cuerpo de la Petición**
```json
{
  "expediente_id": 1,
  "descripcion": "Consulta de rutina - Paciente presenta síntomas de gripe"
}
```
**Respuesta Exitosa (201)**
```json
{
  "message": "Registro de historial creado exitosamente",
  "historial_id": 6
}
```

#### Obtener Historial por ID
```http
GET /historial?historialId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "historial_id": 1,
  "expediente_id": 1,
  "descripcion": "Seguimiento - Paciente mejora con el tratamiento",
  "fecha_registro": "2025-05-28T23:36:42.000Z"
}
```

#### Obtener Historial por Expediente
```http
GET /historial?expedienteId={id}
```
**Respuesta Exitosa (200)**
```json
[
  {
    "historial_id": 1,
    "expediente_id": 1,
    "descripcion": "Seguimiento - Paciente mejora con el tratamiento",
    "fecha_registro": "2025-05-28T23:36:42.000Z"
  }
]
```

#### Actualizar Registro de Historial
```http
PUT /historial
```
**Cuerpo de la Petición**
```json
{
  "historial_id": 1,
  "descripcion": "Seguimiento - Paciente mejora con el tratamiento"
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Registro de historial actualizado exitosamente"
}
```

### Alergias

#### Crear Alergia
```http
POST /alergias
```
**Cuerpo de la Petición**
```json
{
  "expediente_id": 1,
  "descripcion": "Alergia a penicilina"
}
```
**Respuesta Exitosa (201)**
```json
{
  "message": "Alergia creada exitosamente",
  "alergia_id": 8
}
```

#### Obtener Alergia por ID
```http
GET /alergias?alergiaId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "alergia_id": 1,
  "expediente_id": 1,
  "descripcion": "Alergia severa a penicilina"
}
```

#### Obtener Alergias por Expediente
```http
GET /alergias?expedienteId={id}
```
**Respuesta Exitosa (200)**
```json
[
  {
    "alergia_id": 1,
    "expediente_id": 1,
    "descripcion": "Alergia severa a penicilina"
  }
]
```

#### Actualizar Alergia
```http
PUT /alergias
```
**Cuerpo de la Petición**
```json
{
  "alergia_id": 1,
  "descripcion": "Alergia severa a penicilina"
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Alergia actualizada exitosamente"
}
```

### Citas

#### Crear Cita
```http
POST /citas
```
**Cuerpo de la Petición**
```json
{
  "paciente_id": 26,
  "doctor_id": 1,
  "fecha_hora": "2024-03-20 12:00:00",
  "estado_id": 1,
  "notas": "Consulta de rutina"
}
```
**Respuesta Exitosa (201)**
```json
{
  "message": "Cita creada exitosamente",
  "cita_id": 4
}
```

#### Obtener Cita por ID
```http
GET /citas?citaId={id}
```
**Respuesta Exitosa (200)**
```json
{
  "cita_id": 2,
  "paciente_id": 26,
  "doctor_id": 1,
  "fecha_hora": "2024-03-20 10:00:00",
  "estado_id": 1,
  "notas": "Consulta de rutina",
  "creado_el": "2025-05-28T23:36:43.000Z"
}
```

#### Obtener Citas por Paciente
```http
GET /citas?pacienteId={id}
```
**Respuesta Exitosa (200)**
```json
[
  {
    "cita_id": 2,
    "paciente_id": 26,
    "doctor_id": 1,
    "fecha_hora": "2024-03-20 10:00:00",
    "estado_id": 1,
    "notas": "Consulta de rutina",
    "creado_el": "2025-05-28T23:36:43.000Z"
  }
]
```

#### Obtener Citas por Doctor
```http
GET /citas?doctorId={id}
```
**Respuesta Exitosa (200)**
```json
[
  {
    "cita_id": 2,
    "paciente_id": 26,
    "doctor_id": 1,
    "fecha_hora": "2024-03-20 10:00:00",
    "estado_id": 1,
    "notas": "Consulta de rutina",
    "creado_el": "2025-05-28T23:36:43.000Z"
  }
]
```

#### Actualizar Cita
```http
PUT /citas
```
**Cuerpo de la Petición**
```json
{
  "cita_id": 3,
  "paciente_id": 26,
  "doctor_id": 1,
  "fecha_hora": "2024-03-20 14:00:00",
  "estado_id": 2,
  "notas": "Consulta de seguimiento"
}
```
**Respuesta Exitosa (200)**
```json
{
  "message": "Cita actualizada exitosamente"
}
```

## Notas Importantes

1. **Horarios de Citas**: Las citas deben programarse dentro del horario de disponibilidad del doctor (09:00:00 a 17:00:00).

2. **Estados de Citas**:
   - 1: Programada
   - 2: Confirmada
   - 3: Cancelada
   - 4: Completada
   - 5: No asistió

3. **Manejo de Errores**: Todos los endpoints devuelven códigos de estado HTTP apropiados:
   - 200: Operación exitosa
   - 201: Recurso creado exitosamente
   - 400: Error en la petición
   - 404: Recurso no encontrado
   - 500: Error interno del servidor

4. **Formato de Fechas**: Todas las fechas deben enviarse en formato ISO 8601 (YYYY-MM-DD HH:MM:SS).

5. **Autenticación**: Todos los endpoints requieren autenticación mediante token JWT en el header:
   ```
   Authorization: Bearer <token>
   ``` 