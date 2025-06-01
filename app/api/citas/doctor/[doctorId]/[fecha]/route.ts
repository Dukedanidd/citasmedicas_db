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
  console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Iniciando petición...')
  let conn
  try {
    const { doctorId, fecha } = params
    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Parámetros:', { doctorId, fecha })

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

    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Conectando a la base de datos...')
    conn = await mysql.createConnection(dbConfig)
    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Conexión exitosa')

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1')
    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] current_user_id asignado')

    // Consultar las citas del doctor en la fecha especificada
    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Ejecutando consulta...')
    const [rows] = await conn.execute(
      `SELECT c.*, 
              p.primer_nombre as paciente_nombre,
              p.apellido_paterno as paciente_apellido,
              e.nombre as estado_nombre,
              TIME_FORMAT(c.fecha_hora, '%H:%i') as hora_cita
       FROM citas c
       JOIN usuarios p ON c.paciente_id = p.user_id
       JOIN estado_citas e ON c.estado_id = e.estado_id
       WHERE c.doctor_id = ? 
       AND DATE(c.fecha_hora) = ? 
       ORDER BY c.fecha_hora ASC`,
      [doctorId, fecha]
    )
    console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Resultados:', rows)

    // Agregar información del horario fijo
    const response = {
      citas: rows,
      horario: {
        hora_inicio: '08:00:00',
        hora_fin: '20:00:00',
        disponible: true
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/citas/doctor/[doctorId]/[fecha]] Error:', error)
    console.error('[GET /api/citas/doctor/[doctorId]/[fecha]] Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    )
  } finally {
    if (conn) {
      await conn.end()
      console.log('[GET /api/citas/doctor/[doctorId]/[fecha]] Conexión cerrada')
    }
  }
} 