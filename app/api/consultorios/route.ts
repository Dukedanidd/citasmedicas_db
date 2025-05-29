import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET /api/consultorios - Obtener todos los consultorios
export async function GET() {
  console.log('[GET /api/consultorios] Iniciando petición...');
  let conn;
  try {
    console.log('[GET /api/consultorios] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/consultorios] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/consultorios] current_user_id asignado');

    console.log('[GET /api/consultorios] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(`
      SELECT consultorio_id, nombre
      FROM consultorios
      ORDER BY nombre
    `);
    console.log('[GET /api/consultorios] Consulta ejecutada. Resultados:', rows);

    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/consultorios] Error:', err);
    console.error('[GET /api/consultorios] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener los consultorios' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[GET /api/consultorios] Conexión cerrada');
    }
  }
} 