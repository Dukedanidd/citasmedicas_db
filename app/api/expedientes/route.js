import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener todos los expedientes o un expediente específico
export async function GET(request) {
  console.log('[GET /api/expedientes] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const expedienteId = searchParams.get('expedienteId');
    const pacienteId = searchParams.get('pacienteId');
    console.log('[GET /api/expedientes] Parámetros:', { expedienteId, pacienteId });

    console.log('[GET /api/expedientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/expedientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/expedientes] current_user_id asignado');

    let query = `
      SELECT 
        e.*,
        p.paciente_id,
        u.primer_nombre,
        u.apellido_paterno,
        m.especialidad as doctor_especialidad
      FROM expedientes e
      JOIN pacientes p ON e.paciente_id = p.paciente_id
      JOIN usuarios u ON p.paciente_id = u.user_id
      JOIN medicos m ON p.doctor_id = m.doctor_id
    `;
    const params = [];

    if (expedienteId) {
      query += ' WHERE e.expediente_id = ?';
      params.push(expedienteId);
    } else if (pacienteId) {
      query += ' WHERE e.paciente_id = ?';
      params.push(pacienteId);
    }

    console.log('[GET /api/expedientes] Ejecutando consulta...');
    const [rows] = await conn.execute(query, params);
    console.log('[GET /api/expedientes] Resultados:', rows);

    await conn.end();
    console.log('[GET /api/expedientes] Conexión cerrada');

    if (expedienteId && !rows[0]) {
      return NextResponse.json({ error: 'Expediente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(expedienteId ? rows[0] : rows);
  } catch (error) {
    console.error('[GET /api/expedientes] Error:', error);
    console.error('[GET /api/expedientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al obtener expedientes' }, { status: 500 });
  }
}

// POST - Crear un nuevo expediente
export async function POST(request) {
  console.log('[POST /api/expedientes] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[POST /api/expedientes] Datos recibidos:', data);

    const { paciente_id, notas_generales } = data;

    console.log('[POST /api/expedientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/expedientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/expedientes] current_user_id asignado');

    // Verificar si el paciente ya tiene un expediente
    console.log('[POST /api/expedientes] Verificando expediente existente...');
    const [existing] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE paciente_id = ?',
      [paciente_id]
    );

    if (existing.length > 0) {
      console.log('[POST /api/expedientes] El paciente ya tiene un expediente');
      await conn.end();
      return NextResponse.json(
        { error: 'El paciente ya tiene un expediente registrado' },
        { status: 400 }
      );
    }

    // Crear el expediente
    console.log('[POST /api/expedientes] Creando expediente...');
    const [result] = await conn.execute(
      'INSERT INTO expedientes (paciente_id, notas_generales) VALUES (?, ?)',
      [paciente_id, notas_generales]
    );
    console.log('[POST /api/expedientes] Expediente creado:', result);

    await conn.end();
    console.log('[POST /api/expedientes] Conexión cerrada');

    return NextResponse.json({
      message: 'Expediente creado exitosamente',
      expediente_id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/expedientes] Error:', error);
    console.error('[POST /api/expedientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al crear expediente' }, { status: 500 });
  }
}

// PUT - Actualizar un expediente
export async function PUT(request) {
  console.log('[PUT /api/expedientes] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[PUT /api/expedientes] Datos recibidos:', data);

    const { expediente_id, notas_generales } = data;

    console.log('[PUT /api/expedientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/expedientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/expedientes] current_user_id asignado');

    // Verificar si el expediente existe
    console.log('[PUT /api/expedientes] Verificando expediente...');
    const [existing] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE expediente_id = ?',
      [expediente_id]
    );

    if (!existing[0]) {
      console.log('[PUT /api/expedientes] Expediente no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el expediente
    console.log('[PUT /api/expedientes] Actualizando expediente...');
    await conn.execute(
      'UPDATE expedientes SET notas_generales = ? WHERE expediente_id = ?',
      [notas_generales, expediente_id]
    );
    console.log('[PUT /api/expedientes] Expediente actualizado');

    await conn.end();
    console.log('[PUT /api/expedientes] Conexión cerrada');

    return NextResponse.json({ message: 'Expediente actualizado exitosamente' });
  } catch (error) {
    console.error('[PUT /api/expedientes] Error:', error);
    console.error('[PUT /api/expedientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al actualizar expediente' }, { status: 500 });
  }
}

// DELETE - Eliminar un expediente
export async function DELETE(request) {
  console.log('[DELETE /api/expedientes] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const expedienteId = searchParams.get('expedienteId');
    console.log('[DELETE /api/expedientes] ID del expediente:', expedienteId);

    if (!expedienteId) {
      console.log('[DELETE /api/expedientes] ID de expediente no proporcionado');
      return NextResponse.json(
        { error: 'ID de expediente requerido' },
        { status: 400 }
      );
    }

    console.log('[DELETE /api/expedientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/expedientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/expedientes] current_user_id asignado');

    // Verificar si el expediente existe
    console.log('[DELETE /api/expedientes] Verificando expediente...');
    const [existing] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE expediente_id = ?',
      [expedienteId]
    );

    if (!existing[0]) {
      console.log('[DELETE /api/expedientes] Expediente no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el expediente
    console.log('[DELETE /api/expedientes] Eliminando expediente...');
    await conn.execute(
      'DELETE FROM expedientes WHERE expediente_id = ?',
      [expedienteId]
    );
    console.log('[DELETE /api/expedientes] Expediente eliminado');

    await conn.end();
    console.log('[DELETE /api/expedientes] Conexión cerrada');

    return NextResponse.json({ message: 'Expediente eliminado exitosamente' });
  } catch (error) {
    console.error('[DELETE /api/expedientes] Error:', error);
    console.error('[DELETE /api/expedientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al eliminar expediente' }, { status: 500 });
  }
} 