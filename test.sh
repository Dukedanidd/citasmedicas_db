curl -X POST http://localhost:3000/api/doctores \
  -H "Content-Type: application/json" \
  -d '{
    "primer_nombre": "Juan",
    "segundo_nombre": "Carlos",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "email": "juan.perez@example.com",
    "password": "password123",
    "especialidad": "Cardiología",
    "consultorio_id": 1
  }'
