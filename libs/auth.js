import connection from '../database/connection';

console.log('[AUTH] Importando módulo de autenticación...');

export async function authenticateUser(email, password) {
    console.log('[AUTH] Iniciando autenticación para:', email);
    console.log('[AUTH] Estado de la conexión:', connection ? 'Conexión disponible' : 'Sin conexión');

    try {
        // Buscamos en la tabla usuarios
        console.log('[AUTH] Ejecutando consulta SQL...');
        const query = 'SELECT user_id as id, email, password, role_id FROM usuarios WHERE email = ? AND password = ?';
        console.log('[AUTH] Query SQL:', query);
        console.log('[AUTH] Parámetros:', { email, password: '***' });

        const [users] = await connection.promise().query(query, [email, password]);

        console.log('[AUTH] Resultado de la consulta:', users);
        console.log('[AUTH] Número de resultados:', users.length);

        if (!users || users.length === 0) {
            console.log('[AUTH] Credenciales incorrectas para:', email);
            return { error: 'Credenciales incorrectas' };
        }

        const user = users[0];
        console.log('[AUTH] Usuario encontrado:', { ...user, password: '***' });

        // Obtener el nombre del rol
        console.log('[AUTH] Obteniendo nombre del rol...');
        const [roles] = await connection.promise().query(
            'SELECT nombre FROM roles WHERE role_id = ?',
            [user.role_id]
        );
        
        if (!roles || roles.length === 0) {
            console.log('[AUTH] No se encontró el rol para el usuario');
            return { error: 'Error en la configuración del usuario' };
        }

        const rol = roles[0].nombre;
        console.log('[AUTH] Rol del usuario:', rol);

        // No enviar la contraseña al cliente
        const { password: _, ...userWithoutPassword } = user;

        console.log('[AUTH] Usuario autenticado:', userWithoutPassword);
        console.log('[AUTH] Rol del usuario:', rol);

        const redirectPath = getRedirectPath(rol);
        console.log('[AUTH] Ruta de redirección:', redirectPath);

        return {
            user: userWithoutPassword,
            redirectTo: redirectPath
        };
    } catch (error) {
        console.error('[AUTH] Error en la autenticación:', error);
        console.error('[AUTH] Stack trace:', error.stack);
        return { error: 'Error en la autenticación' };
    }
}

function getRedirectPath(rol) {
    console.log('[AUTH] Obteniendo ruta de redirección para rol:', rol);
    const path = (() => {
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
    })();
    console.log('[AUTH] Ruta seleccionada:', path);
    return path;
}
