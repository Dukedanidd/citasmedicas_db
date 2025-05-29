#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# Archivo de salida
OUTPUT_FILE="test_results_$(date +%Y%m%d_%H%M%S).txt"
SUMMARY_FILE="test_summary_$(date +%Y%m%d_%H%M%S).txt"

# Contadores para el resumen
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
FAILED_ENDPOINTS=()

# Función para imprimir mensajes
print_message() {
    echo -e "${BLUE}[TEST]${NC} $1"
    echo "[TEST] $1" >> "$OUTPUT_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[SUCCESS] $1" >> "$OUTPUT_FILE"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$OUTPUT_FILE"
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

    ((TOTAL_TESTS++))

    echo -e "\n${GREEN}Probando: $description${NC}"
    echo "Endpoint: $endpoint"
    echo "Método: $method"
    if [ ! -z "$data" ]; then
        echo "Datos: $data"
    fi

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    # Solo guardar la respuesta en el archivo si hay un error
    if [ "$status_code" != "$expected_status" ]; then
        echo "Respuesta: $body" >> "$OUTPUT_FILE"
        echo "Código de estado: $status_code" >> "$OUTPUT_FILE"
        echo "Código esperado: $expected_status" >> "$OUTPUT_FILE"
        echo "---" >> "$OUTPUT_FILE"
        
        FAILED_ENDPOINTS+=("$description ($method $endpoint)")
        ((FAILED_TESTS++))
        echo -e "${RED}✗ Prueba fallida${NC}"
        return 1
    else
        ((PASSED_TESTS++))
        echo -e "${GREEN}✓ Prueba exitosa${NC}"
        return 0
    fi
}

# Función para generar el resumen
generate_summary() {
    {
        echo "=== Resumen de Pruebas ==="
        echo "Fecha: $(date)"
        echo "Total de pruebas: $TOTAL_TESTS"
        echo "Pruebas exitosas: $PASSED_TESTS"
        echo "Pruebas fallidas: $FAILED_TESTS"
        echo "Tasa de éxito: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
        
        if [ ${#FAILED_ENDPOINTS[@]} -gt 0 ]; then
            echo -e "\nEndpoints con errores:"
            for endpoint in "${FAILED_ENDPOINTS[@]}"; do
                echo "- $endpoint"
            done
        fi
    } > "$SUMMARY_FILE"
}

# Limpiar archivos anteriores
> "$OUTPUT_FILE"
> "$SUMMARY_FILE"

# Probar endpoints de Doctores
print_message "Testing Doctores endpoints..."

# Obtener doctor por ID
test_endpoint "GET" "/doctores/1" \
    "" "200" "Get doctor by ID"

# Actualizar doctor
test_endpoint "PUT" "/doctores/1" \
    '{"primer_nombre": "Juan", "apellido_paterno": "Pérez", "especialidad": "Cardiología Pediátrica", "consultorio_id": 1}' \
    "200" "Update doctor"

# Probar endpoints de Pacientes
print_message "Testing Pacientes endpoints..."

# Obtener paciente por ID
test_endpoint "GET" "/pacientes?pacienteId=26" \
    "" "200" "Get paciente by ID"

# Actualizar paciente
test_endpoint "PUT" "/pacientes" \
    '{"paciente_id": 26, "primer_nombre": "Rodrigo", "segundo_nombre": "Alberto", "apellido_paterno": "Fernandez", "apellido_materno": "Garcia", "email": "rod@rg.com", "fecha_nacimiento": "1990-01-01", "sexo": "M", "doctor_id": 1}' \
    "200" "Update paciente"

# Probar endpoints de Expedientes
print_message "Testing Expedientes endpoints..."

# Crear expediente
test_endpoint "POST" "/expedientes" \
    '{"paciente_id": 27, "notas_generales": "Notas de prueba"}' \
    "201" "Create expediente"

# Obtener expediente por ID
test_endpoint "GET" "/expedientes?expedienteId=1" \
    "" "200" "Get expediente by ID"

# Obtener expediente por paciente
test_endpoint "GET" "/expedientes?pacienteId=26" \
    "" "200" "Get expediente by paciente"

# Actualizar expediente
test_endpoint "PUT" "/expedientes" \
    '{"expediente_id": 1, "notas_generales": "Notas actualizadas"}' \
    "200" "Update expediente"

# Probar endpoints de Historial Médico
print_message "Testing Historial Médico endpoints..."

# Crear registro de historial
test_endpoint "POST" "/historial" \
    '{"expediente_id": 1, "descripcion": "Consulta de rutina - Paciente presenta síntomas de gripe"}' \
    "201" "Create historial record"

# Obtener historial por ID
test_endpoint "GET" "/historial?historialId=1" \
    "" "200" "Get historial by ID"

# Obtener historial por expediente
test_endpoint "GET" "/historial?expedienteId=1" \
    "" "200" "Get historial by expediente"

# Actualizar registro de historial
test_endpoint "PUT" "/historial" \
    '{"historial_id": 1, "descripcion": "Seguimiento - Paciente mejora con el tratamiento"}' \
    "200" "Update historial record"

# Probar endpoints de Alergias
print_message "Testing Alergias endpoints..."

# Crear alergia
test_endpoint "POST" "/alergias" \
    '{"expediente_id": 1, "descripcion": "Alergia a penicilina"}' \
    "201" "Create alergia"

# Obtener alergia por ID
test_endpoint "GET" "/alergias?alergiaId=1" \
    "" "200" "Get alergia by ID"

# Obtener alergias por expediente
test_endpoint "GET" "/alergias?expedienteId=1" \
    "" "200" "Get alergias by expediente"

# Actualizar alergia
test_endpoint "PUT" "/alergias" \
    '{"alergia_id": 1, "descripcion": "Alergia severa a penicilina"}' \
    "200" "Update alergia"

# Probar endpoints de Citas
print_message "Testing Citas endpoints..."

# Crear cita
test_endpoint "POST" "/citas" \
    '{"paciente_id": 26, "doctor_id": 1, "fecha_hora": "2024-03-20 10:00:00", "estado_id": 1, "notas": "Consulta de rutina"}' \
    "201" "Create cita"

# Obtener cita por ID
test_endpoint "GET" "/citas?citaId=2" \
    "" "200" "Get cita by ID"

# Obtener citas por paciente
test_endpoint "GET" "/citas?pacienteId=26" \
    "" "200" "Get citas by paciente"

# Obtener citas por doctor
test_endpoint "GET" "/citas?doctorId=1" \
    "" "200" "Get citas by doctor"

# Actualizar cita
test_endpoint "PUT" "/citas" \
    '{"cita_id": 2, "fecha_hora": "2024-03-20 11:00:00", "estado_id": 2, "notas": "Consulta de seguimiento"}' \
    "200" "Update cita"

print_message "All tests completed!"

# Generar resumen
generate_summary

echo -e "\nResumen guardado en: $SUMMARY_FILE"
echo "Detalles de errores guardados en: $OUTPUT_FILE" 