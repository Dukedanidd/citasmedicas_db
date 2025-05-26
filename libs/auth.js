import { compare } from 'bcryptjs';
import connection from '../database/connection';

export async function authenticateUser(email, password) {
    try {
        // Primero buscamos en la tabla usuarios para administradores
        const [admins] = await connection.promise().query(
            'SELECT user_id as id, email, password, "admin" as rol FROM usuarios WHERE email = ? AND rol = "admin"',
            [email]
        );

        // Si no es admin, buscamos en la tabla doctores
        const [doctors] = await connection.promise().query(
            'SELECT doctor_id as id, email, password, "doctor" as rol FROM doctores WHERE email = ?',
            [email]
        );

        // Si no es doctor, buscamos en la tabla pacientes
        const [patients] = await connection.promise().query(
            'SELECT paciente_id as id, email, password, "paciente" as rol FROM pacientes WHERE email = ?',
            [email]
        );

        // Combinamos los resultados (solo uno debería existir)
        const user = admins[0] || doctors[0] || patients[0];

        if (!user) {
            return { error: 'Usuario no encontrado' };
        }

        // Verificar la contraseña
        const isValid = await compare(password, user.password);

        if (!isValid) {
            return { error: 'Contraseña incorrecta' };
        }

        // No enviar la contraseña al cliente
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            redirectTo: getRedirectPath(user.rol)
        };
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return { error: 'Error en la autenticación' };
    }
}

function getRedirectPath(rol) {
    switch (rol) {
        case 'admin':
            return '/dashboard/admin';
        case 'doctor':
            return '/dashboard/doctor';
        case 'paciente':
            return '/dashboard/paciente';
        default:
            return '/';
    }
}
