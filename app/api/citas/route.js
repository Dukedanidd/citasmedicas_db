import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener todas las citas o una cita específica
export async function GET(request) {
  console.log('[GET /api/citas] Iniciando petición...');
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const citaId = searchParams.get('citaId');
    const pacienteId = searchParams.get('pacienteId');
    const doctorId = searchParams.get('doctorId');
    console.log('[GET /api/citas] Parámetros:', { citaId, pacienteId, doctorId });

    if (!citaId && !pacienteId && !doctorId) {
      return NextResponse.json(
        { error: 'Se requiere citaId, pacienteId o doctorId' },
        { status: 400 }
      );
    }

    console.log('[GET /api/citas] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/citas] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/citas] current_user_id asignado');

    let query = `
      SELECT 
        c.*,
        p.primer_nombre as paciente_nombre,
        p.apellido_paterno as paciente_apellido,
        d.primer_nombre as doctor_nombre,
        d.apellido_paterno as doctor_apellido,
        e.nombre as estado_nombre
      FROM citas c
      JOIN usuarios p ON c.paciente_id = p.user_id
      JOIN usuarios d ON c.doctor_id = d.user_id
      JOIN estado_citas e ON c.estado_id = e.estado_id
      WHERE 1=1
    `;
    const params = [];

    if (citaId) {
      query += ' AND c.cita_id = ?';
      params.push(citaId);
    }
    if (pacienteId) {
      query += ' AND c.paciente_id = ?';
      params.push(pacienteId);
    }
    if (doctorId) {
      query += ' AND c.doctor_id = ?';
      params.push(doctorId);
    }

    console.log('[GET /api/citas] Ejecutando query:', query);
    const [rows] = await conn.execute(query, params);
    console.log('[GET /api/citas] Resultados:', rows);

    if (citaId && !rows[0]) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(citaId ? rows[0] : rows);
  } catch (error) {
    console.error('[GET /api/citas] Error:', error);
    console.error('[GET /api/citas] Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Error al obtener citas' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[GET /api/citas] Conexión cerrada');
    }
  }
}

