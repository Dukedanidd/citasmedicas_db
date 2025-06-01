import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db',
};

export async function GET(_req: Request, context: any) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'doctor_id es requerido' }, { status: 400 });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      'SELECT apunte_id, doctor_id, texto, fecha_hora FROM apuntes WHERE doctor_id = ? ORDER BY fecha_hora DESC',
      [id]
    );
    await conn.end();
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'Error al leer apuntes', details: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const { texto } = await req.json();
    if (!id || !texto) {
      return NextResponse.json({ error: 'doctor_id y texto son requeridos' }, { status: 400 });
    }
    const conn = await mysql.createConnection(dbConfig);
    const [result]: any = await conn.execute(
      'INSERT INTO apuntes (doctor_id, texto) VALUES (?, ?)',
      [id, texto]
    );
    await conn.end();
    return NextResponse.json({ message: 'Apunte agregado', apunte_id: result.insertId });
  } catch (err) {
    return NextResponse.json({ error: 'Error al agregar apunte', details: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const { apunte_id, texto } = await req.json();
    if (!apunte_id || !texto) {
      return NextResponse.json({ error: 'apunte_id y texto son requeridos' }, { status: 400 });
    }
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'UPDATE apuntes SET texto = ? WHERE apunte_id = ? AND doctor_id = ?',
      [texto, apunte_id, id]
    );
    await conn.end();
    return NextResponse.json({ message: 'Apunte actualizado' });
  } catch (err) {
    return NextResponse.json({ error: 'Error al actualizar apunte', details: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { id } = await context.params;
  try {
    const { apunte_id } = await req.json();
    if (!apunte_id) {
      return NextResponse.json({ error: 'apunte_id es requerido' }, { status: 400 });
    }
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'DELETE FROM apuntes WHERE apunte_id = ? AND doctor_id = ?',
      [apunte_id, id]
    );
    await conn.end();
    return NextResponse.json({ message: 'Apunte eliminado' });
  } catch (err) {
    return NextResponse.json({ error: 'Error al eliminar apunte', details: err.message }, { status: 500 });
  }
} 