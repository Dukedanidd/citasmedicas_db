import pool from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const [rows] = await pool.query(
                    `SELECT 
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
                     WHERE m.doctor_id = ?`,
                    [id]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Medico not found' });
                }

                res.status(200).json(rows[0]);
            } catch (error) {
                console.error('Error fetching medico:', error);
                res.status(500).json({ error: 'Error fetching medico' });
            }
            break;

        case 'PUT':
            try {
                const { especialidad, consultorio_id } = req.body;

                if (!especialidad || !consultorio_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const [result] = await pool.query(
                    `UPDATE medicos 
                     SET especialidad = ?, consultorio_id = ?
                     WHERE doctor_id = ?`,
                    [especialidad, consultorio_id, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Medico not found' });
                }

                res.status(200).json({ message: 'Medico updated successfully' });
            } catch (error) {
                console.error('Error updating medico:', error);
                res.status(500).json({ error: 'Error updating medico' });
            }
            break;

        case 'DELETE':
            try {
                // Primero verificamos si el médico tiene pacientes asignados
                const [pacientes] = await pool.query(
                    'SELECT COUNT(*) as count FROM pacientes WHERE doctor_id = ?',
                    [id]
                );

                if (pacientes[0].count > 0) {
                    return res.status(400).json({ 
                        error: 'Cannot delete medico because they have assigned patients' 
                    });
                }

                // Verificamos si tiene citas
                const [citas] = await pool.query(
                    'SELECT COUNT(*) as count FROM citas WHERE doctor_id = ?',
                    [id]
                );

                if (citas[0].count > 0) {
                    return res.status(400).json({ 
                        error: 'Cannot delete medico because they have registered appointments' 
                    });
                }

                // Si no tiene pacientes ni citas, procedemos a eliminar
                const [result] = await pool.query(
                    'DELETE FROM medicos WHERE doctor_id = ?',
                    [id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Medico not found' });
                }

                res.status(200).json({ message: 'Medico deleted successfully' });
            } catch (error) {
                console.error('Error deleting medico:', error);
                res.status(500).json({ error: 'Error deleting medico' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 