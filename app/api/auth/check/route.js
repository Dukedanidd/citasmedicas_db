import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
}

export async function GET(request) {
  console.log('[GET /api/auth/check] Iniciando verificación de autenticación...')
  try {
    const userId = request.headers.get('user-id')
    console.log('[GET /api/auth/check] ID del usuario:', userId)

    if (!userId) {
      console.log('[GET /api/auth/check] No se proporcionó ID de usuario')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    console.log('[GET /api/auth/check] Conectando a la base de datos...')
    const conn = await mysql.createConnection(dbConfig)
    console.log('[GET /api/auth/check] Conexión exitosa')

    // Obtener información del usuario y su rol
    const [rows] = await conn.execute(
      `SELECT u.user_id, u.email, r.nombre as rol
       FROM usuarios u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = ?`,
      [userId]
    )

    await conn.end()
    console.log('[GET /api/auth/check] Conexión cerrada')

    if (!rows[0]) {
      console.log('[GET /api/auth/check] Usuario no encontrado')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    console.log('[GET /api/auth/check] Usuario autenticado:', rows[0])
    return NextResponse.json({
      authenticated: true,
      user: rows[0]
    })
  } catch (error) {
    console.error('[GET /api/auth/check] Error:', error)
    console.error('[GET /api/auth/check] Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Error al verificar autenticación' },
      { status: 500 }
    )
  }
} 