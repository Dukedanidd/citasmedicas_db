const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'localhost',      // Host de la base de datos
    port: 3306,
    user: 'clinica-admin',          // Usuario de MySQL
    password: 'admin',          // Contraseña de MySQL
    database: 'clinca_db' // Nombre de la base de datos
});

// Probar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Exportar la conexión para usarla en otros archivos
module.exports = connection; 