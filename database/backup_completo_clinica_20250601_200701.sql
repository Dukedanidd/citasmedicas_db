-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: clinica_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agenda`
--

DROP TABLE IF EXISTS `agenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agenda` (
  `agenda_id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  PRIMARY KEY (`agenda_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `medicos` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` VALUES (1,1,'2024-03-20','09:00:00','17:00:00',1);
/*!40000 ALTER TABLE `agenda` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_agenda_ai
AFTER INSERT ON agenda
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','agenda',NEW.agenda_id,@current_user_id,
    CONCAT('Creada franja agenda id=',NEW.agenda_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_agenda_au
AFTER UPDATE ON agenda
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','agenda',NEW.agenda_id,@current_user_id,
    CONCAT('Actualizada franja agenda id=',NEW.agenda_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_agenda_ad
AFTER DELETE ON agenda
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','agenda',OLD.agenda_id,@current_user_id,
    CONCAT('Eliminada franja agenda id=',OLD.agenda_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `alergias`
--

DROP TABLE IF EXISTS `alergias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alergias` (
  `alergia_id` int(11) NOT NULL AUTO_INCREMENT,
  `expediente_id` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  PRIMARY KEY (`alergia_id`),
  KEY `expediente_id` (`expediente_id`),
  CONSTRAINT `alergias_ibfk_1` FOREIGN KEY (`expediente_id`) REFERENCES `expedientes` (`expediente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alergias`
--

LOCK TABLES `alergias` WRITE;
/*!40000 ALTER TABLE `alergias` DISABLE KEYS */;
INSERT INTO `alergias` VALUES (1,1,'Alergia severa a penicilina'),(2,1,'Alergia a penicilina'),(3,1,'Alergia a penicilina'),(4,1,'Alergia a penicilina'),(5,1,'Alergia a penicilina'),(6,1,'Alergia a penicilina'),(7,1,'Alergia a penicilina'),(8,1,'Alergia a penicilina'),(9,1,'Alergia a penicilina'),(10,1,'Alergia a penicilina');
/*!40000 ALTER TABLE `alergias` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_alergias_ai
AFTER INSERT ON alergias
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','alergias',NEW.alergia_id,@current_user_id,
    CONCAT('Creada alergia id=',NEW.alergia_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_alergias_au
AFTER UPDATE ON alergias
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','alergias',NEW.alergia_id,@current_user_id,
    CONCAT('Actualizada alergia id=',NEW.alergia_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_alergias_ad
AFTER DELETE ON alergias
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','alergias',OLD.alergia_id,@current_user_id,
    CONCAT('Eliminada alergia id=',OLD.alergia_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `apuntes`
--

DROP TABLE IF EXISTS `apuntes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apuntes` (
  `apunte_id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`apunte_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `apuntes_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `medicos` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntes`
--

LOCK TABLES `apuntes` WRITE;
/*!40000 ALTER TABLE `apuntes` DISABLE KEYS */;
INSERT INTO `apuntes` VALUES (1,28,'comprar 10 cajas paracetamol','2025-05-31 21:31:21'),(2,28,'programar vacaciones','2025-06-01 13:49:23');
/*!40000 ALTER TABLE `apuntes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bitacora` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('ingreso','actualizacion','delete') NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `registro_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `detalle` text DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
INSERT INTO `bitacora` VALUES (1,'ingreso','consultorios',1,1,'2025-05-18 17:57:41','Creado consultorio id=1 nombre=Buenavista'),(2,'ingreso','medicos',1,1,'2025-05-18 18:01:09','Creado médico id=1 especialidad=Medicina de Emergencia'),(3,'ingreso','usuarios',3,1,'2025-05-18 20:41:25','Creado usuario id=3 (Pablo Gomez)'),(4,'delete','usuarios',3,1,'2025-05-18 20:42:08','Eliminado usuario id=3'),(5,'ingreso','usuarios',2,1,'2025-05-18 20:42:46','Creado usuario id=2 (Pablo Gomez)'),(6,'ingreso','usuarios',6,1,'2025-05-18 20:54:21','Creado usuario id=6 (Gustavo Fernandez)'),(7,'actualizacion','usuarios',6,1,'2025-05-18 20:55:20','Actualizado usuario id=6'),(8,'delete','usuarios',6,1,'2025-05-18 20:56:00','Eliminado usuario id=6'),(9,'ingreso','usuarios',3,1,'2025-05-18 21:05:20','Creado usuario id=3 (Arturo Chavez)'),(10,'delete','usuarios',3,1,'2025-05-18 21:06:23','Eliminado usuario id=3'),(11,'ingreso','usuarios',4,1,'2025-05-19 15:14:32','Creado usuario id=4 (Juan Marquez)'),(12,'ingreso','usuarios',9,1,'2025-05-26 19:36:54','Creado usuario id=9 (Juan Villa)'),(17,'ingreso','medicos',2,1,'2025-05-27 01:47:08','Creado médico id=2 especialidad=Cardiología'),(18,'delete','medicos',2,1,'2025-05-27 01:49:51','Eliminado médico id=2'),(24,'ingreso','usuarios',21,1,'2025-05-27 02:06:47','Creado usuario id=21 (Juan Pérez)'),(25,'ingreso','medicos',21,1,'2025-05-27 02:06:47','Creado médico id=21 especialidad=General'),(26,'actualizacion','medicos',21,1,'2025-05-27 02:06:47','Actualizado médico id=21'),(27,'actualizacion','usuarios',1,1,'2025-05-27 02:18:53','Actualizado usuario id=1'),(28,'delete','medicos',21,1,'2025-05-27 02:19:01','Eliminado médico id=21'),(29,'delete','usuarios',21,1,'2025-05-27 02:19:01','Eliminado usuario id=21'),(30,'ingreso','usuarios',22,1,'2025-05-27 02:22:20','Creado usuario id=22 (Juan Pérez)'),(31,'ingreso','medicos',22,1,'2025-05-27 02:22:20','Creado médico id=22 especialidad=General'),(32,'actualizacion','medicos',22,1,'2025-05-27 02:22:20','Actualizado médico id=22'),(33,'actualizacion','usuarios',22,1,'2025-05-27 02:24:36','Actualizado usuario id=22'),(34,'actualizacion','usuarios',22,1,'2025-05-27 02:25:45','Actualizado usuario id=22'),(35,'actualizacion','usuarios',22,1,'2025-05-27 02:25:59','Actualizado usuario id=22'),(37,'actualizacion','usuarios',22,1,'2025-05-27 02:30:13','Actualizado usuario id=22'),(38,'actualizacion','medicos',22,1,'2025-05-27 02:30:13','Actualizado médico id=22'),(39,'ingreso','usuarios',26,1,'2025-05-27 15:16:50','Creado usuario id=26 (Rodrigo Fernandez)'),(40,'ingreso','pacientes',26,1,'2025-05-27 15:17:42','Creado paciente id=26'),(41,'ingreso','usuarios',27,1,'2025-05-27 15:25:41','Creado usuario id=27 (Gabriela Quintero)'),(42,'ingreso','pacientes',27,1,'2025-05-27 15:25:41','Creado paciente id=27'),(43,'actualizacion','usuarios',27,1,'2025-05-27 15:38:07','Actualizado usuario id=27'),(44,'actualizacion','pacientes',27,1,'2025-05-27 15:38:07','Actualizado paciente id=27'),(45,'delete','pacientes',27,1,'2025-05-27 15:38:50','Eliminado paciente id=27'),(46,'ingreso','usuarios',28,1,'2025-05-28 20:51:31','Creado usuario id=28 (Emilio Gutierrez)'),(47,'ingreso','medicos',28,1,'2025-05-28 20:51:31','Creado médico id=28 especialidad=General'),(48,'actualizacion','medicos',28,1,'2025-05-28 20:51:31','Actualizado médico id=28'),(49,'actualizacion','usuarios',28,1,'2025-05-28 21:05:18','Actualizado usuario id=28'),(50,'actualizacion','medicos',28,1,'2025-05-28 21:05:18','Actualizado médico id=28'),(51,'ingreso','usuarios',29,1,'2025-05-28 21:07:00','Creado usuario id=29 (MR TONOTO)'),(52,'ingreso','medicos',29,1,'2025-05-28 21:07:00','Creado médico id=29 especialidad=General'),(53,'actualizacion','medicos',29,1,'2025-05-28 21:07:00','Actualizado médico id=29'),(54,'delete','medicos',29,1,'2025-05-28 21:07:25','Eliminado médico id=29'),(55,'delete','usuarios',29,1,'2025-05-28 21:07:26','Eliminado usuario id=29'),(56,'ingreso','usuarios',30,1,'2025-05-28 21:08:06','Creado usuario id=30 (María López)'),(57,'ingreso','pacientes',30,1,'2025-05-28 21:08:06','Creado paciente id=30'),(58,'actualizacion','usuarios',1,1,'2025-05-28 21:09:25','Actualizado usuario id=1'),(59,'delete','pacientes',30,1,'2025-05-28 21:12:19','Eliminado paciente id=30'),(60,'actualizacion','usuarios',1,1,'2025-05-28 21:16:54','Actualizado usuario id=1'),(61,'ingreso','expedientes',1,1,'2025-05-28 22:36:04','Creado expediente id=1'),(62,'actualizacion','expedientes',1,1,'2025-05-28 22:36:04','Actualizado expediente id=1'),(63,'ingreso','alergias',1,1,'2025-05-28 22:36:05','Creada alergia id=1'),(64,'actualizacion','alergias',1,1,'2025-05-28 22:36:05','Actualizada alergia id=1'),(65,'actualizacion','usuarios',1,1,'2025-05-28 22:36:07','Actualizado usuario id=1'),(66,'actualizacion','medicos',1,1,'2025-05-28 22:36:07','Actualizado médico id=1'),(67,'actualizacion','usuarios',2,1,'2025-05-28 22:48:42','Actualizado usuario id=2'),(68,'ingreso','estado_citas',11,1,'2025-05-28 23:09:23','Creado estado_citas id=11'),(69,'ingreso','estado_citas',12,1,'2025-05-28 23:09:23','Creado estado_citas id=12'),(70,'ingreso','estado_citas',13,1,'2025-05-28 23:09:23','Creado estado_citas id=13'),(71,'ingreso','estado_citas',14,1,'2025-05-28 23:09:23','Creado estado_citas id=14'),(72,'ingreso','estado_citas',15,1,'2025-05-28 23:09:23','Creado estado_citas id=15'),(73,'actualizacion','usuarios',1,1,'2025-05-28 23:13:06','Actualizado usuario id=1'),(74,'actualizacion','medicos',1,1,'2025-05-28 23:13:06','Actualizado médico id=1'),(75,'actualizacion','usuarios',26,1,'2025-05-28 23:13:06','Actualizado usuario id=26'),(76,'actualizacion','pacientes',26,1,'2025-05-28 23:13:06','Actualizado paciente id=26'),(77,'actualizacion','expedientes',1,1,'2025-05-28 23:13:07','Actualizado expediente id=1'),(78,'ingreso','alergias',2,1,'2025-05-28 23:13:07','Creada alergia id=2'),(79,'actualizacion','alergias',1,1,'2025-05-28 23:13:08','Actualizada alergia id=1'),(80,'delete','estado_citas',11,1,'2025-05-28 23:33:25','Eliminado estado_citas id=11'),(81,'delete','estado_citas',12,1,'2025-05-28 23:33:25','Eliminado estado_citas id=12'),(82,'delete','estado_citas',13,1,'2025-05-28 23:33:25','Eliminado estado_citas id=13'),(83,'delete','estado_citas',14,1,'2025-05-28 23:33:25','Eliminado estado_citas id=14'),(84,'delete','estado_citas',15,1,'2025-05-28 23:33:25','Eliminado estado_citas id=15'),(85,'ingreso','estado_citas',1,1,'2025-05-28 23:33:48','Creado estado_citas id=1'),(86,'ingreso','estado_citas',2,1,'2025-05-28 23:33:48','Creado estado_citas id=2'),(87,'ingreso','estado_citas',3,1,'2025-05-28 23:33:48','Creado estado_citas id=3'),(88,'ingreso','estado_citas',4,1,'2025-05-28 23:33:48','Creado estado_citas id=4'),(89,'ingreso','estado_citas',5,1,'2025-05-28 23:33:48','Creado estado_citas id=5'),(90,'actualizacion','usuarios',1,1,'2025-05-28 23:36:41','Actualizado usuario id=1'),(91,'actualizacion','medicos',1,1,'2025-05-28 23:36:41','Actualizado médico id=1'),(92,'actualizacion','usuarios',26,1,'2025-05-28 23:36:41','Actualizado usuario id=26'),(93,'actualizacion','pacientes',26,1,'2025-05-28 23:36:41','Actualizado paciente id=26'),(94,'actualizacion','expedientes',1,1,'2025-05-28 23:36:42','Actualizado expediente id=1'),(95,'ingreso','historial_medico',1,1,'2025-05-28 23:36:42','Creado historial id=1'),(96,'actualizacion','historial_medico',1,1,'2025-05-28 23:36:42','Actualizado historial id=1'),(97,'ingreso','alergias',3,1,'2025-05-28 23:36:43','Creada alergia id=3'),(98,'actualizacion','alergias',1,1,'2025-05-28 23:36:43','Actualizada alergia id=1'),(99,'ingreso','citas',2,1,'2025-05-28 23:36:43','Creada cita id=2 paciente=26 doctor=1'),(100,'actualizacion','usuarios',1,1,'2025-05-28 23:43:31','Actualizado usuario id=1'),(101,'actualizacion','medicos',1,1,'2025-05-28 23:43:31','Actualizado médico id=1'),(102,'actualizacion','usuarios',26,1,'2025-05-28 23:43:31','Actualizado usuario id=26'),(103,'actualizacion','pacientes',26,1,'2025-05-28 23:43:31','Actualizado paciente id=26'),(104,'actualizacion','expedientes',1,1,'2025-05-28 23:43:32','Actualizado expediente id=1'),(105,'ingreso','historial_medico',2,1,'2025-05-28 23:43:32','Creado historial id=2'),(106,'actualizacion','historial_medico',1,1,'2025-05-28 23:43:32','Actualizado historial id=1'),(107,'ingreso','alergias',4,1,'2025-05-28 23:43:32','Creada alergia id=4'),(108,'actualizacion','alergias',1,1,'2025-05-28 23:43:32','Actualizada alergia id=1'),(109,'ingreso','pacientes',27,1,'2025-05-29 00:04:38','Creado paciente id=27'),(110,'ingreso','expedientes',8,1,'2025-05-29 00:05:29','Creado expediente id=8'),(111,'actualizacion','usuarios',1,1,'2025-05-29 00:09:33','Actualizado usuario id=1'),(112,'actualizacion','medicos',1,1,'2025-05-29 00:09:33','Actualizado médico id=1'),(113,'actualizacion','usuarios',26,1,'2025-05-29 00:09:34','Actualizado usuario id=26'),(114,'actualizacion','pacientes',26,1,'2025-05-29 00:09:34','Actualizado paciente id=26'),(115,'actualizacion','expedientes',1,1,'2025-05-29 00:09:34','Actualizado expediente id=1'),(116,'ingreso','historial_medico',3,1,'2025-05-29 00:09:34','Creado historial id=3'),(117,'actualizacion','historial_medico',1,1,'2025-05-29 00:09:34','Actualizado historial id=1'),(118,'ingreso','alergias',5,1,'2025-05-29 00:09:35','Creada alergia id=5'),(119,'actualizacion','alergias',1,1,'2025-05-29 00:09:35','Actualizada alergia id=1'),(120,'ingreso','agenda',1,1,'2025-05-29 00:13:31','Creada franja agenda id=1'),(121,'actualizacion','usuarios',1,1,'2025-05-29 00:16:25','Actualizado usuario id=1'),(122,'actualizacion','medicos',1,1,'2025-05-29 00:16:25','Actualizado médico id=1'),(123,'actualizacion','usuarios',26,1,'2025-05-29 00:16:26','Actualizado usuario id=26'),(124,'actualizacion','pacientes',26,1,'2025-05-29 00:16:26','Actualizado paciente id=26'),(125,'actualizacion','expedientes',1,1,'2025-05-29 00:16:26','Actualizado expediente id=1'),(126,'ingreso','historial_medico',4,1,'2025-05-29 00:16:27','Creado historial id=4'),(127,'actualizacion','historial_medico',1,1,'2025-05-29 00:16:27','Actualizado historial id=1'),(128,'ingreso','alergias',6,1,'2025-05-29 00:16:28','Creada alergia id=6'),(129,'actualizacion','alergias',1,1,'2025-05-29 00:16:28','Actualizada alergia id=1'),(130,'actualizacion','usuarios',1,1,'2025-05-29 00:24:27','Actualizado usuario id=1'),(131,'actualizacion','medicos',1,1,'2025-05-29 00:24:27','Actualizado médico id=1'),(132,'actualizacion','usuarios',26,1,'2025-05-29 00:24:28','Actualizado usuario id=26'),(133,'actualizacion','pacientes',26,1,'2025-05-29 00:24:28','Actualizado paciente id=26'),(134,'actualizacion','expedientes',1,1,'2025-05-29 00:24:28','Actualizado expediente id=1'),(135,'ingreso','historial_medico',5,1,'2025-05-29 00:24:28','Creado historial id=5'),(136,'actualizacion','historial_medico',1,1,'2025-05-29 00:24:28','Actualizado historial id=1'),(137,'ingreso','alergias',7,1,'2025-05-29 00:24:28','Creada alergia id=7'),(138,'actualizacion','alergias',1,1,'2025-05-29 00:24:29','Actualizada alergia id=1'),(139,'ingreso','citas',3,1,'2025-05-29 00:24:29','Creada cita id=3 paciente=26 doctor=1'),(140,'ingreso','pacientes',30,1,'2025-05-29 00:30:29','Creado paciente id=30'),(141,'actualizacion','usuarios',1,1,'2025-05-29 00:30:57','Actualizado usuario id=1'),(142,'actualizacion','medicos',1,1,'2025-05-29 00:30:57','Actualizado médico id=1'),(143,'actualizacion','usuarios',26,1,'2025-05-29 00:30:58','Actualizado usuario id=26'),(144,'actualizacion','pacientes',26,1,'2025-05-29 00:30:58','Actualizado paciente id=26'),(145,'ingreso','expedientes',10,1,'2025-05-29 00:30:58','Creado expediente id=10'),(146,'actualizacion','expedientes',1,1,'2025-05-29 00:30:58','Actualizado expediente id=1'),(147,'ingreso','historial_medico',6,1,'2025-05-29 00:30:58','Creado historial id=6'),(148,'actualizacion','historial_medico',1,1,'2025-05-29 00:30:59','Actualizado historial id=1'),(149,'ingreso','alergias',8,1,'2025-05-29 00:30:59','Creada alergia id=8'),(150,'actualizacion','alergias',1,1,'2025-05-29 00:30:59','Actualizada alergia id=1'),(151,'actualizacion','usuarios',1,1,'2025-05-29 00:44:17','Actualizado usuario id=1'),(152,'actualizacion','medicos',1,1,'2025-05-29 00:44:17','Actualizado médico id=1'),(153,'actualizacion','usuarios',26,1,'2025-05-29 00:44:17','Actualizado usuario id=26'),(154,'actualizacion','pacientes',26,1,'2025-05-29 00:44:17','Actualizado paciente id=26'),(155,'actualizacion','expedientes',1,1,'2025-05-29 00:44:18','Actualizado expediente id=1'),(156,'ingreso','historial_medico',7,1,'2025-05-29 00:44:18','Creado historial id=7'),(157,'actualizacion','historial_medico',1,1,'2025-05-29 00:44:18','Actualizado historial id=1'),(158,'ingreso','alergias',9,1,'2025-05-29 00:44:18','Creada alergia id=9'),(159,'actualizacion','alergias',1,1,'2025-05-29 00:44:18','Actualizada alergia id=1'),(160,'ingreso','citas',4,1,'2025-05-29 00:44:18','Creada cita id=4 paciente=26 doctor=1'),(161,'actualizacion','citas',3,1,'2025-05-29 00:44:19','Actualizada cita id=3 estado=2'),(162,'actualizacion','usuarios',1,1,'2025-05-29 00:47:16','Actualizado usuario id=1'),(163,'actualizacion','medicos',1,1,'2025-05-29 00:47:16','Actualizado médico id=1'),(164,'actualizacion','usuarios',26,1,'2025-05-29 00:47:17','Actualizado usuario id=26'),(165,'actualizacion','pacientes',26,1,'2025-05-29 00:47:17','Actualizado paciente id=26'),(166,'actualizacion','expedientes',1,1,'2025-05-29 00:47:17','Actualizado expediente id=1'),(167,'ingreso','historial_medico',8,1,'2025-05-29 00:47:17','Creado historial id=8'),(168,'actualizacion','historial_medico',1,1,'2025-05-29 00:47:17','Actualizado historial id=1'),(169,'ingreso','alergias',10,1,'2025-05-29 00:47:18','Creada alergia id=10'),(170,'actualizacion','alergias',1,1,'2025-05-29 00:47:18','Actualizada alergia id=1'),(171,'ingreso','citas',5,1,'2025-05-29 00:47:18','Creada cita id=5 paciente=26 doctor=1'),(172,'actualizacion','citas',3,1,'2025-05-29 00:47:19','Actualizada cita id=3 estado=2'),(173,'ingreso','usuarios',31,1,'2025-05-29 01:00:28','Creado usuario id=31 (Ana González)'),(174,'ingreso','usuarios',32,1,'2025-05-29 01:00:28','Creado usuario id=32 (Carlos Martínez)'),(175,'ingreso','usuarios',33,1,'2025-05-29 01:00:28','Creado usuario id=33 (Laura Sánchez)'),(176,'ingreso','usuarios',34,1,'2025-05-29 01:00:28','Creado usuario id=34 (Miguel Ramírez)'),(177,'ingreso','usuarios',35,1,'2025-05-29 01:00:28','Creado usuario id=35 (Patricia Díaz)'),(178,'ingreso','pacientes',31,1,'2025-05-29 01:00:36','Creado paciente id=31'),(179,'ingreso','pacientes',32,1,'2025-05-29 01:00:36','Creado paciente id=32'),(180,'ingreso','pacientes',33,1,'2025-05-29 01:00:36','Creado paciente id=33'),(181,'ingreso','pacientes',34,1,'2025-05-29 01:00:36','Creado paciente id=34'),(182,'ingreso','pacientes',35,1,'2025-05-29 01:00:36','Creado paciente id=35'),(184,'ingreso','citas',9,1,'2025-05-29 01:01:54','Creada cita id=9 paciente=31 doctor=1'),(185,'ingreso','citas',10,1,'2025-05-29 01:01:54','Creada cita id=10 paciente=32 doctor=1'),(186,'ingreso','citas',11,1,'2025-05-29 01:01:54','Creada cita id=11 paciente=33 doctor=1'),(187,'actualizacion','usuarios',26,1,'2025-05-29 12:29:46','Actualizado usuario id=26'),(188,'actualizacion','pacientes',26,1,'2025-05-29 12:29:46','Actualizado paciente id=26'),(189,'delete','expedientes',10,1,'2025-05-29 12:40:08','Eliminado expediente id=10'),(190,'delete','pacientes',30,1,'2025-05-29 12:40:08','Eliminado paciente id=30'),(191,'delete','usuarios',30,1,'2025-05-29 12:40:08','Eliminado usuario id=30'),(197,'actualizacion','usuarios',22,1,'2025-05-29 13:21:36','Actualizado usuario id=22'),(198,'actualizacion','medicos',22,1,'2025-05-29 13:21:36','Actualizado médico id=22'),(199,'actualizacion','usuarios',22,1,'2025-05-29 13:24:46','Actualizado usuario id=22'),(200,'actualizacion','medicos',22,1,'2025-05-29 13:24:46','Actualizado médico id=22'),(201,'actualizacion','usuarios',22,1,'2025-05-31 19:03:25','Actualizado usuario id=22'),(202,'actualizacion','medicos',22,1,'2025-05-31 19:03:25','Actualizado médico id=22'),(207,'ingreso','usuarios',42,1,'2025-05-31 20:04:53','Creado usuario id=42 (María González)'),(208,'ingreso','usuarios',43,1,'2025-05-31 20:04:53','Creado usuario id=43 (José Martínez)'),(209,'ingreso','usuarios',44,1,'2025-05-31 20:04:53','Creado usuario id=44 (Advotya Romanovna)'),(210,'ingreso','pacientes',42,1,'2025-05-31 20:08:51','Creado paciente id=42'),(211,'ingreso','pacientes',43,1,'2025-05-31 20:08:51','Creado paciente id=43'),(212,'ingreso','pacientes',44,1,'2025-05-31 20:08:51','Creado paciente id=44'),(213,'ingreso','citas',12,1,'2025-05-31 20:33:12','Creada cita id=12 paciente=42 doctor=28'),(214,'ingreso','citas',13,1,'2025-05-31 20:33:12','Creada cita id=13 paciente=43 doctor=28'),(215,'ingreso','citas',14,1,'2025-05-31 20:33:12','Creada cita id=14 paciente=44 doctor=28'),(216,'ingreso','citas',15,1,'2025-05-31 20:39:11','Creada cita id=15 paciente=42 doctor=28'),(217,'ingreso','citas',16,1,'2025-05-31 20:39:11','Creada cita id=16 paciente=43 doctor=28'),(218,'ingreso','citas',17,1,'2025-05-31 20:39:11','Creada cita id=17 paciente=44 doctor=28'),(219,'ingreso','usuarios',45,1,'2025-06-01 00:05:57','Creado usuario id=45 (Juan Bodoque)'),(220,'ingreso','pacientes',45,1,'2025-06-01 00:05:57','Creado paciente id=45'),(221,'ingreso','citas',18,1,'2025-06-01 01:09:02','Creada cita id=18 paciente=45 doctor=28'),(222,'ingreso','citas',19,1,'2025-06-01 13:09:45','Creada cita id=19 paciente=44 doctor=28'),(223,'ingreso','citas',20,1,'2025-06-01 13:13:30','Creada cita id=20 paciente=45 doctor=28'),(224,'actualizacion','citas',19,1,'2025-06-01 13:21:12','Actualizada cita id=19 estado=1'),(225,'actualizacion','citas',15,1,'2025-06-01 13:27:08','Actualizada cita id=15 estado=2'),(226,'actualizacion','citas',16,1,'2025-06-01 13:27:37','Actualizada cita id=16 estado=1'),(227,'actualizacion','citas',16,1,'2025-06-01 13:27:55','Actualizada cita id=16 estado=1'),(228,'actualizacion','citas',16,1,'2025-06-01 13:27:57','Actualizada cita id=16 estado=2'),(229,'actualizacion','citas',18,1,'2025-06-01 13:29:36','Actualizada cita id=18 estado=3'),(230,'ingreso','usuarios',46,1,'2025-06-01 13:43:57','Creado usuario id=46 (Carlos Lechuga)'),(231,'ingreso','pacientes',46,1,'2025-06-01 13:43:57','Creado paciente id=46'),(232,'ingreso','usuarios',47,1,'2025-06-01 13:45:58','Creado usuario id=47 (Julio Ospina)'),(233,'ingreso','pacientes',47,1,'2025-06-01 13:45:58','Creado paciente id=47'),(234,'ingreso','expedientes',11,1,'2025-06-01 14:07:25','Creado expediente id=11'),(235,'ingreso','historial_medico',9,1,'2025-06-01 14:07:32','Creado historial id=9'),(236,'ingreso','historial_medico',10,1,'2025-06-01 14:07:32','Creado historial id=10'),(237,'ingreso','historial_medico',11,1,'2025-06-01 14:07:32','Creado historial id=11'),(238,'ingreso','historial_medico',12,1,'2025-06-01 14:20:56','Creado historial id=12'),(239,'ingreso','historial_medico',13,1,'2025-06-01 14:20:56','Creado historial id=13'),(240,'ingreso','historial_medico',14,1,'2025-06-01 14:20:56','Creado historial id=14'),(241,'actualizacion','citas',17,1,'2025-06-01 18:09:31','Actualizada cita id=17 estado=2'),(242,'actualizacion','citas',15,1,'2025-06-01 18:09:41','Actualizada cita id=15 estado=4'),(243,'actualizacion','citas',17,1,'2025-06-01 18:09:48','Actualizada cita id=17 estado=4'),(244,'actualizacion','expedientes',11,1,'2025-06-01 18:46:37','Actualizado expediente id=11'),(245,'ingreso','citas',21,1,'2025-06-01 19:14:46','Creada cita id=21 paciente=44 doctor=28'),(246,'actualizacion','citas',21,1,'2025-06-01 19:14:54','Actualizada cita id=21 estado=4'),(247,'ingreso','citas',22,1,'2025-06-01 19:19:25','Creada cita id=22 paciente=44 doctor=28'),(248,'ingreso','citas',23,1,'2025-06-01 19:26:12','Creada cita id=23 paciente=44 doctor=28'),(249,'delete','citas',23,1,'2025-06-01 19:50:47','Eliminada cita id=23'),(250,'ingreso','citas',24,1,'2025-06-01 19:53:26','Creada cita id=24 paciente=44 doctor=28'),(251,'delete','citas',24,1,'2025-06-01 19:55:43','Eliminada cita id=24'),(252,'ingreso','citas',25,1,'2025-06-01 19:57:31','Creada cita id=25 paciente=44 doctor=28');
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `citas` (
  `cita_id` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado_id` int(11) NOT NULL,
  `notas` text DEFAULT NULL,
  `creado_el` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`cita_id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`paciente_id`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `medicos` (`doctor_id`),
  CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estado_citas` (`estado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (2,26,1,'2024-03-20 10:00:00',1,'Consulta de rutina','2025-05-28 23:36:43'),(3,26,1,'2024-03-20 14:00:00',2,'Consulta de seguimiento','2025-05-29 00:24:29'),(4,26,1,'2024-03-20 23:00:00',1,'Consulta de rutina','2025-05-29 00:44:18'),(5,26,1,'2024-03-20 12:00:00',1,'Consulta de rutina','2025-05-29 00:47:18'),(9,31,1,'2024-03-22 09:00:00',1,'Segunda consulta','2025-05-29 01:01:54'),(10,32,1,'2024-03-22 10:00:00',1,'Control de alergias','2025-05-29 01:01:54'),(11,33,1,'2024-03-22 11:00:00',1,'Revisión de tratamiento','2025-05-29 01:01:54'),(12,42,28,'2024-04-01 09:00:00',1,'Primera consulta','2025-05-31 20:33:12'),(13,43,28,'2024-04-01 10:00:00',1,'Control rutinario','2025-05-31 20:33:12'),(14,44,28,'2024-04-01 11:00:00',1,'Revisión de tratamiento','2025-05-31 20:33:12'),(15,42,28,'2025-06-01 15:00:00',4,'Primera consulta','2025-05-31 20:39:11'),(16,43,28,'2025-06-10 16:00:00',2,'Control rutinario + medicamentos','2025-05-31 20:39:11'),(17,44,28,'2025-06-01 11:00:00',4,'Revisión de tratamiento','2025-05-31 20:39:11'),(18,45,28,'2025-06-05 08:50:00',3,'El paciente debe traer muestra de sangre','2025-06-01 01:09:02'),(19,44,28,'2025-06-06 09:00:00',1,'Paciente debe venir con familiares','2025-06-01 13:09:45'),(20,45,28,'2025-06-09 10:00:00',1,'Revisión de rutina','2025-06-01 13:13:30'),(21,44,28,'2025-06-02 10:00:00',4,'Paciente debe traer cartilla de vacunación','2025-06-01 19:14:46'),(22,44,28,'2025-05-29 10:00:00',1,'Paciente debe traer registro de presión arterial','2025-06-01 19:19:25'),(25,44,28,'2025-06-13 11:00:00',1,'Seguimiento de operación','2025-06-01 19:57:31');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_citas_ai
AFTER INSERT ON citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','citas',NEW.cita_id,@current_user_id,
    CONCAT('Creada cita id=',NEW.cita_id,' paciente=',NEW.paciente_id,' doctor=',NEW.doctor_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_citas_au
AFTER UPDATE ON citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','citas',NEW.cita_id,@current_user_id,
    CONCAT('Actualizada cita id=',NEW.cita_id,' estado=',NEW.estado_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_citas_ad
AFTER DELETE ON citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','citas',OLD.cita_id,@current_user_id,
    CONCAT('Eliminada cita id=',OLD.cita_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `consultorios`
--

DROP TABLE IF EXISTS `consultorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consultorios` (
  `consultorio_id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `calle` varchar(100) DEFAULT NULL,
  `numero_ext` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `ciudad` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`consultorio_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultorios`
--

LOCK TABLES `consultorios` WRITE;
/*!40000 ALTER TABLE `consultorios` DISABLE KEYS */;
INSERT INTO `consultorios` VALUES (1,'Buenavista','Carranza','1234','Mineros','Chihuahua','Chihuahua','54321');
/*!40000 ALTER TABLE `consultorios` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_consultorios_ai
AFTER INSERT ON consultorios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','consultorios',NEW.consultorio_id,@current_user_id,
    CONCAT('Creado consultorio id=',NEW.consultorio_id,' nombre=',NEW.nombre)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_consultorios_au
AFTER UPDATE ON consultorios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','consultorios',NEW.consultorio_id,@current_user_id,
    CONCAT('Actualizado consultorio id=',NEW.consultorio_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_consultorios_ad
AFTER DELETE ON consultorios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','consultorios',OLD.consultorio_id,@current_user_id,
    CONCAT('Eliminado consultorio id=',OLD.consultorio_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `estado_citas`
--

DROP TABLE IF EXISTS `estado_citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_citas` (
  `estado_id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`estado_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_citas`
--

LOCK TABLES `estado_citas` WRITE;
/*!40000 ALTER TABLE `estado_citas` DISABLE KEYS */;
INSERT INTO `estado_citas` VALUES (3,'Cancelada'),(4,'Completada'),(2,'Confirmada'),(5,'No asistió'),(1,'Programada');
/*!40000 ALTER TABLE `estado_citas` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_estado_citas_ai
AFTER INSERT ON estado_citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','estado_citas',NEW.estado_id,@current_user_id,
    CONCAT('Creado estado_citas id=',NEW.estado_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_estado_citas_au
AFTER UPDATE ON estado_citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','estado_citas',NEW.estado_id,@current_user_id,
    CONCAT('Actualizado estado_citas id=',NEW.estado_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_estado_citas_ad
AFTER DELETE ON estado_citas
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','estado_citas',OLD.estado_id,@current_user_id,
    CONCAT('Eliminado estado_citas id=',OLD.estado_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `expedientes`
--

DROP TABLE IF EXISTS `expedientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expedientes` (
  `expediente_id` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_id` int(11) NOT NULL,
  `notas_generales` text DEFAULT NULL,
  PRIMARY KEY (`expediente_id`),
  UNIQUE KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `expedientes_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`paciente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expedientes`
--

LOCK TABLES `expedientes` WRITE;
/*!40000 ALTER TABLE `expedientes` DISABLE KEYS */;
INSERT INTO `expedientes` VALUES (1,26,'Notas actualizadas'),(8,27,'Notas de prueba'),(11,44,'Paciente con antecedentes de alergia a penicilina. Requiere seguimiento anual.');
/*!40000 ALTER TABLE `expedientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_expedientes_ai
AFTER INSERT ON expedientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','expedientes',NEW.expediente_id,@current_user_id,
    CONCAT('Creado expediente id=',NEW.expediente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_expedientes_au
AFTER UPDATE ON expedientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','expedientes',NEW.expediente_id,@current_user_id,
    CONCAT('Actualizado expediente id=',NEW.expediente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_expedientes_ad
AFTER DELETE ON expedientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','expedientes',OLD.expediente_id,@current_user_id,
    CONCAT('Eliminado expediente id=',OLD.expediente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `historial_medico`
--

DROP TABLE IF EXISTS `historial_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historial_medico` (
  `historial_id` int(11) NOT NULL AUTO_INCREMENT,
  `expediente_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`historial_id`),
  KEY `expediente_id` (`expediente_id`),
  CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`expediente_id`) REFERENCES `expedientes` (`expediente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medico`
--

LOCK TABLES `historial_medico` WRITE;
/*!40000 ALTER TABLE `historial_medico` DISABLE KEYS */;
INSERT INTO `historial_medico` VALUES (1,1,'Seguimiento - Paciente mejora con el tratamiento','2025-05-28 23:36:42'),(2,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-28 23:43:32'),(3,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:09:34'),(4,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:16:27'),(5,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:24:28'),(6,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:30:58'),(7,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:44:18'),(8,1,'Consulta de rutina - Paciente presenta síntomas de gripe','2025-05-29 00:47:17'),(9,1,'Primera consulta - Paciente presenta síntomas de gripe','2024-03-15 10:00:00'),(10,1,'Seguimiento - Paciente mejora con el tratamiento','2024-03-20 11:00:00'),(11,1,'Control final - Paciente recuperado completamente','2024-03-25 09:00:00'),(12,11,'Primera consulta - Paciente presenta síntomas de gripe','2024-03-15 10:00:00'),(13,11,'Seguimiento - Paciente mejora con el tratamiento','2024-03-20 11:00:00'),(14,11,'Control final - Paciente recuperado completamente','2024-03-25 09:00:00');
/*!40000 ALTER TABLE `historial_medico` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_historial_ai
AFTER INSERT ON historial_medico
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','historial_medico',NEW.historial_id,@current_user_id,
    CONCAT('Creado historial id=',NEW.historial_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_historial_au
AFTER UPDATE ON historial_medico
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','historial_medico',NEW.historial_id,@current_user_id,
    CONCAT('Actualizado historial id=',NEW.historial_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_historial_ad
AFTER DELETE ON historial_medico
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','historial_medico',OLD.historial_id,@current_user_id,
    CONCAT('Eliminado historial id=',OLD.historial_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `medicos`
--

DROP TABLE IF EXISTS `medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicos` (
  `doctor_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultorio_id` int(11) DEFAULT NULL,
  `especialidad` varchar(100) NOT NULL,
  PRIMARY KEY (`doctor_id`),
  KEY `consultorio_id` (`consultorio_id`),
  CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`consultorio_id`) REFERENCES `consultorios` (`consultorio_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicos`
--

LOCK TABLES `medicos` WRITE;
/*!40000 ALTER TABLE `medicos` DISABLE KEYS */;
INSERT INTO `medicos` VALUES (1,1,'Cardiología Pediátrica'),(22,1,'Neurología'),(28,1,'Veterinaria');
/*!40000 ALTER TABLE `medicos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_medicos_ai
AFTER INSERT ON medicos
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','medicos',NEW.doctor_id,@current_user_id,
    CONCAT('Creado médico id=',NEW.doctor_id,' especialidad=',NEW.especialidad)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_medicos_au
AFTER UPDATE ON medicos
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','medicos',NEW.doctor_id,@current_user_id,
    CONCAT('Actualizado médico id=',NEW.doctor_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_medicos_ad
AFTER DELETE ON medicos
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','medicos',OLD.doctor_id,@current_user_id,
    CONCAT('Eliminado médico id=',OLD.doctor_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pacientes` (
  `paciente_id` int(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('M','F','O') NOT NULL,
  `doctor_id` int(11) NOT NULL,
  PRIMARY KEY (`paciente_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `pacientes_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `medicos` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (26,'1990-01-01','M',1),(27,'1985-06-15','M',1),(31,'1995-03-15','F',1),(32,'1988-07-22','M',1),(33,'1992-11-30','F',1),(34,'1985-04-18','M',1),(35,'1990-09-25','F',1),(42,'1990-05-15','F',28),(43,'1985-08-22','M',28),(44,'1992-11-30','F',28),(45,'2000-01-01','M',28),(46,'2010-01-01','M',28),(47,'1950-01-01','M',28);
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_pacientes_ai
AFTER INSERT ON pacientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('ingreso','pacientes',NEW.paciente_id,@current_user_id,
    CONCAT('Creado paciente id=',NEW.paciente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_pacientes_au
AFTER UPDATE ON pacientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('actualizacion','pacientes',NEW.paciente_id,@current_user_id,
    CONCAT('Actualizado paciente id=',NEW.paciente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_pacientes_ad
AFTER DELETE ON pacientes
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES('delete','pacientes',OLD.paciente_id,@current_user_id,
    CONCAT('Eliminado paciente id=',OLD.paciente_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'doctor'),(3,'paciente');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan','','Pérez','','sysadmin@clinica.com','sysadmin_password',1),(2,'Juan',NULL,'Pérez',NULL,'pablo.gomez@remed.com','remos',2),(4,'Juan','Anchondo','Marquez','Martinez','juan.marquez@remed.com','juanito',1),(9,'Juan','Alberto','Villa','Gutierrez','juan.gut@email.com','juan',3),(22,'Juanercio','Carlos','Pérez','García','juan.perez@example.com','password123',2),(26,'Rodrigo',NULL,'Sanchez',NULL,'rod@rg.com','password123',3),(27,'Francisco','Guillermo','Ochoa','Magaña','memo.ochoa@gmail.com','password123',3),(28,'Emilio','','Gutierrez','','emil.gut@chimed.com','password123',2),(31,'Ana','María','González','López','ana.gonzalez@email.com','password123',3),(32,'Carlos','José','Martínez','Rodríguez','carlos.martinez@email.com','password123',3),(33,'Laura','Isabel','Sánchez','Pérez','laura.sanchez@email.com','password123',3),(34,'Miguel','Ángel','Ramírez','Torres','miguel.ramirez@email.com','password123',3),(35,'Patricia','Elena','Díaz','Morales','patricia.diaz@email.com','password123',3),(42,'María',NULL,'González',NULL,'maria.gonzalez@email.com','password123',3),(43,'José',NULL,'Martínez',NULL,'jose.martinez@email.com','password123',3),(44,'Advotya',NULL,'Romanovna',NULL,'dunya@stpsb.gov','password123',3),(45,'Juan','Carlos','Bodoque',NULL,'bodoque@31.min','quepasatulio',3),(46,'Carlos',NULL,'Lechuga',NULL,'lechu@mail.com','lechu',3),(47,'Julio','Roberto','Ospina',NULL,'jro@berkeley.edu','trinity',3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_usuarios_bi_medico
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.role_id = 2 THEN
        -- Verificamos que exista la entrada en medicos después de la inserción
        -- Esto es solo una validación inicial
        IF NOT EXISTS (
            SELECT 1 
            FROM medicos 
            WHERE doctor_id = NEW.user_id
        ) THEN
            -- Permitimos la inserción, pero registramos que necesitamos crear la entrada en medicos
            SET @needs_medico_entry = 1;
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_usuarios_ai
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES(
    'ingreso',
    'usuarios',
    NEW.user_id,
    @current_user_id,
    CONCAT('Creado usuario id=', NEW.user_id, ' (', NEW.primer_nombre, ' ', NEW.apellido_paterno, ')')
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_usuarios_ai_medico
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.role_id = 2 AND @needs_medico_entry = 1 THEN
        -- Insertamos la entrada en medicos
        INSERT INTO medicos (doctor_id, consultorio_id, especialidad)
        VALUES (NEW.user_id, 1, 'General'); -- Valores por defecto
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_usuarios_au
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES(
    'actualizacion',
    'usuarios',
    NEW.user_id,
    @current_user_id,
    CONCAT('Actualizado usuario id=', NEW.user_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_usuarios_ad
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
  INSERT INTO bitacora(tipo, tabla_afectada, registro_id, usuario_id, detalle)
  VALUES(
    'delete',
    'usuarios',
    OLD.user_id,
    @current_user_id,
    CONCAT('Eliminado usuario id=', OLD.user_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'clinica_db'
--

--
-- Dumping routines for database 'clinica_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-01 20:07:02
