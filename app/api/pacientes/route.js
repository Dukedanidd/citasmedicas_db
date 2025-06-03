import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinica_db",
};

// GET - Obtener todos los pacientes o un paciente específico
export async function GET(request) {
  console.log("[GET /api/pacientes] Iniciando petición...");
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get("pacienteId");
    console.log("[GET /api/pacientes] ID del paciente:", pacienteId);

    console.log("[GET /api/pacientes] Conectando a la base de datos...");
    conn = await mysql.createConnection(dbConfig);
    console.log("[GET /api/pacientes] Conexión exitosa");

    // Asignar current_user_id para los triggers usando el ID del paciente
    await conn.execute("SET @current_user_id = 1", [pacienteId || null]);
    console.log("[GET /api/pacientes] current_user_id asignado:", pacienteId);

    if (pacienteId) {
      console.log("[GET /api/pacientes] Obteniendo paciente específico...");
      const [rows] = await conn.execute(
        `
        SELECT 
          p.*,
          u.primer_nombre,
          u.segundo_nombre,
          u.apellido_paterno,
          u.apellido_materno,
          u.email,
          m.especialidad as doctor_especialidad
        FROM pacientes p
        JOIN usuarios u ON p.paciente_id = u.user_id
        LEFT JOIN medicos m ON p.doctor_id = m.doctor_id
        WHERE p.paciente_id = ?
      `,
        [pacienteId],
      );
      console.log("[GET /api/pacientes] Resultados:", rows);

      if (!rows[0]) {
        console.log("[GET /api/pacientes] Paciente no encontrado");
        return NextResponse.json(
          { error: "Paciente no encontrado" },
          { status: 404 },
        );
      }

      return NextResponse.json(rows[0]);
    }

    console.log("[GET /api/pacientes] Obteniendo todos los pacientes...");
    const [rows] = await conn.execute(`
      SELECT 
        p.*,
        u.primer_nombre,
        u.segundo_nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.email,
        m.especialidad as doctor_especialidad
      FROM pacientes p
      JOIN usuarios u ON p.paciente_id = u.user_id
      LEFT JOIN medicos m ON p.doctor_id = m.doctor_id
    `);
    console.log("[GET /api/pacientes] Resultados:", rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/pacientes] Error:", error);
    console.error("[GET /api/pacientes] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al obtener pacientes" },
      { status: 500 },
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log("[GET /api/pacientes] Conexión cerrada");
    }
  }
}

