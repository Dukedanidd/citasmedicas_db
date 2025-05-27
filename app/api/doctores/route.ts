import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET /api/doctores - Obtener todos los doctores
export async function GET() {
  console.log('[GET /api/doctores] Iniciando petición...');
  try {
    console.log('[GET /api/doctores] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/doctores] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/doctores] current_user_id asignado');

    console.log('[GET /api/doctores] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(`
      SELECT u.user_id AS doctor_id, u.primer_nombre, u.apellido_paterno,
             m.especialidad, c.nombre AS consultorio
      FROM medicos m
      JOIN usuarios u ON m.doctor_id = u.user_id
      JOIN consultorios c ON m.consultorio_id = c.consultorio_id
    `);
    console.log('[GET /api/doctores] Consulta ejecutada. Resultados:', rows);

    await conn.end();
    console.log('[GET /api/doctores] Conexión cerrada');

    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/doctores] Error:', err);
    console.error('[GET /api/doctores] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener los doctores' },
      { status: 500 }
    );
  }
}

// POST /api/doctores - Crear un nuevo doctor
export async function POST(request: Request) {
  console.log('[POST /api/doctores] Iniciando petición...');
  try {
    const body = await request.json();
    console.log('[POST /api/doctores] Datos recibidos:', { ...body, password: '***' });

    const { 
      primer_nombre, 
      segundo_nombre, 
      apellido_paterno, 
      apellido_materno, 
      email, 
      password, 
      especialidad, 
      consultorio_id 
    } = body;

    console.log('[POST /api/doctores] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/doctores] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/doctores] current_user_id asignado');

    // Obtener el role_id para médicos
    console.log('[POST /api/doctores] Obteniendo role_id para médicos...');
    const [roles] = await conn.execute(
      'SELECT role_id FROM roles WHERE nombre = ?',
      ['doctor']
    );
    
    if (!roles[0]) {
      console.log('[POST /api/doctores] No se encontró el rol de doctor');
      await conn.end();
      return NextResponse.json(
        { error: 'No se encontró el rol de doctor en la base de datos' },
        { status: 500 }
      );
    }

    const role_id = roles[0].role_id;
    console.log('[POST /api/doctores] Role_id obtenido:', role_id);

    // Iniciar transacción
    console.log('[POST /api/doctores] Iniciando transacción...');
    await conn.beginTransaction();

    try {
      // 1. Insertar en usuarios (el trigger creará la entrada en medicos)
      console.log('[POST /api/doctores] Insertando en tabla usuarios...');
      const [userResult] = await conn.execute(
        `INSERT INTO usuarios (primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id]
      );
      console.log('[POST /api/doctores] Usuario creado:', userResult);

      const doctor_id = (userResult as any).insertId;
      console.log('[POST /api/doctores] ID del nuevo usuario:', doctor_id);

      // 2. Actualizar la entrada en medicos con los datos específicos
      console.log('[POST /api/doctores] Actualizando entrada en tabla medicos...');
      await conn.execute(
        `UPDATE medicos 
         SET consultorio_id = ?, especialidad = ?
         WHERE doctor_id = ?`,
        [consultorio_id, especialidad, doctor_id]
      );
      console.log('[POST /api/doctores] Entrada en medicos actualizada');

      // Confirmar transacción
      console.log('[POST /api/doctores] Confirmando transacción...');
      await conn.commit();
      console.log('[POST /api/doctores] Transacción confirmada');

      await conn.end();
      console.log('[POST /api/doctores] Conexión cerrada');

      return NextResponse.json(
        { message: 'Doctor creado con éxito', doctor_id },
        { status: 201 }
      );
    } catch (err) {
      // Revertir transacción en caso de error
      console.error('[POST /api/doctores] Error en la transacción:', err);
      await conn.rollback();
      console.log('[POST /api/doctores] Transacción revertida');
      throw err;
    }
  } catch (err) {
    console.error('[POST /api/doctores] Error:', err);
    console.error('[POST /api/doctores] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al crear el doctor' },
      { status: 500 }
    );
  }
} 