// POST - Crear una nueva cita
export async function POST(request) {
  console.log('[POST /api/citas] Iniciando petición...');
  let conn;
  try {
    const data = await request.json();
    console.log('[POST /api/citas] Datos recibidos:', data);

    const {
      paciente_id,
      doctor_id,
      fecha_hora,
      estado_id,
      notas
    } = data;

    if (!paciente_id || !doctor_id || !fecha_hora || !estado_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    console.log('[POST /api/citas] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/citas] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[POST /api/citas] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/citas] current_user_id asignado');

    // Verificar si el paciente existe
    console.log('[POST /api/citas] Verificando paciente...');
    const [paciente] = await conn.execute(
      'SELECT user_id FROM usuarios WHERE user_id = ?',
      [paciente_id]
    );

    if (!paciente[0]) {
      await conn.rollback();
      console.log('[POST /api/citas] Paciente no encontrado');
      return NextResponse.json(
        { error: 'El paciente especificado no existe' },
        { status: 400 }
      );
    }

    // Verificar si el doctor existe
    console.log('[POST /api/citas] Verificando doctor...');
    const [doctor] = await conn.execute(
      'SELECT user_id FROM usuarios WHERE user_id = ?',
      [doctor_id]
    );

    if (!doctor[0]) {
      await conn.rollback();
      console.log('[POST /api/citas] Doctor no encontrado');
      return NextResponse.json(
        { error: 'El doctor especificado no existe' },
        { status: 400 }
      );
    }

    // Verificar si el estado existe
    console.log('[POST /api/citas] Verificando estado...');
    const [estado] = await conn.execute(
      'SELECT estado_id FROM estado_citas WHERE estado_id = ?',
      [estado_id]
    );

    if (!estado[0]) {
      await conn.rollback();
      console.log('[POST /api/citas] Estado no encontrado');
      return NextResponse.json(
        { error: 'El estado especificado no existe' },
        { status: 400 }
      );
    }

    // Verificar disponibilidad del doctor
    console.log('[POST /api/citas] Verificando disponibilidad del doctor...');
    const [citasExistentes] = await conn.execute(`
      SELECT cita_id FROM citas 
      WHERE doctor_id = ? 
      AND fecha_hora = ?
      AND estado_id != 3
    `, [doctor_id, fecha_hora]);

    if (citasExistentes.length > 0) {
      await conn.rollback();
      console.log('[POST /api/citas] Doctor no disponible en la fecha/hora especificada');
      return NextResponse.json(
        { error: 'El doctor no está disponible en la fecha y hora especificadas' },
        { status: 400 }
      );
    }

    // Crear la cita
    console.log('[POST /api/citas] Creando cita...');
    const [result] = await conn.execute(`
      INSERT INTO citas (
        paciente_id,
        doctor_id,
        fecha_hora,
        estado_id,
        notas
      ) VALUES (?, ?, ?, ?, ?)
    `, [paciente_id, doctor_id, fecha_hora, estado_id, notas || null]);

    await conn.commit();
    console.log('[POST /api/citas] Transacción completada');

    return NextResponse.json({
      message: 'Cita creada exitosamente',
      cita_id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/citas] Error:', error);
    console.error('[POST /api/citas] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[POST /api/citas] Transacción revertida');
    }
    return NextResponse.json(
      { error: 'Error al crear cita' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[POST /api/citas] Conexión cerrada');
    }
  }
}

// PUT - Actualizar una cita
export async function PUT(request) {
  console.log('[PUT /api/citas] Iniciando petición...');
  let conn;
  try {
    const data = await request.json();
    console.log('[PUT /api/citas] Datos recibidos:', data);

    const {
      cita_id,
      paciente_id,
      doctor_id,
      fecha_hora,
      estado_id,
      notas
    } = data;

    if (!cita_id) {
      return NextResponse.json(
        { error: 'ID de cita requerido' },
        { status: 400 }
      );
    }

    console.log('[PUT /api/citas] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/citas] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[PUT /api/citas] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/citas] current_user_id asignado');

    // Verificar si la cita existe
    console.log('[PUT /api/citas] Verificando cita...');
    const [cita] = await conn.execute(
      'SELECT cita_id FROM citas WHERE cita_id = ?',
      [cita_id]
    );

    if (!cita[0]) {
      await conn.rollback();
      console.log('[PUT /api/citas] Cita no encontrada');
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si el paciente existe si se está actualizando
    if (paciente_id) {
      console.log('[PUT /api/citas] Verificando paciente...');
      const [paciente] = await conn.execute(
        'SELECT user_id FROM usuarios WHERE user_id = ?',
        [paciente_id]
      );

      if (!paciente[0]) {
        await conn.rollback();
        console.log('[PUT /api/citas] Paciente no encontrado');
        return NextResponse.json(
          { error: 'El paciente especificado no existe' },
          { status: 400 }
        );
      }
    }

    // Verificar si el doctor existe si se está actualizando
    if (doctor_id) {
      console.log('[PUT /api/citas] Verificando doctor...');
      const [doctor] = await conn.execute(
        'SELECT user_id FROM usuarios WHERE user_id = ?',
        [doctor_id]
      );

      if (!doctor[0]) {
        await conn.rollback();
        console.log('[PUT /api/citas] Doctor no encontrado');
        return NextResponse.json(
          { error: 'El doctor especificado no existe' },
          { status: 400 }
        );
      }
    }

    // Verificar si el estado existe si se está actualizando
    if (estado_id) {
      console.log('[PUT /api/citas] Verificando estado...');
      const [estado] = await conn.execute(
        'SELECT estado_id FROM estado_citas WHERE estado_id = ?',
        [estado_id]
      );

      if (!estado[0]) {
        await conn.rollback();
        console.log('[PUT /api/citas] Estado no encontrado');
        return NextResponse.json(
          { error: 'El estado especificado no existe' },
          { status: 400 }
        );
      }
    }

    // Verificar disponibilidad del doctor si se está actualizando fecha/hora
    if (doctor_id && fecha_hora) {
      console.log('[PUT /api/citas] Verificando disponibilidad del doctor...');
      const [citasExistentes] = await conn.execute(`
        SELECT cita_id FROM citas 
        WHERE doctor_id = ? 
        AND fecha_hora = ?
        AND estado_id != 3
        AND cita_id != ?
      `, [doctor_id, fecha_hora, cita_id]);

      if (citasExistentes.length > 0) {
        await conn.rollback();
        console.log('[PUT /api/citas] Doctor no disponible en la fecha/hora especificada');
        return NextResponse.json(
          { error: 'El doctor no está disponible en la fecha y hora especificadas' },
          { status: 400 }
        );
      }
    }

    // Actualizar la cita
    console.log('[PUT /api/citas] Actualizando cita...');
    await conn.execute(`
      UPDATE citas
      SET paciente_id = COALESCE(?, paciente_id),
          doctor_id = COALESCE(?, doctor_id),
          fecha_hora = COALESCE(?, fecha_hora),
          estado_id = COALESCE(?, estado_id),
          notas = COALESCE(?, notas)
      WHERE cita_id = ?
    `, [paciente_id, doctor_id, fecha_hora, estado_id, notas, cita_id]);

    await conn.commit();
    console.log('[PUT /api/citas] Transacción completada');

    return NextResponse.json({
      message: 'Cita actualizada exitosamente'
    });
  } catch (error) {
    console.error('[PUT /api/citas] Error:', error);
    console.error('[PUT /api/citas] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[PUT /api/citas] Transacción revertida');
    }
    return NextResponse.json(
      { error: 'Error al actualizar cita' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[PUT /api/citas] Conexión cerrada');
    }
  }
}

// DELETE - Eliminar una cita
export async function DELETE(request) {
  console.log('[DELETE /api/citas] Iniciando petición...');
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const citaId = searchParams.get('citaId');
    console.log('[DELETE /api/citas] ID de cita:', citaId);

    if (!citaId) {
      return NextResponse.json(
        { error: 'ID de cita requerido' },
        { status: 400 }
      );
    }

    console.log('[DELETE /api/citas] Conectando a la base de datos...');
    conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/citas] Conexión exitosa');

    // Iniciar transacción
    await conn.beginTransaction();
    console.log('[DELETE /api/citas] Transacción iniciada');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/citas] current_user_id asignado');

    // Verificar si la cita existe
    console.log('[DELETE /api/citas] Verificando cita...');
    const [cita] = await conn.execute(
      'SELECT cita_id FROM citas WHERE cita_id = ?',
      [citaId]
    );

    if (!cita[0]) {
      await conn.rollback();
      console.log('[DELETE /api/citas] Cita no encontrada');
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la cita
    console.log('[DELETE /api/citas] Eliminando cita...');
    await conn.execute('DELETE FROM citas WHERE cita_id = ?', [citaId]);

    await conn.commit();
    console.log('[DELETE /api/citas] Transacción completada');

    return NextResponse.json({
      message: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    console.error('[DELETE /api/citas] Error:', error);
    console.error('[DELETE /api/citas] Stack trace:', error.stack);
    if (conn) {
      await conn.rollback();
      console.log('[DELETE /api/citas] Transacción revertida');
    }
    return NextResponse.json(
      { error: 'Error al eliminar cita' },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log('[DELETE /api/citas] Conexión cerrada');
    }
  }
} 