import { authenticateUser } from '../../../libs/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('[LOGIN] Iniciando proceso de login...');
    try {
        const { email, password } = await request.json();
        console.log('[LOGIN] Datos recibidos:', { email, password: '***' });

        if (!email || !password) {
            console.log('[LOGIN] Faltan credenciales');
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        console.log('[LOGIN] Autenticando usuario...');
        const result = await authenticateUser(email, password);
        console.log('[LOGIN] Resultado de autenticación:', result);

        if (result.error) {
            console.log('[LOGIN] Error de autenticación:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 401 }
            );
        }

        console.log('[LOGIN] Usuario autenticado exitosamente');
        return NextResponse.json(result);
    } catch (error) {
        console.error('[LOGIN] Error en el proceso de login:', error);
        console.error('[LOGIN] Stack trace:', error.stack);
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
} 