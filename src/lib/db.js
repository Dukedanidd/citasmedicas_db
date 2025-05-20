import mysql from "mysql2/promise";

// Log environment variables (remove in production)
console.log('Database Config:', {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    // Don't log the password
});

if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    console.error('Missing required environment variables for database connection');
}

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize pool with @current_user_id
pool.on('connection', async (connection) => {
    try {
        await connection.query('SET @current_user_id = 1');
        console.log('Set @current_user_id for new connection');
    } catch (error) {
        console.error('Error setting @current_user_id:', error);
    }
});

export default pool;

export async function query({ query, values = []}) {
    // Connect to the database
    const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        // Set @current_user_id for this connection
        await dbconnection.query('SET @current_user_id = 1');
        
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw Error(error.message);
    }
}