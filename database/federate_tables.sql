-- Crear la base de datos federada
CREATE DATABASE IF NOT EXISTS clinica_federada;
USE clinica_federada;

-- Federar tabla usuarios
CREATE TABLE usuarios (
  user_id INT(11) NOT NULL AUTO_INCREMENT,
  primer_nombre VARCHAR(50) NOT NULL,
  segundo_nombre VARCHAR(50) DEFAULT NULL,
  apellido_paterno VARCHAR(50) NOT NULL,
  apellido_materno VARCHAR(50) DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT(11) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email),
  KEY role_id (role_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/usuarios';

-- Federar tabla roles
CREATE TABLE roles (
  role_id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(20) NOT NULL,
  PRIMARY KEY (role_id),
  UNIQUE KEY nombre (nombre)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/roles';

-- Federar tabla medicos
CREATE TABLE medicos (
  doctor_id INT(11) NOT NULL AUTO_INCREMENT,
  consultorio_id INT(11) DEFAULT NULL,
  especialidad VARCHAR(100) NOT NULL,
  PRIMARY KEY (doctor_id),
  KEY consultorio_id (consultorio_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/medicos';

-- Federar tabla pacientes
CREATE TABLE pacientes (
  paciente_id INT(11) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo ENUM('M','F','O') NOT NULL,
  doctor_id INT(11) NOT NULL,
  PRIMARY KEY (paciente_id),
  KEY doctor_id (doctor_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/pacientes';

-- Federar tabla citas
CREATE TABLE citas (
  cita_id INT(11) NOT NULL AUTO_INCREMENT,
  paciente_id INT(11) NOT NULL,
  doctor_id INT(11) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  estado_id INT(11) NOT NULL,
  notas TEXT DEFAULT NULL,
  creado_el DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cita_id),
  KEY paciente_id (paciente_id),
  KEY doctor_id (doctor_id),
  KEY estado_id (estado_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/citas';

-- Federar tabla estado_citas
CREATE TABLE estado_citas (
  estado_id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(20) NOT NULL,
  PRIMARY KEY (estado_id),
  UNIQUE KEY nombre (nombre)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/estado_citas';

-- Federar tabla expedientes
CREATE TABLE expedientes (
  expediente_id INT(11) NOT NULL AUTO_INCREMENT,
  paciente_id INT(11) NOT NULL,
  notas_generales TEXT DEFAULT NULL,
  PRIMARY KEY (expediente_id),
  UNIQUE KEY paciente_id (paciente_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/expedientes';

-- Federar tabla historial_medico
CREATE TABLE historial_medico (
  historial_id INT(11) NOT NULL AUTO_INCREMENT,
  expediente_id INT(11) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (historial_id),
  KEY expediente_id (expediente_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/historial_medico';

-- Federar tabla alergias
CREATE TABLE alergias (
  alergia_id INT(11) NOT NULL AUTO_INCREMENT,
  expediente_id INT(11) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  PRIMARY KEY (alergia_id),
  KEY expediente_id (expediente_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/alergias';

-- Federar tabla consultorios
CREATE TABLE consultorios (
  consultorio_id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  calle VARCHAR(100) DEFAULT NULL,
  numero_ext VARCHAR(20) DEFAULT NULL,
  colonia VARCHAR(100) DEFAULT NULL,
  ciudad VARCHAR(50) DEFAULT NULL,
  estado VARCHAR(50) DEFAULT NULL,
  codigo_postal VARCHAR(10) DEFAULT NULL,
  PRIMARY KEY (consultorio_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/consultorios';

-- Federar tabla agenda
CREATE TABLE agenda (
  agenda_id INT(11) NOT NULL AUTO_INCREMENT,
  doctor_id INT(11) NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  disponible TINYINT(1) NOT NULL,
  PRIMARY KEY (agenda_id),
  KEY doctor_id (doctor_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/agenda';

-- Federar tabla bitacora
CREATE TABLE bitacora (
  log_id INT(11) NOT NULL AUTO_INCREMENT,
  tipo ENUM('ingreso','actualizacion','delete') NOT NULL,
  tabla_afectada VARCHAR(50) NOT NULL,
  registro_id INT(11) NOT NULL,
  usuario_id INT(11) NOT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  detalle TEXT DEFAULT NULL,
  PRIMARY KEY (log_id),
  KEY usuario_id (usuario_id)
) ENGINE=FEDERATED
CONNECTION='mysql://clinica-admin:admin@10.235.77.27:3306/clinica_db/bitacora'; 