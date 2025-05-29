import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener todo el historial médico o un registro específico
export async function GET(request) {
  console.log('[GET /api/historial] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const historialId = searchParams.get('historialId');
    const expedienteId = searchParams.get('expedienteId');
    console.log('[GET /api/historial] Parámetros:', { historialId, expedienteId });

    console.log('[GET /api/historial] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/historial] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/historial] current_user_id asignado');

    let query = `
      SELECT 
        h.*,
        e.expediente_id,
        p.paciente_id,
        u.primer_nombre,
        u.apellido_paterno
      FROM historial_medico h
      JOIN expedientes e ON h.expediente_id = e.expediente_id
      JOIN pacientes p ON e.paciente_id = p.paciente_id
      JOIN usuarios u ON p.paciente_id = u.user_id
    `;
    const params = [];

    if (historialId) {
      query += ' WHERE h.historial_id = ?';
      params.push(historialId);
    } else if (expedienteId) {
      query += ' WHERE h.expediente_id = ?';
      params.push(expedienteId);
    }

    query += ' ORDER BY h.fecha_registro DESC';

    console.log('[GET /api/historial] Ejecutando consulta...');
    const [rows] = await conn.execute(query, params);
    console.log('[GET /api/historial] Resultados:', rows);

    await conn.end();
    console.log('[GET /api/historial] Conexión cerrada');

    if (historialId && !rows[0]) {
      return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
    }

    return NextResponse.json(historialId ? rows[0] : rows);
  } catch (error) {
    console.error('[GET /api/historial] Error:', error);
    console.error('[GET /api/historial] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al obtener historial médico' }, { status: 500 });
  }
}

// POST - Crear un nuevo registro en el historial médico
export async function POST(request) {
  console.log('[POST /api/historial] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[POST /api/historial] Datos recibidos:', data);

    const { expediente_id, diagnostico, tratamiento, observaciones } = data;

    console.log('[POST /api/historial] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/historial] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/historial] current_user_id asignado');

    // Verificar si el expediente existe
    console.log('[POST /api/historial] Verificando expediente...');
    const [expediente] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE expediente_id = ?',
      [expediente_id]
    );

    if (!expediente[0]) {
      console.log('[POST /api/historial] Expediente no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Expediente no encontrado' },
        { status: 404 }
      );
    }

    // Crear el registro en el historial
    console.log('[POST /api/historial] Creando registro...');
    const [result] = await conn.execute(
      'INSERT INTO historial_medico (expediente_id, diagnostico, tratamiento, observaciones) VALUES (?, ?, ?, ?)',
      [expediente_id, diagnostico, tratamiento, observaciones]
    );
    console.log('[POST /api/historial] Registro creado:', result);

    await conn.end();
    console.log('[POST /api/historial] Conexión cerrada');

    return NextResponse.json({
      message: 'Registro de historial creado exitosamente',
      historial_id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/historial] Error:', error);
    console.error('[POST /api/historial] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al crear registro de historial' }, { status: 500 });
  }
}

// PUT - Actualizar un registro del historial médico
export async function PUT(request) {
  console.log('[PUT /api/historial] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[PUT /api/historial] Datos recibidos:', data);

    const { historial_id, diagnostico, tratamiento, observaciones } = data;

    console.log('[PUT /api/historial] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/historial] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/historial] current_user_id asignado');

    // Verificar si el registro existe
    console.log('[PUT /api/historial] Verificando registro...');
    const [existing] = await conn.execute(
      'SELECT historial_id FROM historial_medico WHERE historial_id = ?',
      [historial_id]
    );

    if (!existing[0]) {
      console.log('[PUT /api/historial] Registro no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Registro de historial no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el registro
    console.log('[PUT /api/historial] Actualizando registro...');
    await conn.execute(
      'UPDATE historial_medico SET diagnostico = ?, tratamiento = ?, observaciones = ? WHERE historial_id = ?',
      [diagnostico, tratamiento, observaciones, historial_id]
    );
    console.log('[PUT /api/historial] Registro actualizado');

    await conn.end();
    console.log('[PUT /api/historial] Conexión cerrada');

    return NextResponse.json({ message: 'Registro de historial actualizado exitosamente' });
  } catch (error) {
    console.error('[PUT /api/historial] Error:', error);
    console.error('[PUT /api/historial] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al actualizar registro de historial' }, { status: 500 });
  }
}

// DELETE - Eliminar un registro del historial médico
export async function DELETE(request) {
  console.log('[DELETE /api/historial] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const historialId = searchParams.get('historialId');
    console.log('[DELETE /api/historial] ID del registro:', historialId);

    if (!historialId) {
      console.log('[DELETE /api/historial] ID de registro no proporcionado');
      return NextResponse.json(
        { error: 'ID de registro requerido' },
        { status: 400 }
      );
    }

    console.log('[DELETE /api/historial] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/historial] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/historial] current_user_id asignado');

    // Verificar si el registro existe
    console.log('[DELETE /api/historial] Verificando registro...');
    const [existing] = await conn.execute(
      'SELECT historial_id FROM historial_medico WHERE historial_id = ?',
      [historialId]
    );

    if (!existing[0]) {
      console.log('[DELETE /api/historial] Registro no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Registro de historial no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el registro
    console.log('[DELETE /api/historial] Eliminando registro...');
    await conn.execute(
      'DELETE FROM historial_medico WHERE historial_id = ?',
      [historialId]
    );
    console.log('[DELETE /api/historial] Registro eliminado');

    await conn.end();
    console.log('[DELETE /api/historial] Conexión cerrada');

    return NextResponse.json({ message: 'Registro de historial eliminado exitosamente' });
  } catch (error) {
    console.error('[DELETE /api/historial] Error:', error);
    console.error('[DELETE /api/historial] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al eliminar registro de historial' }, { status: 500 });
  }
} 