// POST - Crear un nuevo paciente
export async function POST(request) {
  console.log("[POST /api/pacientes] Iniciando petición...");
  let conn;
  try {
    const data = await request.json();
    console.log("[POST /api/pacientes] Datos recibidos:", {
      ...data,
      password: "***",
    });

    const {
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      email,
      password,
      fecha_nacimiento,
      sexo,
      doctor_id,
    } = data;

    if (
      !primer_nombre ||
      !apellido_paterno ||
      !email ||
      !password ||
      !fecha_nacimiento ||
      !sexo ||
      !doctor_id
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    console.log("[POST /api/pacientes] Conectando a la base de datos...");
    conn = await mysql.createConnection(dbConfig);
    console.log("[POST /api/pacientes] Conexión exitosa");

    // Iniciar transacción
    await conn.beginTransaction();
    console.log("[POST /api/pacientes] Transacción iniciada");

    // Asignar current_user_id para los triggers
    const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = 1", [userId]);
    console.log("[POST /api/pacientes] current_user_id asignado");

    // Obtener el role_id para pacientes
    console.log("[POST /api/pacientes] Obteniendo role_id para pacientes...");
    const [roles] = await conn.execute(
      "SELECT role_id FROM roles WHERE nombre = ?",
      ["paciente"],
    );

    if (!roles[0]) {
      await conn.rollback();
      console.log("[POST /api/pacientes] No se encontró el rol de paciente");
      return NextResponse.json(
        { error: "No se encontró el rol de paciente en la base de datos" },
        { status: 500 },
      );
    }

    const role_id = roles[0].role_id;
    console.log("[POST /api/pacientes] Role_id obtenido:", role_id);

    // Verificar si el email ya existe
    console.log("[POST /api/pacientes] Verificando email...");
    const [existingUser] = await conn.execute(
      "SELECT user_id FROM usuarios WHERE email = ?",
      [email],
    );

    if (existingUser[0]) {
      await conn.rollback();
      console.log("[POST /api/pacientes] Email ya existe");
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 },
      );
    }

    // Verificar si el doctor existe
    console.log("[POST /api/pacientes] Verificando doctor...");
    const [doctor] = await conn.execute(
      "SELECT doctor_id FROM medicos WHERE doctor_id = ?",
      [doctor_id],
    );

    if (!doctor[0]) {
      await conn.rollback();
      console.log("[POST /api/pacientes] Doctor no encontrado");
      return NextResponse.json(
        { error: "El doctor especificado no existe" },
        { status: 400 },
      );
    }

    // Insertar usuario
    console.log("[POST /api/pacientes] Creando usuario...");
    const [userResult] = await conn.execute(
      `
      INSERT INTO usuarios (
        primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
        email, password, role_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        primer_nombre,
        segundo_nombre || null,
        apellido_paterno,
        apellido_materno || null,
        email,
        password,
        role_id,
      ],
    );

    const paciente_id = userResult.insertId;
    console.log("[POST /api/pacientes] Usuario creado con ID:", paciente_id);

    // Insertar paciente
    console.log("[POST /api/pacientes] Creando paciente...");
    await conn.execute(
      `
      INSERT INTO pacientes (paciente_id, fecha_nacimiento, sexo, doctor_id)
      VALUES (?, ?, ?, ?)
    `,
      [paciente_id, fecha_nacimiento, sexo, doctor_id],
    );

    await conn.commit();
    console.log("[POST /api/pacientes] Transacción completada");

    // Obtener los datos completos del paciente recién creado
    const [newPatientData] = await conn.execute(`
      SELECT 
        p.*,
        u.primer_nombre,
        u.segundo_nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.email,
        m.especialidad as doctor_especialidad
      FROM pacientes p
      JOIN usuarios u ON p.paciente_id = u.user_id
      LEFT JOIN medicos m ON p.doctor_id = m.doctor_id
      WHERE p.paciente_id = ?
    `, [paciente_id]);

    return NextResponse.json(newPatientData[0], { status: 201 });
  } catch (error) {
    console.error("[POST /api/pacientes] Error:", error);
    console.error("[POST /api/pacientes] Stack trace:", error.stack);
    if (conn) {
      await conn.rollback();
      console.log("[POST /api/pacientes] Transacción revertida");
    }
    return NextResponse.json(
      { error: "Error al crear paciente" },
      { status: 500 },
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log("[POST /api/pacientes] Conexión cerrada");
    }
  }
}

// PUT - Actualizar un paciente
export async function PUT(request) {
  console.log("[PUT /api/pacientes] Iniciando petición...");
  let conn;
  try {
    const data = await request.json();
    console.log("[PUT /api/pacientes] Datos recibidos:", data);

    const {
      paciente_id,
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      email,
      fecha_nacimiento,
      sexo,
      doctor_id,
    } = data;

    if (!paciente_id) {
      return NextResponse.json(
        { error: "ID de paciente requerido" },
        { status: 400 },
      );
    }

    console.log("[PUT /api/pacientes] Conectando a la base de datos...");
    conn = await mysql.createConnection(dbConfig);
    console.log("[PUT /api/pacientes] Conexión exitosa");

    // Iniciar transacción
    await conn.beginTransaction();
    console.log("[PUT /api/pacientes] Transacción iniciada");

    // Asignar current_user_id para los triggers
    //const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = 1");
    console.log("[PUT /api/pacientes] current_user_id asignado");

    // Verificar si el paciente existe
    console.log("[PUT /api/pacientes] Verificando paciente...");
    const [paciente] = await conn.execute(
      "SELECT paciente_id FROM pacientes WHERE paciente_id = ?",
      [paciente_id],
    );

    if (!paciente[0]) {
      await conn.rollback();
      console.log("[PUT /api/pacientes] Paciente no encontrado");
      return NextResponse.json(
        { error: "Paciente no encontrado" },
        { status: 404 },
      );
    }

    // Verificar si el doctor existe si se está actualizando
    if (doctor_id) {
      console.log("[PUT /api/pacientes] Verificando doctor...");
      const [doctor] = await conn.execute(
        "SELECT doctor_id FROM medicos WHERE doctor_id = ?",
        [doctor_id],
      );

      if (!doctor[0]) {
        await conn.rollback();
        console.log("[PUT /api/pacientes] Doctor no encontrado");
        return NextResponse.json(
          { error: "El doctor especificado no existe" },
          { status: 400 },
        );
      }
    }

    // Actualizar usuario
    console.log("[PUT /api/pacientes] Actualizando usuario...");
    await conn.execute(
      `
      UPDATE usuarios
      SET primer_nombre = ?,
          segundo_nombre = ?,
          apellido_paterno = ?,
          apellido_materno = ?,
          email = ?
      WHERE user_id = ?
    `,
      [
        primer_nombre,
        segundo_nombre || null,
        apellido_paterno,
        apellido_materno || null,
        email,
        paciente_id,
      ],
    );

    // Actualizar paciente
    console.log("[PUT /api/pacientes] Actualizando paciente...");
    await conn.execute(
      `
      UPDATE pacientes
      SET fecha_nacimiento = ?,
          sexo = ?,
          doctor_id = ?
      WHERE paciente_id = ?
    `,
      [fecha_nacimiento, sexo, doctor_id, paciente_id],
    );

    await conn.commit();
    console.log("[PUT /api/pacientes] Transacción completada");

    // Obtener los datos completos del paciente actualizado
    const [updatedPatientData] = await conn.execute(`
      SELECT 
        p.*,
        u.primer_nombre,
        u.segundo_nombre,
        u.apellido_paterno,
        u.apellido_materno,
        u.email,
        m.especialidad as doctor_especialidad
      FROM pacientes p
      JOIN usuarios u ON p.paciente_id = u.user_id
      LEFT JOIN medicos m ON p.doctor_id = m.doctor_id
      WHERE p.paciente_id = ?
    `, [paciente_id]);

    return NextResponse.json(updatedPatientData[0]);
  } catch (error) {
    console.error("[PUT /api/pacientes] Error:", error);
    console.error("[PUT /api/pacientes] Stack trace:", error.stack);
    if (conn) {
      await conn.rollback();
      console.log("[PUT /api/pacientes] Transacción revertida");
    }
    return NextResponse.json(
      { error: "Error al actualizar paciente" },
      { status: 500 },
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log("[PUT /api/pacientes] Conexión cerrada");
    }
  }
}

// DELETE - Eliminar un paciente
export async function DELETE(request) {
  console.log("[DELETE /api/pacientes] Iniciando petición...");
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get("pacienteId");
    console.log("[DELETE /api/pacientes] ID del paciente:", pacienteId);

    if (!pacienteId) {
      return NextResponse.json(
        { error: "Se requiere el ID del paciente" },
        { status: 400 },
      );
    }

    console.log("[DELETE /api/pacientes] Conectando a la base de datos...");
    conn = await mysql.createConnection(dbConfig);
    console.log("[DELETE /api/pacientes] Conexión exitosa");

    // Asignar current_user_id para los triggers
    //const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = 1");
    console.log("[DELETE /api/pacientes] current_user_id asignado");

    // Iniciar transacción
    await conn.beginTransaction();
    console.log("[DELETE /api/pacientes] Transacción iniciada");

    // Verificar si el paciente existe
    const [paciente] = await conn.execute(
      "SELECT paciente_id FROM pacientes WHERE paciente_id = ?",
      [pacienteId],
    );

    if (!paciente[0]) {
      await conn.rollback();
      console.log("[DELETE /api/pacientes] Paciente no encontrado");
      return NextResponse.json(
        { error: "Paciente no encontrado" },
        { status: 404 },
      );
    }

    // Eliminar registros relacionados en orden
    console.log("[DELETE /api/pacientes] Eliminando registros relacionados...");

    // 1. Eliminar alergias
    await conn.execute(
      "DELETE FROM alergias WHERE expediente_id IN (SELECT expediente_id FROM expedientes WHERE paciente_id = ?)",
      [pacienteId],
    );
    console.log("[DELETE /api/pacientes] Alergias eliminadas");

    // 2. Eliminar historial médico
    await conn.execute(
      "DELETE FROM historial_medico WHERE expediente_id IN (SELECT expediente_id FROM expedientes WHERE paciente_id = ?)",
      [pacienteId],
    );
    console.log("[DELETE /api/pacientes] Historial médico eliminado");

    // 3. Eliminar expedientes
    await conn.execute("DELETE FROM expedientes WHERE paciente_id = ?", [
      pacienteId,
    ]);
    console.log("[DELETE /api/pacientes] Expedientes eliminados");

    // 4. Eliminar citas
    await conn.execute("DELETE FROM citas WHERE paciente_id = ?", [pacienteId]);
    console.log("[DELETE /api/pacientes] Citas eliminadas");

    // 5. Eliminar el paciente
    await conn.execute("DELETE FROM pacientes WHERE paciente_id = ?", [
      pacienteId,
    ]);
    console.log("[DELETE /api/pacientes] Paciente eliminado");

    // 6. Eliminar el usuario asociado
    await conn.execute("DELETE FROM usuarios WHERE user_id = ?", [pacienteId]);
    console.log("[DELETE /api/pacientes] Usuario eliminado");

    await conn.commit();
    console.log("[DELETE /api/pacientes] Transacción completada");

    return NextResponse.json({
      message: "Paciente eliminado exitosamente",
    });
  } catch (error) {
    if (conn) {
      await conn.rollback();
      console.log("[DELETE /api/pacientes] Transacción revertida");
    }
    console.error("[DELETE /api/pacientes] Error:", error);
    console.error("[DELETE /api/pacientes] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al eliminar el paciente" },
      { status: 500 },
    );
  } finally {
    if (conn) {
      await conn.end();
      console.log("[DELETE /api/pacientes] Conexión cerrada");
    }
  }
}
