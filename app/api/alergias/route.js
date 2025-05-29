import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener todas las alergias o una alergia específica
export async function GET(request) {
  console.log('[GET /api/alergias] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const alergiaId = searchParams.get('alergiaId');
    const expedienteId = searchParams.get('expedienteId');
    console.log('[GET /api/alergias] Parámetros:', { alergiaId, expedienteId });

    console.log('[GET /api/alergias] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/alergias] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/alergias] current_user_id asignado');

    let query = `
      SELECT 
        a.*,
        e.expediente_id,
        p.paciente_id,
        u.primer_nombre,
        u.apellido_paterno
      FROM alergias a
      JOIN expedientes e ON a.expediente_id = e.expediente_id
      JOIN pacientes p ON e.paciente_id = p.paciente_id
      JOIN usuarios u ON p.paciente_id = u.user_id
    `;
    const params = [];

    if (alergiaId) {
      query += ' WHERE a.alergia_id = ?';
      params.push(alergiaId);
    } else if (expedienteId) {
      query += ' WHERE a.expediente_id = ?';
      params.push(expedienteId);
    }

    console.log('[GET /api/alergias] Ejecutando consulta...');
    const [rows] = await conn.execute(query, params);
    console.log('[GET /api/alergias] Resultados:', rows);

    await conn.end();
    console.log('[GET /api/alergias] Conexión cerrada');

    if (alergiaId && !rows[0]) {
      return NextResponse.json({ error: 'Alergia no encontrada' }, { status: 404 });
    }

    return NextResponse.json(alergiaId ? rows[0] : rows);
  } catch (error) {
    console.error('[GET /api/alergias] Error:', error);
    console.error('[GET /api/alergias] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al obtener alergias' }, { status: 500 });
  }
}

// POST - Crear una nueva alergia
export async function POST(request) {
  console.log('[POST /api/alergias] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[POST /api/alergias] Datos recibidos:', data);

    const { expediente_id, nombre_alergia, descripcion, severidad } = data;

    console.log('[POST /api/alergias] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/alergias] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/alergias] current_user_id asignado');

    // Verificar si el expediente existe
    console.log('[POST /api/alergias] Verificando expediente...');
    const [expediente] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE expediente_id = ?',
      [expediente_id]
    );

    if (!expediente[0]) {
      console.log('[POST /api/alergias] Expediente no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    // Crear la alergia
    console.log('[POST /api/alergias] Creando alergia...');
    const [result] = await conn.execute(
      'INSERT INTO alergias (expediente_id, nombre_alergia, descripcion, severidad) VALUES (?, ?, ?, ?)',
      [expediente_id, nombre_alergia, descripcion, severidad]
    );
    console.log('[POST /api/alergias] Alergia creada:', result);

    await conn.end();
    console.log('[POST /api/alergias] Conexión cerrada');

    return NextResponse.json({
      message: 'Alergia creada exitosamente',
      alergia_id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/alergias] Error:', error);
    console.error('[POST /api/alergias] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al crear alergia' }, { status: 500 });
  }
}

// PUT - Actualizar una alergia
export async function PUT(request) {
  console.log('[PUT /api/alergias] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[PUT /api/alergias] Datos recibidos:', data);

    const { alergia_id, nombre_alergia, descripcion, severidad } = data;

    console.log('[PUT /api/alergias] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/alergias] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/alergias] current_user_id asignado');

    // Verificar si la alergia existe
    console.log('[PUT /api/alergias] Verificando alergia...');
    const [existing] = await conn.execute(
      'SELECT alergia_id FROM alergias WHERE alergia_id = ?',
      [alergia_id]
    );

    if (!existing[0]) {
      console.log('[PUT /api/alergias] Alergia no encontrada');
      await conn.end();
      return NextResponse.json(
        { error: 'Alergia no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar la alergia
    console.log('[PUT /api/alergias] Actualizando alergia...');
    await conn.execute(
      'UPDATE alergias SET nombre_alergia = ?, descripcion = ?, severidad = ? WHERE alergia_id = ?',
      [nombre_alergia, descripcion, severidad, alergia_id]
    );
    console.log('[PUT /api/alergias] Alergia actualizada');

    await conn.end();
    console.log('[PUT /api/alergias] Conexión cerrada');

    return NextResponse.json({ message: 'Alergia actualizada exitosamente' });
  } catch (error) {
    console.error('[PUT /api/alergias] Error:', error);
    console.error('[PUT /api/alergias] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al actualizar alergia' }, { status: 500 });
  }
}

// DELETE - Eliminar una alergia
export async function DELETE(request) {
  console.log('[DELETE /api/alergias] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const alergiaId = searchParams.get('alergiaId');
    console.log('[DELETE /api/alergias] ID de la alergia:', alergiaId);

    if (!alergiaId) {
      console.log('[DELETE /api/alergias] ID de alergia no proporcionado');
      return NextResponse.json(
        { error: 'ID de alergia requerido' },
        { status: 400 }
      );
    }

    console.log('[DELETE /api/alergias] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/alergias] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/alergias] current_user_id asignado');

    // Verificar si la alergia existe
    console.log('[DELETE /api/alergias] Verificando alergia...');
    const [existing] = await conn.execute(
      'SELECT alergia_id FROM alergias WHERE alergia_id = ?',
      [alergiaId]
    );

    if (!existing[0]) {
      console.log('[DELETE /api/alergias] Alergia no encontrada');
      await conn.end();
      return NextResponse.json(
        { error: 'Alergia no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la alergia
    console.log('[DELETE /api/alergias] Eliminando alergia...');
    await conn.execute(
      'DELETE FROM alergias WHERE alergia_id = ?',
      [alergiaId]
    );
    console.log('[DELETE /api/alergias] Alergia eliminada');

    await conn.end();
    console.log('[DELETE /api/alergias] Conexión cerrada');

    return NextResponse.json({ message: 'Alergia eliminada exitosamente' });
  } catch (error) {
    console.error('[DELETE /api/alergias] Error:', error);
    console.error('[DELETE /api/alergias] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al eliminar alergia' }, { status: 500 });
  }
} 