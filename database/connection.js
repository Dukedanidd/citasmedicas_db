import mysql from 'mysql2';

console.log('[CONNECTION] Inicializando conexión a la base de datos...');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'localhost',      // Host de la base de datos
    port: 3306,
    user: 'clinica-admin',          // Usuario de MySQL
    password: 'admin',          // Contraseña de MySQL
    database: 'clinica_db' // Nombre de la base de datos
});

console.log('[CONNECTION] Configuración de conexión creada');

// Probar la conexión
connection.connect((err) => {
    if (err) {
        console.error('[CONNECTION] Error al conectar a la base de datos:', err);
        console.error('[CONNECTION] Stack trace:', err.stack);
        return;
    }
    console.log('[CONNECTION] Conexión exitosa a la base de datos MySQL');
});

// Manejar errores de conexión
connection.on('error', (err) => {
    console.error('[CONNECTION] Error en la conexión:', err);
    console.error('[CONNECTION] Stack trace:', err.stack);
});

console.log('[CONNECTION] Exportando conexión...');

// Exportar la conexión para usarla en otros archivos
export default connection; 