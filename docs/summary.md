# Citas Médicas Project - Current State

## Project Overview
- Medical appointments management system
- Node.js backend with MySQL database
- Currently working on backend implementation and testing

## Recent Work
1. **API Documentation**
   - Created comprehensive API documentation in Spanish
   - Located at: `citasmedicas_db/docs/api_endpoints.md`
   - Covers all endpoints for doctors, patients, medical records, appointments, etc.

2. **Test Data**
   - Created test data script at: `citasmedicas_db/database/test_data.sql`
   - Added test users (IDs 31-35) with plain text passwords for testing
   - Added test patients, some with and without medical records
   - Added test appointments in various states
   - Added test medical records and allergies

3. **Database Structure**
   - Main tables: usuarios, pacientes, expedientes, citas, historial_medico, alergias, bitacora
   - Key relationships:
     - pacientes -> usuarios (user_id)
     - expedientes -> pacientes (paciente_id)
     - citas -> pacientes, doctores (paciente_id, doctor_id)

4. **Current Focus**
   - Backend implementation and testing
   - API endpoint validation
   - Test data management
   - Appointment scheduling system with fixed hours (8:00 AM - 8:00 PM)

5. **Notas/Apuntes Médicos**
   - Los doctores pueden crear, leer, editar y eliminar apuntes médicos personales.
   - Endpoints RESTful: `/api/doctores/{id}/apuntes` (GET, POST, PUT, DELETE)
   - Los apuntes se almacenan en la tabla `apuntes` con referencia al doctor y fecha/hora.

## Important Notes
- Using plain text passwords for testing (not for production)
- Appointment times must be between 08:00:00 and 20:00:00
- All endpoints require JWT authentication
- Test data includes various scenarios (patients with/without records, appointments in different states) 