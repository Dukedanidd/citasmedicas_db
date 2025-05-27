import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET /api/doctores/[id] - Obtener un doctor específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[GET /api/doctores/[id]] Iniciando petición...');
  try {
    const { id } = params;
    console.log('[GET /api/doctores/[id]] ID del doctor:', id);

    console.log('[GET /api/doctores/[id]] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/doctores/[id]] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/doctores/[id]] current_user_id asignado');

    console.log('[GET /api/doctores/[id]] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(
      `SELECT u.user_id AS doctor_id, u.primer_nombre, u.apellido_paterno,
              m.especialidad, c.nombre AS consultorio
       FROM medicos m
       JOIN usuarios u ON m.doctor_id = u.user_id
       JOIN consultorios c ON m.consultorio_id = c.consultorio_id
       WHERE u.user_id = ?`,
      [id]
    );
    console.log('[GET /api/doctores/[id]] Consulta ejecutada. Resultados:', rows);

    await conn.end();
    console.log('[GET /api/doctores/[id]] Conexión cerrada');

    if (!rows[0]) {
      return NextResponse.json(
        { error: 'Doctor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('[GET /api/doctores/[id]] Error:', err);
    console.error('[GET /api/doctores/[id]] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al obtener el doctor' },
      { status: 500 }
    );
  }
}

// PUT /api/doctores/[id] - Actualizar un doctor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[PUT /api/doctores/[id]] Iniciando petición...');
  try {
    const doctor_id = params.id;
    console.log('[PUT /api/doctores/[id]] ID del doctor:', doctor_id);

    const body = await request.json();
    console.log('[PUT /api/doctores/[id]] Datos recibidos:', body);

    console.log('[PUT /api/doctores/[id]] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/doctores/[id]] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/doctores/[id]] current_user_id asignado');

    // Iniciar transacción
    console.log('[PUT /api/doctores/[id]] Iniciando transacción...');
    await conn.beginTransaction();

    try {
      // Actualizar usuario
      console.log('[PUT /api/doctores/[id]] Actualizando tabla usuarios...');
      try {
        const [userResult] = await conn.execute(
          `UPDATE usuarios 
           SET primer_nombre = ?, apellido_paterno = ? 
           WHERE user_id = ?`,
          [body.primer_nombre, body.apellido_paterno, doctor_id]
        );
        console.log('[PUT /api/doctores/[id]] Resultado de actualización de usuario:', userResult);
      } catch (err) {
        console.error('[PUT /api/doctores/[id]] Error al actualizar usuario:', err);
        throw err;
      }
      console.log('[PUT /api/doctores/[id]] Usuario actualizado');

      // Actualizar médico
      console.log('[PUT /api/doctores/[id]] Actualizando tabla medicos...');
      try {
        const [medicoResult] = await conn.execute(
          `UPDATE medicos 
           SET especialidad = ?, consultorio_id = ? 
           WHERE doctor_id = ?`,
          [body.especialidad, body.consultorio_id, doctor_id]
        );
        console.log('[PUT /api/doctores/[id]] Resultado de actualización de médico:', medicoResult);
      } catch (err) {
        console.error('[PUT /api/doctores/[id]] Error al actualizar médico:', err);
        throw err;
      }
      console.log('[PUT /api/doctores/[id]] Médico actualizado');

      // Confirmar transacción
      console.log('[PUT /api/doctores/[id]] Confirmando transacción...');
      await conn.commit();
      console.log('[PUT /api/doctores/[id]] Transacción confirmada');

      await conn.end();
      console.log('[PUT /api/doctores/[id]] Conexión cerrada');

      return NextResponse.json({ message: 'Doctor actualizado con éxito' });
    } catch (err) {
      // Revertir transacción en caso de error
      console.error('[PUT /api/doctores/[id]] Error en la transacción:', err);
      await conn.rollback();
      console.log('[PUT /api/doctores/[id]] Transacción revertida');
      throw err;
    }
  } catch (err) {
    console.error('[PUT /api/doctores/[id]] Error:', err);
    console.error('[PUT /api/doctores/[id]] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al actualizar el doctor' },
      { status: 500 }
    );
  }
}

// DELETE /api/doctores/[id] - Eliminar un doctor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[DELETE /api/doctores/[id]] Iniciando petición...');
  try {
    const doctor_id = params.id;
    console.log('[DELETE /api/doctores/[id]] ID del doctor:', doctor_id);

    console.log('[DELETE /api/doctores/[id]] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/doctores/[id]] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/doctores/[id]] current_user_id asignado');

    // Primero eliminamos de la tabla medicos
    console.log('[DELETE /api/doctores/[id]] Eliminando de tabla medicos...');
    await conn.execute(
      'DELETE FROM medicos WHERE doctor_id = ?',
      [doctor_id]
    );
    console.log('[DELETE /api/doctores/[id]] Médico eliminado');

    // Luego eliminamos de la tabla usuarios
    console.log('[DELETE /api/doctores/[id]] Eliminando de tabla usuarios...');
    await conn.execute(
      'DELETE FROM usuarios WHERE user_id = ?',
      [doctor_id]
    );
    console.log('[DELETE /api/doctores/[id]] Usuario eliminado');

    await conn.end();
    console.log('[DELETE /api/doctores/[id]] Conexión cerrada');

    return NextResponse.json({ message: 'Doctor eliminado con éxito' });
  } catch (err) {
    console.error('[DELETE /api/doctores/[id]] Error:', err);
    console.error('[DELETE /api/doctores/[id]] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error al eliminar el doctor' },
      { status: 500 }
    );
  }
} 