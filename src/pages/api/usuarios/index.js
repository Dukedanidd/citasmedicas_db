import pool from '@/lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const [rows] = await pool.query(`
          SELECT u.*, r.nombre as rol_nombre 
          FROM usuarios u 
          JOIN roles r ON u.role_id = r.role_id
        `);
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        res.status(500).json({ error: 'Error fetching usuarios' });
      }
      break;

    case 'POST':
      try {
        const { primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id } = req.body;

        // Basic validation
        if (!primer_nombre || !apellido_paterno || !email || !password || !role_id) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Attempting to insert user:', {
          primer_nombre,
          segundo_nombre,
          apellido_paterno,
          apellido_materno,
          email,
          role_id
        });

        const [result] = await pool.query(
          `INSERT INTO usuarios (
            primer_nombre, 
            segundo_nombre, 
            apellido_paterno, 
            apellido_materno, 
            email, 
            password, 
            role_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id]
        );

        console.log('Insert result:', result);

        res.status(201).json({ 
          id: result.insertId,
          message: 'Usuario created successfully' 
        });
      } catch (error) {
        console.error('Detailed error creating usuario:', error);
        res.status(500).json({ 
          error: 'Error creating usuario',
          details: error.message 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 