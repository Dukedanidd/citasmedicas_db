"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Calendar,
  User,
  Bell,
  LogOut,
  Heart,
  Activity,
  Pill,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function PatientRecords() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDateStr) => {
    try {
      const today = new Date()
      const birthDate = new Date(birthDateStr)
      
      // Verificar que la fecha sea válida
      if (isNaN(birthDate.getTime())) {
        console.warn('Fecha de nacimiento inválida:', birthDateStr)
        return 'No disponible'
      }
      
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      // Ajustar la edad si aún no ha llegado el mes de cumpleaños
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age
    } catch (error) {
      console.error('Error calculando edad:', error)
      return 'No disponible'
    }
  }

  // Función para formatear la fecha en formato legible
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      
      // Verificar que la fecha sea válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', dateStr)
        return 'No disponible'
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return 'No disponible'
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  useEffect(() => {
    fetchPatientData()
  }, [])

  const fetchPatientData = async () => {
    try {
      setLoading(true)
      
      // Obtener ID del paciente desde sessionStorage
      const patientId = sessionStorage.getItem('user_id')
      
      if (!patientId) {
        throw new Error('No se encontró información de sesión. Por favor, inicia sesión nuevamente.')
      }
      
      // Obtener información del paciente
      const response = await fetch(`/api/pacientes?pacienteId=${patientId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar datos del paciente')
      }
      
      const data = await response.json()
      
      // Si el paciente tiene un doctor asignado, obtener su información
      let doctorInfo = null
      if (data.doctor_id) {
        const doctorResponse = await fetch(`/api/doctores/${data.doctor_id}`)
        if (doctorResponse.ok) {
          doctorInfo = await doctorResponse.json()
        }
      }

      // Obtener el expediente del paciente
      const expedienteResponse = await fetch(`/api/expedientes?pacienteId=${patientId}`)
      if (!expedienteResponse.ok) {
        throw new Error('Error al cargar el expediente del paciente')
      }
      const expedienteData = await expedienteResponse.json()
      
      // Verificar que tenemos un expediente válido
      if (!expedienteData || !expedienteData[0] || !expedienteData[0].expediente_id) {
        throw new Error('No se encontró el expediente del paciente')
      }

      // Obtener el historial médico
      const historialResponse = await fetch(`/api/historial?expedienteId=${expedienteData[0].expediente_id}`)
      if (!historialResponse.ok) {
        throw new Error('Error al cargar el historial médico')
      }
      const historialData = await historialResponse.json()
      
      console.log('Expediente ID:', expedienteData[0].expediente_id)
      console.log('Historial Data:', historialData)
      
      // Formatear los datos para la interfaz
      const formattedData = {
        general: {
          nombre: `${data.primer_nombre} ${data.segundo_nombre || ''} ${data.apellido_paterno} ${data.apellido_materno || ''}`.trim(),
          edad: data.fecha_nacimiento ? calculateAge(data.fecha_nacimiento) : 'No disponible',
          genero: data.sexo || 'No especificado',
          email: data.email || 'No disponible',
          fechaNacimiento: data.fecha_nacimiento ? formatDate(data.fecha_nacimiento) : 'No disponible',
          doctorNombre: doctorInfo ? `Dr. ${doctorInfo.primer_nombre} ${doctorInfo.apellido_paterno}` : 'No asignado',
          doctorEspecialidad: doctorInfo?.especialidad || 'No especificada'
        },
        historial: historialData.map(registro => ({
          fecha: formatDate(registro.fecha_registro),
          descripcion: registro.descripcion
        })),
        notas: expedienteData[0]?.notas_generales || ''
      }
      
      setPatientData(formattedData)
    } catch (err) {
      console.error('Error al cargar datos del paciente:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-slate-600">Cargando expediente...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-red-200 shadow-lg max-w-md">
          <div className="text-red-600 flex items-center gap-2 mb-4">
            <AlertCircle size={24} />
            <span className="text-lg font-semibold">Error al cargar datos</span>
          </div>
          <p className="text-slate-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-slate-600">No se encontraron datos del paciente</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-sky-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">MediCare Pro</h1>
              <p className="text-sm text-slate-600">Paciente</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-white/60 backdrop-blur-lg border-r border-sky-200 min-h-screen p-6"
        >
          <nav className="space-y-4">
            <motion.a
              href="/dashboard/patient"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <User size={20} />
              <span className="font-medium">Dashboard</span>
            </motion.a>

            <motion.a
              href="/dashboard/patient/calendar"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <Calendar size={20} />
              <span className="font-medium">Calendario</span>
            </motion.a>

            <motion.a
              href="/dashboard/patient/records"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-sky-100 text-sky-700 shadow-sm"
            >
              <FileText size={20} />
              <span className="font-medium">Expediente</span>
            </motion.a>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg">
              <div className="flex space-x-1 p-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab("general")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "general"
                      ? "bg-sky-500 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  Información General
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab("historial")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "historial"
                      ? "bg-sky-500 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  Historial Médico
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab("notas")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "notas"
                      ? "bg-sky-500 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  Notas Generales
                </motion.button>
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
            >
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-sky-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Datos Personales</h3>
                      <div className="space-y-2">
                        <p className="text-slate-600">
                          <span className="font-medium">Nombre:</span> {patientData.general.nombre}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-medium">Edad:</span> {patientData.general.edad} años
                        </p>
                        <p className="text-slate-600">
                          <span className="font-medium">Género:</span> {patientData.general.genero}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-medium">Email:</span> {patientData.general.email}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-medium">Fecha de Nacimiento:</span> {patientData.general.fechaNacimiento}
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Información Médica</h3>
                      <div className="space-y-2">
                        <p className="text-slate-600">
                          <span className="font-medium">Doctor Asignado:</span>{' '}
                          {patientData.general.doctorNombre}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-medium">Especialidad:</span>{' '}
                          {patientData.general.doctorEspecialidad}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "historial" && (
                <div className="space-y-4">
                  {patientData.historial.length > 0 ? (
                    patientData.historial.map((registro, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-sky-50 border border-sky-200 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-slate-600 text-sm">{registro.fecha}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-700">
                            {registro.descripcion}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-slate-600 py-8">
                      No hay registros en el historial médico
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notas" && (
                <div className="space-y-4">
                  {patientData.notas ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-sky-50 border border-sky-200 rounded-xl p-4"
                      >
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Notas Generales</h3>
                      <p className="text-slate-700">{patientData.notas}</p>
                      </motion.div>
                  ) : (
                    <div className="text-center text-slate-600 py-8">
                      No hay notas generales registradas
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
} 