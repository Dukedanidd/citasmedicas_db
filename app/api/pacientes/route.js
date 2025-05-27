import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// GET - Obtener todos los pacientes o un paciente específico
export async function GET(request) {
  console.log('[GET /api/pacientes] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');
    console.log('[GET /api/pacientes] ID del paciente:', pacienteId);

    console.log('[GET /api/pacientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[GET /api/pacientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[GET /api/pacientes] current_user_id asignado');

    if (pacienteId) {
      console.log('[GET /api/pacientes] Obteniendo paciente específico...');
      const [rows] = await conn.execute(`
        SELECT p.*, u.nombre, u.email, u.telefono
        FROM pacientes p
        JOIN usuarios u ON p.paciente_id = u.user_id
        WHERE p.paciente_id = ?
      `, [pacienteId]);
      console.log('[GET /api/pacientes] Resultados:', rows);

      if (!rows[0]) {
        console.log('[GET /api/pacientes] Paciente no encontrado');
        await conn.end();
        return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
      }

      await conn.end();
      console.log('[GET /api/pacientes] Conexión cerrada');
      return NextResponse.json(rows[0]);
    }

    console.log('[GET /api/pacientes] Obteniendo todos los pacientes...');
    const [rows] = await conn.execute(`
      SELECT p.*, u.nombre, u.email, u.telefono
      FROM pacientes p
      JOIN usuarios u ON p.paciente_id = u.user_id
    `);
    console.log('[GET /api/pacientes] Resultados:', rows);

    await conn.end();
    console.log('[GET /api/pacientes] Conexión cerrada');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[GET /api/pacientes] Error:', error);
    console.error('[GET /api/pacientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al obtener pacientes' }, { status: 500 });
  }
}

// POST - Crear un nuevo paciente
export async function POST(request) {
  console.log('[POST /api/pacientes] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[POST /api/pacientes] Datos recibidos:', { ...data, password: '***' });

    const { nombre, email, password, telefono, fecha_nacimiento, genero, direccion } = data;

    console.log('[POST /api/pacientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/pacientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[POST /api/pacientes] current_user_id asignado');

    // Obtener el role_id para pacientes
    console.log('[POST /api/pacientes] Obteniendo role_id para pacientes...');
    const [roles] = await conn.execute(
      'SELECT role_id FROM roles WHERE nombre = ?',
      ['paciente']
    );
    
    if (!roles[0]) {
      console.log('[POST /api/pacientes] No se encontró el rol de paciente');
      await conn.end();
      return NextResponse.json(
        { error: 'No se encontró el rol de paciente en la base de datos' },
        { status: 500 }
      );
    }

    const role_id = roles[0].role_id;
    console.log('[POST /api/pacientes] Role_id obtenido:', role_id);

    // Iniciar transacción
    console.log('[POST /api/pacientes] Iniciando transacción...');
    await conn.beginTransaction();

    try {
      // 1. Crear el usuario
      console.log('[POST /api/pacientes] Creando usuario...');
      const [userResult] = await conn.execute(`
        INSERT INTO usuarios (nombre, email, password, telefono, role_id)
        VALUES (?, ?, ?, ?, ?)
      `, [nombre, email, password, telefono, role_id]);
      console.log('[POST /api/pacientes] Usuario creado:', userResult);

      const paciente_id = userResult.insertId;
      console.log('[POST /api/pacientes] ID del nuevo usuario:', paciente_id);

      // 2. Crear el paciente
      console.log('[POST /api/pacientes] Creando paciente...');
      await conn.execute(`
        INSERT INTO pacientes (paciente_id, fecha_nacimiento, genero, direccion)
        VALUES (?, ?, ?, ?)
      `, [paciente_id, fecha_nacimiento, genero, direccion]);
      console.log('[POST /api/pacientes] Paciente creado');

      // Confirmar transacción
      console.log('[POST /api/pacientes] Confirmando transacción...');
      await conn.commit();
      console.log('[POST /api/pacientes] Transacción confirmada');

      await conn.end();
      console.log('[POST /api/pacientes] Conexión cerrada');

      return NextResponse.json({ 
        message: 'Paciente creado exitosamente',
        paciente_id 
      }, { status: 201 });
    } catch (error) {
      // Revertir transacción en caso de error
      console.error('[POST /api/pacientes] Error en la transacción:', error);
      await conn.rollback();
      console.log('[POST /api/pacientes] Transacción revertida');
      throw error;
    }
  } catch (error) {
    console.error('[POST /api/pacientes] Error:', error);
    console.error('[POST /api/pacientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al crear paciente' }, { status: 500 });
  }
}

