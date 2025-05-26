-- Insertar usuario administrador
INSERT INTO usuarios (email, password, rol) 
VALUES ('admin@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5Mm', 'admin');

-- Insertar doctor de prueba
INSERT INTO doctores (nombre, apellido, especialidad, email, password) 
VALUES ('Juan', 'Pérez', 'Cardiología', 'doctor@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5Mm');

-- Insertar paciente de prueba
INSERT INTO pacientes (nombre, apellido, email, password) 
VALUES ('María', 'García', 'paciente@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YW3qy5Mm');

-- Nota: La contraseña hasheada 'admin123' es la misma para todos los usuarios para facilitar las pruebas 