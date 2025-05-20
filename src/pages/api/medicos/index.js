import pool from '@/lib/db';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const [rows] = await pool.query(`
                    SELECT 
                        m.doctor_id,
                        m.especialidad,
                        m.consultorio_id,
                        u.primer_nombre,
                        u.segundo_nombre,
                        u.apellido_paterno,
                        u.apellido_materno,
                        u.email,
                        u.role_id,
                        c.nombre as nombre_consultorio,
                        c.calle,
                        c.numero_ext,
                        c.colonia,
                        c.ciudad,
                        c.estado,
                        c.codigo_postal,
                        r.nombre as rol_nombre
                    FROM medicos m
                    INNER JOIN usuarios u ON m.doctor_id = u.user_id
                    INNER JOIN consultorios c ON m.consultorio_id = c.consultorio_id
                    INNER JOIN roles r ON u.role_id = r.role_id
                    ORDER BY u.apellido_paterno, u.apellido_materno
                `);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error fetching medicos:', error);
                res.status(500).json({ error: 'Error fetching medicos' });
            }
            break;

        case 'POST':
            try {
                const { 
                    primer_nombre, 
                    segundo_nombre, 
                    apellido_paterno, 
                    apellido_materno, 
                    email, 
                    password,
                    especialidad,
                    consultorio_id
                } = req.body;

                // Validar campos requeridos
                if (!primer_nombre || !apellido_paterno || !email || !password || !especialidad || !consultorio_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Iniciar transacción
                await pool.query('START TRANSACTION');

                try {
                    // 1. Crear el usuario primero para obtener el ID
                    const [userResult] = await pool.query(
                        `INSERT INTO usuarios (
                            primer_nombre, segundo_nombre, apellido_paterno, 
                            apellido_materno, email, password, role_id
                        ) VALUES (?, ?, ?, ?, ?, ?, 2)`,
                        [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password]
                    );

                    const userId = userResult.insertId;

                    // 2. Crear el médico
                    await pool.query(
                        `INSERT INTO medicos (doctor_id, especialidad, consultorio_id)
                         VALUES (?, ?, ?)`,
                        [userId, especialidad, consultorio_id]
                    );

                    // Confirmar transacción
                    await pool.query('COMMIT');

                    res.status(201).json({ 
                        id: userId,
                        message: 'Medico created successfully' 
                    });
                } catch (error) {
                    // Si algo falla, revertir la transacción
                    await pool.query('ROLLBACK');
                    throw error;
                }
            } catch (error) {
                console.error('Error creating medico:', error);
                res.status(500).json({ 
                    error: 'Error creating medico',
                    details: error.message 
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 