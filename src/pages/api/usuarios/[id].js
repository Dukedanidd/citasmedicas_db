import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const [rows] = await pool.query(
          `SELECT u.*, r.nombre as rol_nombre 
           FROM usuarios u 
           JOIN roles r ON u.role_id = r.role_id 
           WHERE u.user_id = ?`,
          [id]
        );

        if (rows.length === 0) {
          return res.status(404).json({ error: 'Usuario not found' });
        }

        res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Error fetching usuario:', error);
        res.status(500).json({ error: 'Error fetching usuario' });
      }
      break;

    case 'PUT':
      try {
        const { primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id } = req.body;

        // Basic validation
        if (!primer_nombre || !apellido_paterno || !email || !role_id) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.query(
          `UPDATE usuarios 
           SET primer_nombre = ?, 
               segundo_nombre = ?, 
               apellido_paterno = ?, 
               apellido_materno = ?, 
               email = ?, 
               password = COALESCE(?, password), 
               role_id = ?
           WHERE user_id = ?`,
          [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, password, role_id, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario not found' });
        }

        res.status(200).json({ message: 'Usuario updated successfully' });
      } catch (error) {
        console.error('Error updating usuario:', error);
        res.status(500).json({ error: 'Error updating usuario' });
      }
      break;

    case 'DELETE':
      try {
        const [result] = await pool.query(
          'DELETE FROM usuarios WHERE user_id = ?',
          [id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario not found' });
        }

        res.status(200).json({ message: 'Usuario deleted successfully' });
      } catch (error) {
        console.error('Error deleting usuario:', error);
        res.status(500).json({ error: 'Error deleting usuario' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 