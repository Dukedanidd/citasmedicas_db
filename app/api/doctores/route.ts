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
  let conn;
  try {
    console.log('[GET /api/doctores] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/doctores] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/doctores] current_user_id asignado');

    console.log('[GET /api/doctores] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(`
      SELECT u.user_id AS doctor_id, u.primer_nombre, u.apellido_paterno,
             u.email, m.especialidad, c.nombre AS consultorio
      FROM medicos m
      JOIN usuarios u ON m.doctor_id = u.user_id
      JOIN consultorios c ON m.consultorio_id = c.consultorio_id
    `);
    console.log('[GET /api/doctores] Consulta ejecutada. Resultados:', rows);

    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/doctores] Error:', err);
    console.error('[GET /api/doctores] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener los doctores' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[GET /api/doctores] Conexión cerrada');
    }
  }
}

// POST /api/doctores - Crear un nuevo doctor
export async function POST(request: Request) {
  console.log('[POST /api/doctores] Iniciando petición...');
  let conn;
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

    if (!primer_nombre || !apellido_paterno || !email || !password || !especialidad || !consultorio_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    console.log('[POST /api/doctores] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/doctores] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[POST /api/doctores] Transacción iniciada');

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
      await conn.rollback();
      console.log('[POST /api/doctores] No se encontró el rol de doctor');
      return NextResponse.json(
        { error: 'No se encontró el rol de doctor en la base de datos' },
        { status: 500 }
      );
    }

    const role_id = roles[0].role_id;
    console.log('[POST /api/doctores] Role_id obtenido:', role_id);

    // Verificar si el email ya existe
    console.log('[POST /api/doctores] Verificando email...');
    const [existingUser] = await conn.execute(
      'SELECT user_id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser[0]) {
      await conn.rollback();
      console.log('[POST /api/doctores] Email ya existe');
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Insertar usuario
    console.log('[POST /api/doctores] Creando usuario...');
    const [userResult] = await conn.execute(`
      INSERT INTO usuarios (
        primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
        email, password, role_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      primer_nombre, segundo_nombre || null, apellido_paterno,
      apellido_materno || null, email, password, role_id
    ]);

    const doctor_id = userResult.insertId;
    console.log('[POST /api/doctores] Usuario creado con ID:', doctor_id);

    // Actualizar el médico creado por el trigger con la especialidad y consultorio
    console.log('[POST /api/doctores] Actualizando datos del médico...');
    await conn.execute(`
      UPDATE medicos 
      SET especialidad = ?, consultorio_id = ?
      WHERE doctor_id = ?
    `, [especialidad, consultorio_id, doctor_id]);

    await conn.commit();
    console.log('[POST /api/doctores] Transacción completada');

    // Obtener los datos completos del doctor recién creado
    const [newDoctorData] = await conn.execute(`
      SELECT u.user_id AS doctor_id, u.primer_nombre, u.apellido_paterno,
             u.email, m.especialidad, c.nombre AS consultorio
      FROM medicos m
      JOIN usuarios u ON m.doctor_id = u.user_id
      JOIN consultorios c ON m.consultorio_id = c.consultorio_id
      WHERE u.user_id = ?
    `, [doctor_id]);

    return NextResponse.json(newDoctorData[0], { status: 201 });
  } catch (error) {
    console.error('[POST /api/doctores] Error:', error);
    console.error('[POST /api/doctores] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[POST /api/doctores] Transacción revertida');
    }
    return NextResponse.json(
      { error: 'Error al crear el doctor' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[POST /api/doctores] Conexión cerrada');
    }
  }
} 