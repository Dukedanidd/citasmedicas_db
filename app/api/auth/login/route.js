import { authenticateUser } from '@/libs/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Correo y contraseña son requeridos' },
                { status: 400 }
            );
        }

        const result = await authenticateUser(email, password);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 401 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error en el login:', error);
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
} 