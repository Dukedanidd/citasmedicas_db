import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinica_db",
};

// GET - Obtener alergias
export async function GET(request) {
  console.log("[GET /api/alergias] Iniciando petición...");
  try {
    const { searchParams } = new URL(request.url);
    const alergiaId = searchParams.get("alergiaId");
    const expedienteId = searchParams.get("expedienteId");

    console.log("[GET /api/alergias] Parámetros:", { alergiaId, expedienteId });

    if (!alergiaId && !expedienteId) {
      return NextResponse.json(
        { error: "Se requiere ID de alergia o expediente" },
        { status: 400 },
      );
    }

    console.log("[GET /api/alergias] Conectando a la base de datos...");
    const conn = await mysql.createConnection(dbConfig);
    console.log("[GET /api/alergias] Conexión exitosa");

    // Asignar current_user_id para los triggers
    const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = ?", [userId]);
    console.log("[GET /api/alergias] current_user_id asignado");

    let query = `
      SELECT a.*, e.paciente_id
      FROM alergias a
      JOIN expedientes e ON a.expediente_id = e.expediente_id
      WHERE 1=1
    `;
    const params = [];

    if (alergiaId) {
      query += " AND a.alergia_id = ?";
      params.push(alergiaId);
    } else if (expedienteId) {
      query += " AND a.expediente_id = ?";
      params.push(expedienteId);
    }

    query += " ORDER BY a.alergia_id";

    console.log("[GET /api/alergias] Ejecutando consulta...");
    const [rows] = await conn.execute(query, params);
    console.log("[GET /api/alergias] Resultados:", rows);

    await conn.end();
    console.log("[GET /api/alergias] Conexión cerrada");

    if (alergiaId && !rows[0]) {
      return NextResponse.json(
        { error: "Alergia no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(alergiaId ? rows[0] : rows);
  } catch (error) {
    console.error("[GET /api/alergias] Error:", error);
    console.error("[GET /api/alergias] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al obtener alergias" },
      { status: 500 },
    );
  }
}

// POST - Crear nueva alergia
export async function POST(request) {
  console.log("[POST /api/alergias] Iniciando petición...");
  try {
    const data = await request.json();
    console.log("[POST /api/alergias] Datos recibidos:", data);

    const { expediente_id, descripcion } = data;

    if (!expediente_id || !descripcion) {
      return NextResponse.json(
        {
          error: "expediente_id y descripcion son requeridos",
        },
        { status: 400 },
      );
    }

    console.log("[POST /api/alergias] Conectando a la base de datos...");
    const conn = await mysql.createConnection(dbConfig);
    console.log("[POST /api/alergias] Conexión exitosa");

    // Asignar current_user_id para los triggers
    const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = ?", [userId]);
    console.log("[POST /api/alergias] current_user_id asignado");

    // Verificar que el expediente existe
    console.log("[POST /api/alergias] Verificando expediente...");
    const [expediente] = await conn.execute(
      "SELECT expediente_id FROM expedientes WHERE expediente_id = ?",
      [expediente_id],
    );

    if (!expediente[0]) {
      await conn.end();
      return NextResponse.json(
        { error: "Expediente no encontrado" },
        { status: 404 },
      );
    }

    // Insertar la nueva alergia
    console.log("[POST /api/alergias] Creando alergia...");
    const [result] = await conn.execute(
      `
      INSERT INTO alergias (expediente_id, descripcion)
      VALUES (?, ?)
    `,
      [expediente_id, descripcion],
    );

    await conn.end();
    console.log("[POST /api/alergias] Alergia creada exitosamente");

    return NextResponse.json(
      {
        message: "Alergia creada exitosamente",
        alergia_id: result.insertId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/alergias] Error:", error);
    console.error("[POST /api/alergias] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al crear alergia" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar alergia
export async function PUT(request) {
  console.log("[PUT /api/alergias] Iniciando petición...");
  try {
    const data = await request.json();
    console.log("[PUT /api/alergias] Datos recibidos:", data);

    const { alergia_id, descripcion } = data;

    if (!alergia_id) {
      return NextResponse.json(
        { error: "alergia_id es requerido" },
        { status: 400 },
      );
    }

    console.log("[PUT /api/alergias] Conectando a la base de datos...");
    const conn = await mysql.createConnection(dbConfig);
    console.log("[PUT /api/alergias] Conexión exitosa");

    // Asignar current_user_id para los triggers
    const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = ?", [userId]);
    console.log("[PUT /api/alergias] current_user_id asignado");

    // Verificar que la alergia existe
    console.log("[PUT /api/alergias] Verificando existencia de la alergia...");
    const [alergia] = await conn.execute(
      "SELECT alergia_id FROM alergias WHERE alergia_id = ?",
      [alergia_id],
    );

    if (!alergia[0]) {
      await conn.end();
      return NextResponse.json(
        { error: "Alergia no encontrada" },
        { status: 404 },
      );
    }

    // Actualizar la alergia
    console.log("[PUT /api/alergias] Actualizando alergia...");
    await conn.execute(
      `
      UPDATE alergias
      SET descripcion = ?
      WHERE alergia_id = ?
    `,
      [descripcion, alergia_id],
    );

    await conn.end();
    console.log("[PUT /api/alergias] Alergia actualizada exitosamente");

    return NextResponse.json({ message: "Alergia actualizada exitosamente" });
  } catch (error) {
    console.error("[PUT /api/alergias] Error:", error);
    console.error("[PUT /api/alergias] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al actualizar alergia" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar alergia
export async function DELETE(request) {
  console.log("[DELETE /api/alergias] Iniciando petición...");
  try {
    const { searchParams } = new URL(request.url);
    const alergiaId = searchParams.get("alergiaId");

    if (!alergiaId) {
      return NextResponse.json(
        { error: "ID de alergia requerido" },
        { status: 400 },
      );
    }

    console.log("[DELETE /api/alergias] Conectando a la base de datos...");
    const conn = await mysql.createConnection(dbConfig);
    console.log("[DELETE /api/alergias] Conexión exitosa");

    // Asignar current_user_id para los triggers
    const userId = request.headers.get("x-user-id");
    await conn.execute("SET @current_user_id = ?", [userId]);
    console.log("[DELETE /api/alergias] current_user_id asignado");

    // Verificar que la alergia existe
    console.log(
      "[DELETE /api/alergias] Verificando existencia de la alergia...",
    );
    const [alergia] = await conn.execute(
      "SELECT alergia_id FROM alergias WHERE alergia_id = ?",
      [alergiaId],
    );

    if (!alergia[0]) {
      await conn.end();
      return NextResponse.json(
        { error: "Alergia no encontrada" },
        { status: 404 },
      );
    }

    // Eliminar la alergia
    console.log("[DELETE /api/alergias] Eliminando alergia...");
    await conn.execute("DELETE FROM alergias WHERE alergia_id = ?", [
      alergiaId,
    ]);

    await conn.end();
    console.log("[DELETE /api/alergias] Alergia eliminada exitosamente");

    return NextResponse.json({ message: "Alergia eliminada exitosamente" });
  } catch (error) {
    console.error("[DELETE /api/alergias] Error:", error);
    console.error("[DELETE /api/alergias] Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Error al eliminar alergia" },
      { status: 500 },
    );
  }
}
