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
  context: { params: { id: string } }
) {
  console.log('[GET /api/doctores/[id]] Iniciando petición...');
  try {
    const { id } = await context.params;
    console.log('[GET /api/doctores/[id]] ID del doctor:', id);

    console.log('[GET /api/doctores/[id]] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/doctores/[id]] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/doctores/[id]] current_user_id asignado');

    console.log('[GET /api/doctores/[id]] Ejecutando consulta SQL...');
    const [rows] = await conn.execute(
      `SELECT u.user_id AS doctor_id, u.primer_nombre, u.segundo_nombre,
              u.apellido_paterno, u.apellido_materno, u.email, 
              m.especialidad, c.nombre AS consultorio,
              c.consultorio_id
       FROM medicos m
       JOIN usuarios u ON m.doctor_id = u.user_id
       LEFT JOIN consultorios c ON m.consultorio_id = c.consultorio_id
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
  context: { params: { id: string } }
) {
  console.log('[PUT /api/doctores/[id]] Iniciando petición...');
  try {
    const { id: doctor_id } = await context.params;
    console.log('[PUT /api/doctores/[id]] ID del doctor:', doctor_id);

    const body = await request.json();
    console.log('[PUT /api/doctores/[id]] Datos recibidos:', body);

    // Procesar campos exactamente como lo hace el formulario
    const primer_nombre = body.primer_nombre?.trim() || null;
    const segundo_nombre = body.segundo_nombre || null; // El formulario envía el valor tal cual
    const apellido_paterno = body.apellido_paterno?.trim() || null;
    const apellido_materno = body.apellido_materno || null; // El formulario envía el valor tal cual
    const password = body.password || null; // El formulario envía el valor tal cual
    const especialidad = body.especialidad?.trim() || null;
    const consultorio_id = body.consultorio_id || null;

    console.log('[PUT /api/doctores/[id]] Valores procesados:', {
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      password: password ? '[REDACTED]' : null,
      especialidad,
      consultorio_id
    });

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
      // Verificar que el doctor existe
      const [existingDoctor] = await conn.execute(
        `SELECT u.user_id, m.doctor_id 
         FROM usuarios u 
         JOIN medicos m ON u.user_id = m.doctor_id 
         WHERE u.user_id = ?`,
        [doctor_id]
      );

      if (!existingDoctor[0]) {
        throw new Error('Doctor no encontrado');
      }

      // Actualizar usuario
      console.log('[PUT /api/doctores/[id]] Actualizando tabla usuarios...');
      try {
        // Construir la consulta SQL dinámicamente basada en si hay contraseña o no
        let updateUserQuery = `
          UPDATE usuarios 
          SET primer_nombre = ?, 
              segundo_nombre = ?,
              apellido_paterno = ?,
              apellido_materno = ?
        `;
        
        const updateUserParams = [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno];

        // Solo actualizar la contraseña si se proporciona una nueva
        if (password) {
          updateUserQuery += `, password = ?`;
          updateUserParams.push(password);
        }

        updateUserQuery += ` WHERE user_id = ?`;
        updateUserParams.push(doctor_id);

        const [userResult] = await conn.execute(updateUserQuery, updateUserParams);
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
           SET especialidad = ?, 
               consultorio_id = ?
           WHERE doctor_id = ?`,
          [especialidad, consultorio_id, doctor_id]
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

      // Obtener los datos actualizados del doctor
      console.log('[PUT /api/doctores/[id]] Obteniendo datos actualizados...');
      const [updatedDoctor] = await conn.execute(
        `SELECT u.user_id AS doctor_id, u.primer_nombre, u.segundo_nombre,
                u.apellido_paterno, u.apellido_materno, u.email, 
                m.especialidad, c.nombre AS consultorio,
                c.consultorio_id
         FROM medicos m
         JOIN usuarios u ON m.doctor_id = u.user_id
         LEFT JOIN consultorios c ON m.consultorio_id = c.consultorio_id
         WHERE u.user_id = ?`,
        [doctor_id]
      );
      console.log('[PUT /api/doctores/[id]] Datos actualizados obtenidos:', updatedDoctor[0]);

      // Cerrar la conexión después de obtener los datos
      await conn.end();
      console.log('[PUT /api/doctores/[id]] Conexión cerrada');

      return NextResponse.json(updatedDoctor[0]);
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
  context: { params: { id: string } }
) {
  console.log('[DELETE /api/doctores/[id]] Iniciando petición...');
  try {
    const doctor_id = context.params.id;
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