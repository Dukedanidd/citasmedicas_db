import { NextResponse } from 'next/server';

export async function GET() {
  // Por ahora, simplemente permitiremos el acceso
  // Aquí deberías implementar la lógica real de verificación de sesión
  return NextResponse.json({
    authenticated: true,
    user: {
      rol: 'admin'
    }
  });
} 