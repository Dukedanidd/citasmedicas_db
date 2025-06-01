import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
}

// Exportación nombrada para el método GET
export const GET = async (
  request: Request,
  { params }: { params: { doctorId: string; fecha: string } }
) => {
  console.log('[GET /api/agenda/[doctorId]/[fecha]] Iniciando petición...')
  let conn
  try {
    const { doctorId, fecha } = params
    console.log('[GET /api/agenda/[doctorId]/[fecha]] Parámetros:', { doctorId, fecha })

    // Validar parámetros
    if (!doctorId || !fecha) {
      return NextResponse.json(
        { error: 'Se requieren doctorId y fecha' },
        { status: 400 }
      )
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!fechaRegex.test(fecha)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    console.log('[GET /api/agenda/[doctorId]/[fecha]] Conectando a la base de datos...')
    conn = await mysql.createConnection(dbConfig)
    console.log('[GET /api/agenda/[doctorId]/[fecha]] Conexión exitosa')

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1')
    console.log('[GET /api/agenda/[doctorId]/[fecha]] current_user_id asignado')

    // Consultar la información del doctor
    console.log('[GET /api/agenda/[doctorId]/[fecha]] Ejecutando consulta...')
    const [rows] = await conn.execute(
      `SELECT u.primer_nombre as doctor_nombre,
              u.apellido_paterno as doctor_apellido,
              m.especialidad
       FROM usuarios u
       JOIN medicos m ON u.user_id = m.doctor_id
       WHERE m.doctor_id = ?`,
      [doctorId]
    )
    console.log('[GET /api/agenda/[doctorId]/[fecha]] Resultados:', rows)

    if (!rows[0]) {
      return NextResponse.json(
        { 
          error: 'Doctor no encontrado',
          message: 'No existe un doctor con ese ID'
        },
        { status: 404 }
      )
    }

    // Validar que la fecha no sea en el pasado
    const fechaActual = new Date()
    const fechaAgenda = new Date(fecha)
    if (fechaAgenda < fechaActual) {
      return NextResponse.json(
        { 
          error: 'Fecha inválida',
          message: 'No se pueden programar citas en fechas pasadas'
        },
        { status: 400 }
      )
    }

    // Retornar horario fijo de 8:00 a 20:00
    const response = {
      ...rows[0],
      fecha: fecha,
      hora_inicio: '08:00:00',
      hora_fin: '20:00:00',
      disponible: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/agenda/[doctorId]/[fecha]] Error:', error)
    console.error('[GET /api/agenda/[doctorId]/[fecha]] Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Error al obtener la agenda' },
      { status: 500 }
    )
  } finally {
    if (conn) {
      await conn.end()
      console.log('[GET /api/agenda/[doctorId]/[fecha]] Conexión cerrada')
    }
  }
} 