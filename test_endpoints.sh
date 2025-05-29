#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# Función para imprimir mensajes
print_message() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# URL base
BASE_URL="http://localhost:3000/api"

# Función para probar un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5

    print_message "Testing $method $endpoint - $description"
    
    if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" = "$expected_status" ]; then
        print_success "Status code $status_code received"
        echo "Response body: $body"
        echo "----------------------------------------"
        return 0
    else
        print_error "Expected status $expected_status but got $status_code"
        echo "Response body: $body"
        echo "----------------------------------------"
        return 1
    fi
}

# Probar endpoints de Expedientes
print_message "Testing Expedientes endpoints..."

# Crear expediente
test_endpoint "POST" "/expedientes" \
    '{"paciente_id": 1, "notas_generales": "Notas de prueba"}' \
    "201" "Create expediente"

# Obtener expediente por ID
test_endpoint "GET" "/expedientes?expedienteId=1" \
    "" "200" "Get expediente by ID"

# Obtener expediente por paciente
test_endpoint "GET" "/expedientes?pacienteId=1" \
    "" "200" "Get expediente by paciente"

# Actualizar expediente
test_endpoint "PUT" "/expedientes" \
    '{"expediente_id": 1, "notas_generales": "Notas actualizadas"}' \
    "200" "Update expediente"

# Probar endpoints de Historial Médico
print_message "Testing Historial Médico endpoints..."

# Crear registro de historial
test_endpoint "POST" "/historial" \
    '{"expediente_id": 1, "diagnostico": "Diagnóstico de prueba", "tratamiento": "Tratamiento de prueba", "observaciones": "Observaciones de prueba"}' \
    "201" "Create historial record"

# Obtener historial por ID
test_endpoint "GET" "/historial?historialId=1" \
    "" "200" "Get historial by ID"

# Obtener historial por expediente
test_endpoint "GET" "/historial?expedienteId=1" \
    "" "200" "Get historial by expediente"

# Actualizar registro de historial
test_endpoint "PUT" "/historial" \
    '{"historial_id": 1, "diagnostico": "Diagnóstico actualizado", "tratamiento": "Tratamiento actualizado", "observaciones": "Observaciones actualizadas"}' \
    "200" "Update historial record"

# Probar endpoints de Alergias
print_message "Testing Alergias endpoints..."

# Crear alergia
test_endpoint "POST" "/alergias" \
    '{"expediente_id": 1, "nombre_alergia": "Penicilina", "descripcion": "Alergia a penicilina", "severidad": "Alta"}' \
    "201" "Create alergia"

# Obtener alergia por ID
test_endpoint "GET" "/alergias?alergiaId=1" \
    "" "200" "Get alergia by ID"

# Obtener alergias por expediente
test_endpoint "GET" "/alergias?expedienteId=1" \
    "" "200" "Get alergias by expediente"

# Actualizar alergia
test_endpoint "PUT" "/alergias" \
    '{"alergia_id": 1, "nombre_alergia": "Penicilina", "descripcion": "Alergia severa a penicilina", "severidad": "Muy Alta"}' \
    "200" "Update alergia"

# Probar endpoints de Doctores
print_message "Testing Doctores endpoints..."

# Crear doctor
test_endpoint "POST" "/doctores" \
    '{"user_id": 2, "especialidad": "Cardiología", "cedula": "12345"}' \
    "201" "Create doctor"

# Obtener doctor por ID
test_endpoint "GET" "/doctores/1" \
    "" "200" "Get doctor by ID"

# Actualizar doctor
test_endpoint "PUT" "/doctores/1" \
    '{"especialidad": "Cardiología Pediátrica", "cedula": "12345"}' \
    "200" "Update doctor"

# Probar endpoints de Pacientes
print_message "Testing Pacientes endpoints..."

# Crear paciente
test_endpoint "POST" "/pacientes" \
    '{"user_id": 3, "doctor_id": 1, "fecha_nacimiento": "1990-01-01", "genero": "M", "direccion": "Calle 123", "telefono": "1234567890"}' \
    "201" "Create paciente"

# Obtener paciente por ID
test_endpoint "GET" "/pacientes?pacienteId=1" \
    "" "200" "Get paciente by ID"

# Actualizar paciente
test_endpoint "PUT" "/pacientes" \
    '{"paciente_id": 1, "doctor_id": 1, "fecha_nacimiento": "1990-01-01", "genero": "M", "direccion": "Calle 456", "telefono": "0987654321"}' \
    "200" "Update paciente"

# Probar endpoints de Citas
print_message "Testing Citas endpoints..."

# Crear cita
test_endpoint "POST" "/citas" \
    '{"paciente_id": 1, "doctor_id": 1, "fecha_hora": "2024-03-20 10:00:00", "motivo": "Consulta de rutina", "estado": "Programada"}' \
    "201" "Create cita"

# Obtener cita por ID
test_endpoint "GET" "/citas?citaId=1" \
    "" "200" "Get cita by ID"

# Obtener citas por paciente
test_endpoint "GET" "/citas?pacienteId=1" \
    "" "200" "Get citas by paciente"

# Obtener citas por doctor
test_endpoint "GET" "/citas?doctorId=1" \
    "" "200" "Get citas by doctor"

# Actualizar cita
test_endpoint "PUT" "/citas" \
    '{"cita_id": 1, "fecha_hora": "2024-03-20 11:00:00", "motivo": "Consulta de seguimiento", "estado": "Confirmada"}' \
    "200" "Update cita"

print_message "All tests completed!" 