// PUT - Actualizar un paciente
export async function PUT(request) {
  console.log('[PUT /api/pacientes] Iniciando petición...');
  try {
    const data = await request.json();
    console.log('[PUT /api/pacientes] Datos recibidos:', { ...data, password: '***' });

    const { paciente_id, nombre, email, telefono, fecha_nacimiento, genero, direccion } = data;

    console.log('[PUT /api/pacientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[PUT /api/pacientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[PUT /api/pacientes] current_user_id asignado');

    // Iniciar transacción
    console.log('[PUT /api/pacientes] Iniciando transacción...');
    await conn.beginTransaction();

    try {
      // 1. Actualizar usuario
      console.log('[PUT /api/pacientes] Actualizando usuario...');
      const [userResult] = await conn.execute(`
        UPDATE usuarios
        SET nombre = ?, email = ?, telefono = ?
        WHERE user_id = ?
      `, [nombre, email, telefono, paciente_id]);
      console.log('[PUT /api/pacientes] Usuario actualizado:', userResult);

      // 2. Actualizar paciente
      console.log('[PUT /api/pacientes] Actualizando paciente...');
      const [pacienteResult] = await conn.execute(`
        UPDATE pacientes
        SET fecha_nacimiento = ?, genero = ?, direccion = ?
        WHERE paciente_id = ?
      `, [fecha_nacimiento, genero, direccion, paciente_id]);
      console.log('[PUT /api/pacientes] Paciente actualizado:', pacienteResult);

      // Confirmar transacción
      console.log('[PUT /api/pacientes] Confirmando transacción...');
      await conn.commit();
      console.log('[PUT /api/pacientes] Transacción confirmada');

      await conn.end();
      console.log('[PUT /api/pacientes] Conexión cerrada');

      return NextResponse.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
      // Revertir transacción en caso de error
      console.error('[PUT /api/pacientes] Error en la transacción:', error);
      await conn.rollback();
      console.log('[PUT /api/pacientes] Transacción revertida');
      throw error;
    }
  } catch (error) {
    console.error('[PUT /api/pacientes] Error:', error);
    console.error('[PUT /api/pacientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al actualizar paciente' }, { status: 500 });
  }
}

// DELETE - Eliminar un paciente
export async function DELETE(request) {
  console.log('[DELETE /api/pacientes] Iniciando petición...');
  try {
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');
    console.log('[DELETE /api/pacientes] ID del paciente:', pacienteId);

    if (!pacienteId) {
      console.log('[DELETE /api/pacientes] ID de paciente no proporcionado');
      return NextResponse.json({ error: 'ID de paciente requerido' }, { status: 400 });
    }

    console.log('[DELETE /api/pacientes] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[DELETE /api/pacientes] Conexión exitosa');

    // Asignar current_user_id para los triggers
    await conn.execute('SET @current_user_id = 1');
    console.log('[DELETE /api/pacientes] current_user_id asignado');

    // Verificar si el paciente tiene citas
    console.log('[DELETE /api/pacientes] Verificando citas del paciente...');
    const [citas] = await conn.execute(
      'SELECT COUNT(*) as count FROM citas WHERE paciente_id = ?',
      [pacienteId]
    );

    if (citas[0].count > 0) {
      console.log('[DELETE /api/pacientes] El paciente tiene citas registradas');
      await conn.end();
      return NextResponse.json({ 
        error: 'No se puede eliminar el paciente porque tiene citas registradas' 
      }, { status: 400 });
    }

    // Eliminar el paciente (esto también eliminará el usuario debido a la restricción de clave foránea)
    console.log('[DELETE /api/pacientes] Eliminando paciente...');
    await conn.execute('DELETE FROM pacientes WHERE paciente_id = ?', [pacienteId]);
    console.log('[DELETE /api/pacientes] Paciente eliminado');

    await conn.end();
    console.log('[DELETE /api/pacientes] Conexión cerrada');

    return NextResponse.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('[DELETE /api/pacientes] Error:', error);
    console.error('[DELETE /api/pacientes] Stack trace:', error.stack);
    return NextResponse.json({ error: 'Error al eliminar paciente' }, { status: 500 });
  }
} 