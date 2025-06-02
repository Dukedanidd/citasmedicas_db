import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET /api/bitacora - obtener todas las entradas de la bitácora
export async function GET() {
  console.log('[GET /api/bitacora] Iniciando petición...');
  let conn;
  try {
    console.log('[GET /api/bitacora] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/bitacora] Conexión existosa');

    console.log('[GET /api/bitacora] Ejecutando consulta SQL...');
    const[rows] = await conn.execute(`
      SELECT 
        b.log_id,
        b.tipo,
        b.tabla_afectada,
        b.registro_id,
        b.usuario_id,
        b.fecha_hora,
        b.detalle,
        u.email
      FROM bitacora b
      LEFT JOIN usuarios u ON b.usuario_id = u.user_id
      ORDER BY b.fecha_hora DESC
      `);
      console.log('[GET /api/bitacora] Consulta ejecutada. Resultados: ', rows);

      return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/bitacora] Error:', err);
    console.error('[GET /api/bitacora] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener bitácora' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[GET /api/bitacora] Conexión cerrada');
    }
  }

} 