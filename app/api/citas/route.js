import { NextResponse } from 'next/server';
import connection from '../../../database/connection';
import { promisify } from 'util';

// Convertir los métodos de callback a promesas
const query = promisify(connection.query).bind(connection);

// GET - Obtener todas las citas de un paciente
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const pacienteId = searchParams.get('pacienteId');

        if (!pacienteId) {
            return NextResponse.json({ error: 'ID de paciente requerido' }, { status: 400 });
        }

        const citas = await query(`
            SELECT c.*, m.nombre as doctor_nombre, m.especialidad
            FROM citas c
            JOIN medicos m ON c.doctor_id = m.doctor_id
            WHERE c.paciente_id = ?
            ORDER BY c.fecha, c.hora
        `, [pacienteId]);

        return NextResponse.json(citas);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        return NextResponse.json({ error: 'Error al obtener citas' }, { status: 500 });
    }
}

// POST - Crear una nueva cita
export async function POST(request) {
    try {
        const data = await request.json();
        const { paciente_id, doctor_id, fecha, hora, motivo } = data;

        // Verificar disponibilidad del doctor
        const disponibilidad = await query(`
            SELECT COUNT(*) as count
            FROM citas
            WHERE doctor_id = ? AND fecha = ? AND hora = ?
        `, [doctor_id, fecha, hora]);

        if (disponibilidad[0].count > 0) {
            return NextResponse.json({ error: 'El horario no está disponible' }, { status: 400 });
        }

        // Insertar la nueva cita
        const result = await query(`
            INSERT INTO citas (paciente_id, doctor_id, fecha, hora, motivo, estado_id)
            VALUES (?, ?, ?, ?, ?, 1)
        `, [paciente_id, doctor_id, fecha, hora, motivo]);

        return NextResponse.json({ 
            message: 'Cita creada exitosamente',
            cita_id: result.insertId 
        });
    } catch (error) {
        console.error('Error al crear cita:', error);
        return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
    }
}

// PUT - Actualizar una cita
export async function PUT(request) {
    try {
        const data = await request.json();
        const { cita_id, fecha, hora, motivo } = data;

        // Verificar disponibilidad del doctor
        const citaActual = await query('SELECT doctor_id FROM citas WHERE cita_id = ?', [cita_id]);
        if (!citaActual.length) {
            return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
        }

        const disponibilidad = await query(`
            SELECT COUNT(*) as count
            FROM citas
            WHERE doctor_id = ? AND fecha = ? AND hora = ? AND cita_id != ?
        `, [citaActual[0].doctor_id, fecha, hora, cita_id]);

        if (disponibilidad[0].count > 0) {
            return NextResponse.json({ error: 'El horario no está disponible' }, { status: 400 });
        }

        // Actualizar la cita
        await query(`
            UPDATE citas
            SET fecha = ?, hora = ?, motivo = ?
            WHERE cita_id = ?
        `, [fecha, hora, motivo, cita_id]);

        return NextResponse.json({ message: 'Cita actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        return NextResponse.json({ error: 'Error al actualizar cita' }, { status: 500 });
    }
}

// DELETE - Eliminar una cita
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const citaId = searchParams.get('citaId');

        if (!citaId) {
            return NextResponse.json({ error: 'ID de cita requerido' }, { status: 400 });
        }

        await query('DELETE FROM citas WHERE cita_id = ?', [citaId]);

        return NextResponse.json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        return NextResponse.json({ error: 'Error al eliminar cita' }, { status: 500 });
    }
} 