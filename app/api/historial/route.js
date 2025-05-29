import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener historial médico
export async function GET(request) {
  console.log('[GET /api/historial] Iniciando petición...');
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const historialId = searchParams.get('historialId');
    const expedienteId = searchParams.get('expedienteId');

    console.log('[GET /api/historial] Parámetros:', { historialId, expedienteId });

    if (!historialId && !expedienteId) {
      return NextResponse.json({ error: 'Se requiere ID de historial o expediente' }, { status: 400 });
    }

    console.log('[GET /api/historial] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/historial] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/historial] current_user_id asignado');

    let query = `
      SELECT h.*, e.paciente_id
      FROM historial_medico h
      JOIN expedientes e ON h.expediente_id = e.expediente_id
      WHERE 1=1
    `;
    const params = [];

    if (historialId) {
      query += ' AND h.historial_id = ?';
      params.push(historialId);
    } else if (expedienteId) {
      query += ' AND h.expediente_id = ?';
      params.push(expedienteId);
    }

    query += ' ORDER BY h.fecha_registro DESC';

    console.log('[GET /api/historial] Ejecutando consulta...');
    const [rows] = await conn.execute(query, params);
    console.log('[GET /api/historial] Resultados:', rows);

    if (historialId && !rows[0]) {
      return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
    }

    return NextResponse.json(historialId ? rows[0] : rows);
  } catch (error) {
    console.error('[GET /api/historial] Error:', error);
    console.error('[GET /api/historial] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al obtener historial médico' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
      console.log('[GET /api/historial] Conexión cerrada');
    }
  }
}

// POST - Crear nuevo registro de historial médico
export async function POST(request) {
  console.log('[POST /api/historial] Iniciando petición...');
  let conn;
  try {
    const data = await request.json();
    console.log('[POST /api/historial] Datos recibidos:', data);

    const { expediente_id, descripcion } = data;

    if (!expediente_id || !descripcion) {
      return NextResponse.json({ 
        error: 'expediente_id y descripcion son requeridos' 
      }, { status: 400 });
    }

    console.log('[POST /api/historial] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/historial] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[POST /api/historial] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/historial] current_user_id asignado');

    // Verificar que el expediente existe
    console.log('[POST /api/historial] Verificando expediente...');
    const [expediente] = await conn.execute(
      'SELECT expediente_id FROM expedientes WHERE expediente_id = ?',
      [expediente_id]
    );

    if (!expediente[0]) {
      await conn.rollback();
      return NextResponse.json({ error: 'Expediente no encontrado' }, { status: 404 });
    }

    // Insertar el nuevo registro
    console.log('[POST /api/historial] Creando registro...');
    const [result] = await conn.execute(`
      INSERT INTO historial_medico (expediente_id, descripcion, fecha_registro)
      VALUES (?, ?, NOW())
    `, [expediente_id, descripcion]);

    await conn.commit();
    console.log('[POST /api/historial] Transacción completada');

    return NextResponse.json({ 
      message: 'Registro de historial médico creado exitosamente',
      historial_id: result.insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/historial] Error:', error);
    console.error('[POST /api/historial] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[POST /api/historial] Transacción revertida');
    }
    return NextResponse.json({ error: 'Error al crear registro de historial médico' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
      console.log('[POST /api/historial] Conexión cerrada');
    }
  }
}

// PUT - Actualizar registro de historial médico
export async function PUT(request) {
  console.log('[PUT /api/historial] Iniciando petición...');
  let conn;
  try {
    const data = await request.json();
    console.log('[PUT /api/historial] Datos recibidos:', data);

    const { historial_id, descripcion } = data;

    if (!historial_id) {
      return NextResponse.json({ error: 'historial_id es requerido' }, { status: 400 });
    }

    console.log('[PUT /api/historial] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/historial] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[PUT /api/historial] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/historial] current_user_id asignado');

    // Verificar que el registro existe
    console.log('[PUT /api/historial] Verificando existencia del registro...');
    const [historial] = await conn.execute(
      'SELECT historial_id FROM historial_medico WHERE historial_id = ?',
      [historial_id]
    );

    if (!historial[0]) {
      await conn.rollback();
      return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
    }

    // Actualizar el registro
    console.log('[PUT /api/historial] Actualizando registro...');
    await conn.execute(`
      UPDATE historial_medico
      SET descripcion = ?
      WHERE historial_id = ?
    `, [descripcion, historial_id]);

    await conn.commit();
    console.log('[PUT /api/historial] Transacción completada');

    return NextResponse.json({ message: 'Registro de historial médico actualizado exitosamente' });
  } catch (error) {
    console.error('[PUT /api/historial] Error:', error);
    console.error('[PUT /api/historial] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[PUT /api/historial] Transacción revertida');
    }
    return NextResponse.json({ error: 'Error al actualizar registro de historial médico' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
      console.log('[PUT /api/historial] Conexión cerrada');
    }
  }
}

// DELETE - Eliminar registro de historial médico
export async function DELETE(request) {
  console.log('[DELETE /api/historial] Iniciando petición...');
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const historialId = searchParams.get('historialId');

    if (!historialId) {
      return NextResponse.json({ error: 'ID de historial requerido' }, { status: 400 });
    }

    console.log('[DELETE /api/historial] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/historial] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[DELETE /api/historial] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/historial] current_user_id asignado');

    // Verificar que el registro existe
    console.log('[DELETE /api/historial] Verificando existencia del registro...');
    const [historial] = await conn.execute(
      'SELECT historial_id FROM historial_medico WHERE historial_id = ?',
      [historialId]
    );

    if (!historial[0]) {
      await conn.rollback();
      return NextResponse.json({ error: 'Registro de historial no encontrado' }, { status: 404 });
    }

    // Eliminar el registro
    console.log('[DELETE /api/historial] Eliminando registro...');
    await conn.execute('DELETE FROM historial_medico WHERE historial_id = ?', [historialId]);

    await conn.commit();
    console.log('[DELETE /api/historial] Transacción completada');

    return NextResponse.json({ message: 'Registro de historial médico eliminado exitosamente' });
  } catch (error) {
    console.error('[DELETE /api/historial] Error:', error);
    console.error('[DELETE /api/historial] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[DELETE /api/historial] Transacción revertida');
    }
    return NextResponse.json({ error: 'Error al eliminar registro de historial médico' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
      console.log('[DELETE /api/historial] Conexión cerrada');
    }
  }
} 