import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_db'
};

// POST /api/auth - Autenticación de usuario
export async function POST(request: Request) {
  console.log('[POST /api/auth] Iniciando petición de autenticación...');
  try {
    const body = await request.json();
    console.log('[POST /api/auth] Datos recibidos:', { ...body, password: '***' });

    const { email, password } = body;

    console.log('[POST /api/auth] Conectando a la base de datos...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('[POST /api/auth] Conexión exitosa');

    // Buscar usuario
    console.log('[POST /api/auth] Buscando usuario...');
    const [users] = await conn.execute(
      `SELECT u.*, r.role_name 
       FROM usuarios u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = ?`,
      [email]
    );
    console.log('[POST /api/auth] Usuario encontrado:', users[0] ? 'Sí' : 'No');

    if (!users[0]) {
      console.log('[POST /api/auth] Usuario no encontrado');
      await conn.end();
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verificar contraseña
    console.log('[POST /api/auth] Verificando contraseña...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('[POST /api/auth] Contraseña válida:', validPassword);

    if (!validPassword) {
      console.log('[POST /api/auth] Contraseña incorrecta');
      await conn.end();
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token
    console.log('[POST /api/auth] Generando token...');
    const token = jwt.sign(
      { 
        userId: user.user_id,
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    console.log('[POST /api/auth] Token generado');

    await conn.end();
    console.log('[POST /api/auth] Conexión cerrada');

    // Crear respuesta
    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role_name
      }
    });

    // Configurar cookie
    console.log('[POST /api/auth] Configurando cookie...');
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 horas
    });
    console.log('[POST /api/auth] Cookie configurada');

    return response;
  } catch (err) {
    console.error('[POST /api/auth] Error:', err);
    console.error('[POST /api/auth] Stack trace:', err.stack);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
} 