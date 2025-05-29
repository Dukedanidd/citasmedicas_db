CREATE TABLE IF NOT EXISTS estados (
    estado_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar estados básicos
INSERT INTO estados (nombre, descripcion) VALUES
('Programada', 'Cita programada y pendiente'),
('Confirmada', 'Cita confirmada por el paciente'),
('Cancelada', 'Cita cancelada'),
('Completada', 'Cita realizada'),
('No asistió', 'Paciente no se presentó'); 