import connection from '../database/connection';

export async function authenticateUser(email, password) {
    console.log('[AUTH] Iniciando autenticación para:', email);

    try {
        // Buscamos en la tabla usuarios
        console.log('[AUTH] Ejecutando consulta SQL...');
        const [users] = await connection.promise().query(
            `SELECT u.user_id as id, u.email, u.password, r.nombre as rol 
             FROM usuarios u 
             JOIN roles r ON u.role_id = r.role_id 
             WHERE u.email = ? AND u.password = ?`,
            [email, password]
        );

        console.log('[AUTH] Resultado de la consulta:', users);

        if (!users || users.length === 0) {
            console.log('[AUTH] Credenciales incorrectas para:', email);
            return { error: 'Credenciales incorrectas' };
        }

        const user = users[0];

        // No enviar la contraseña al cliente
        const { password: _, ...userWithoutPassword } = user;

        console.log('[AUTH] Usuario autenticado:', userWithoutPassword);

        return {
            user: userWithoutPassword,
            redirectTo: getRedirectPath(user.rol)
        };
    } catch (error) {
        console.error('[AUTH] Error en la autenticación:', error);
        return { error: 'Error en la autenticación' };
    }
}

function getRedirectPath(rol) {
    switch (rol.toLowerCase()) {
        case 'admin':
            return '/dashboard/admin';
        case 'doctor':
            return '/dashboard/doctor';
        case 'paciente':
            return '/dashboard/patient';
        default:
            return '/';
    }
}
