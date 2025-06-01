import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET /api/doctores/[id]/pacientes - Obtener pacientes de un doctor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[GET /api/doctores/[id]/pacientes] Iniciando petición...');
  try {
    const { id } = params;
    console.log('[GET /api/doctores/[id]/pacientes] ID del doctor:', id);

    console.log('[GET /api/doctores/[id]/pacientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/doctores/[id]/pacientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/doctores/[id]/pacientes] current_user_id asignado');

    console.log('[GET /api/doctores/[id]/pacientes] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(
      `SELECT 
        p.paciente_id,
        u.primer_nombre,
        u.segundo_nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.email,
        p.fecha_nacimiento,
        p.sexo
      FROM pacientes p
      JOIN usuarios u ON p.paciente_id = u.user_id
      WHERE p.doctor_id = ?`,
      [id]
    );
    console.log('[GET /api/doctores/[id]/pacientes] Consulta ejecutada. Resultados:', rows);

    await conn.end();
    console.log('[GET /api/doctores/[id]/pacientes] Conexión cerrada');

    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/doctores/[id]/pacientes] Error:', err);
    console.error('[GET /api/doctores/[id]/pacientes] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener los pacientes del doctor' },
      { status: 500 }
    );
  }
} 