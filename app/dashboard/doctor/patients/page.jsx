"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, User, Bell, Stethoscope, LogOut, Users, Calendar, Activity, X, Eye, EyeOff, Clock } from "lucide-react"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [patients, setPatients] = useState([])
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [newPatient, setNewPatient] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    fecha_nacimiento: "",
    sexo: "M",
    password: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [newAppointment, setNewAppointment] = useState({
    fecha_hora: "",
    notas: "",
    estado_id: 1 // 1 = Programada
  })
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false)
  const [appointmentError, setAppointmentError] = useState(null)

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userId = sessionStorage.getItem('user_id')
        if (!userId) {
          throw new Error('No se encontró información de sesión')
        }

        const response = await fetch(`/api/doctores/${userId}`)
        if (!response.ok) {
          throw new Error('Error al cargar datos del doctor')
        }

        const data = await response.json()
        setDoctorName(`${data.primer_nombre} ${data.segundo_nombre || ''} ${data.apellido_paterno} ${data.apellido_materno || ''}`)
        return data.doctor_id // Retornamos el ID del doctor para usarlo en la siguiente llamada
      } catch (err) {
        console.error('Error al cargar datos del doctor:', err)
        setError(err.message)
        return null
      }
    }

    const fetchPatients = async (doctorId) => {
      if (!doctorId) return

      try {
        const response = await fetch(`/api/doctores/${doctorId}/pacientes`)
        if (!response.ok) {
          throw new Error('Error al cargar los pacientes')
        }
        const pacientesData = await response.json()
        setPatients(pacientesData)
      } catch (err) {
        console.error('Error al cargar datos de pacientes:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const initializeData = async () => {
      const doctorId = await fetchDoctorData()
      if (doctorId) {
        await fetchPatients(doctorId)
      }
    }

    initializeData()
  }, [])

  const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.primer_nombre} ${patient.segundo_nombre || ''} ${patient.apellido_paterno} ${patient.apellido_materno || ''}`;
    return normalizeText(fullName).includes(normalizeText(searchTerm));
  });

  const handleNewPatientSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const userId = sessionStorage.getItem('user_id')
      if (!userId) {
        throw new Error('No se encontró información de sesión')
      }

      // Primero obtenemos el doctor_id
      const doctorResponse = await fetch(`/api/doctores/${userId}`)
      if (!doctorResponse.ok) {
        throw new Error('Error al obtener datos del doctor')
      }
      const doctorData = await doctorResponse.json()

      // Generamos una contraseña aleatoria si no se proporcionó una
      const password = newPatient.password || Math.random().toString(36).slice(-8)

      // Creamos el nuevo paciente
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPatient,
          password, // Incluimos la contraseña
          doctor_id: doctorData.doctor_id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el paciente')
      }

      // Actualizamos la lista de pacientes
      const updatedPatientsResponse = await fetch(`/api/doctores/${doctorData.doctor_id}/pacientes`)
      if (updatedPatientsResponse.ok) {
        const updatedPatients = await updatedPatientsResponse.json()
        setPatients(updatedPatients)
      }

      // Limpiamos el formulario y cerramos el modal
      setNewPatient({
        primer_nombre: "",
        segundo_nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        fecha_nacimiento: "",
        sexo: "M",
        password: ""
      })
      setShowNewPatientModal(false)

      // Mostramos la contraseña generada si no se proporcionó una
      if (!newPatient.password) {
        alert(`Paciente creado exitosamente. Contraseña generada: ${password}`)
      }
    } catch (err) {
      console.error('Error al crear paciente:', err)
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewAppointment = (patient) => {
    setSelectedPatient(patient)
    setNewAppointment({
      fecha_hora: "",
      notas: "",
      estado_id: 1
    })
    setShowNewAppointmentModal(true)
  }

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingAppointment(true)
    setAppointmentError(null)

    try {
      const userId = sessionStorage.getItem('user_id')
      if (!userId) {
        throw new Error('No se encontró información de sesión')
      }

      // Obtenemos el doctor_id
      const doctorResponse = await fetch(`/api/doctores/${userId}`)
      if (!doctorResponse.ok) {
        throw new Error('Error al obtener datos del doctor')
      }
      const doctorData = await doctorResponse.json()

      // Verificamos la disponibilidad del doctor
      const fechaHora = new Date(newAppointment.fecha_hora)
      const fecha = fechaHora.toISOString().split('T')[0]
      const hora = fechaHora.toTimeString().split(' ')[0]

      // Verificamos en la agenda
      const agendaResponse = await fetch(`/api/agenda/${doctorData.doctor_id}/${fecha}`)
      if (!agendaResponse.ok) {
        throw new Error('Error al verificar disponibilidad')
      }
      const agendaData = await agendaResponse.json()

      if (!agendaData || !agendaData.disponible) {
        throw new Error('El doctor no tiene horario disponible en esta fecha')
      }

      // Verificamos que la hora esté dentro del horario de trabajo
      const horaInicio = new Date(`${fecha}T${agendaData.hora_inicio}`)
      const horaFin = new Date(`${fecha}T${agendaData.hora_fin}`)
      
      if (fechaHora < horaInicio || fechaHora > horaFin) {
        throw new Error(`El horario de atención es de ${agendaData.hora_inicio} a ${agendaData.hora_fin}`)
      }

      // Verificamos citas existentes
      const citasResponse = await fetch(`/api/citas/doctor/${doctorData.doctor_id}/${fecha}`)
      if (!citasResponse.ok) {
        throw new Error('Error al verificar citas existentes')
      }
      const citasData = await citasResponse.json()

      // Verificamos si hay una cita en el mismo horario
      const citaExistente = citasData.citas.find(cita => {
        const citaHora = new Date(cita.fecha_hora)
        return citaHora.getTime() === fechaHora.getTime()
      })

      if (citaExistente) {
        throw new Error('Ya existe una cita programada en este horario')
      }

      // Creamos la nueva cita
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAppointment,
          paciente_id: selectedPatient.paciente_id,
          doctor_id: doctorData.doctor_id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la cita')
      }

      // Limpiamos el formulario y cerramos el modal
      setNewAppointment({
        fecha_hora: "",
        notas: "",
        estado_id: 1
      })
      setShowNewAppointmentModal(false)
      setSelectedPatient(null)

      // Mostramos mensaje de éxito
      alert('Cita creada exitosamente')
    } catch (err) {
      console.error('Error al crear cita:', err)
      setAppointmentError(err.message)
    } finally {
      setIsSubmittingAppointment(false)
    }
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
              <Stethoscope className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Gestión de Pacientes</h1>
              <p className="text-sm text-slate-600">{loading ? 'Cargando...' : error ? 'Error al cargar datos' : doctorName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <Bell size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowNewPatientModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Plus size={16} />
              <span>Nuevo Paciente</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
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
              href="/dashboard/doctor"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <Activity size={20} />
              <span className="font-medium">Dashboard</span>
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-sky-100 text-sky-700 shadow-sm"
            >
              <Users size={20} />
              <span className="font-medium">Pacientes</span>
            </motion.div>

            <motion.a
              href="/dashboard/doctor/appointments"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <Calendar size={20} />
              <span className="font-medium">Calendario</span>
            </motion.a>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
                <p className="text-sm text-slate-600">Total Pacientes</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter((p) => p.estado === "Estable").length}
                </p>
                <p className="text-sm text-slate-600">Estables</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {patients.filter((p) => p.estado === "Control").length}
                </p>
                <p className="text-sm text-slate-600">En Control</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {patients.filter((p) => p.estado === "Mejoría").length}
                </p>
                <p className="text-sm text-slate-600">En Mejoría</p>
              </div>
            </div>
          </motion.div>

          {/* Patients Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-600">Cargando pacientes...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-600">No se encontraron pacientes</p>
              </div>
            ) : (
              filteredPatients.map((patient, index) => (
              <motion.div
                  key={patient.paciente_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                      <h3 className="font-semibold text-slate-800">
                        {`${patient.primer_nombre} ${patient.segundo_nombre || ''} ${patient.apellido_paterno} ${patient.apellido_materno || ''}`}
                      </h3>
                      <p className="text-sm text-slate-600">{patient.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Fecha de Nacimiento:</span>
                      <span className="text-sm font-medium text-slate-800">
                        {new Date(patient.fecha_nacimiento).toLocaleDateString()}
                      </span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Sexo:</span>
                      <span className="text-sm text-slate-800">{patient.sexo}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-sm hover:bg-sky-200 transition-colors"
                  >
                    Ver Historial
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleNewAppointment(patient)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                  >
                    Nueva Cita
                  </motion.button>
                </div>
              </motion.div>
              ))
            )}
          </motion.div>
        </main>
      </div>

      {/* Modal de Nuevo Paciente */}
      <AnimatePresence>
        {showNewPatientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowNewPatientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Nuevo Paciente</h2>
                <button
                  onClick={() => setShowNewPatientModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleNewPatientSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Primer Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatient.primer_nombre}
                      onChange={(e) => setNewPatient({ ...newPatient, primer_nombre: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Segundo Nombre
                    </label>
                    <input
                      type="text"
                      value={newPatient.segundo_nombre}
                      onChange={(e) => setNewPatient({ ...newPatient, segundo_nombre: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatient.apellido_paterno}
                      onChange={(e) => setNewPatient({ ...newPatient, apellido_paterno: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      value={newPatient.apellido_materno}
                      onChange={(e) => setNewPatient({ ...newPatient, apellido_materno: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      required
                      value={newPatient.fecha_nacimiento}
                      onChange={(e) => setNewPatient({ ...newPatient, fecha_nacimiento: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sexo *
                    </label>
                    <select
                      required
                      value={newPatient.sexo}
                      onChange={(e) => setNewPatient({ ...newPatient, sexo: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPatient.password}
                        onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                        placeholder="Dejar en blanco para generar una aleatoria"
                        className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Si no se proporciona una contraseña, se generará una aleatoria
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="text-red-600 text-sm mt-2">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewPatientModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Paciente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Nueva Cita */}
      <AnimatePresence>
        {showNewAppointmentModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowNewAppointmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Nueva Cita</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Paciente: {selectedPatient.primer_nombre} {selectedPatient.segundo_nombre || ''} {selectedPatient.apellido_paterno} {selectedPatient.apellido_materno || ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha y Hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newAppointment.fecha_hora}
                    onChange={(e) => setNewAppointment({ ...newAppointment, fecha_hora: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={newAppointment.notas}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notas: e.target.value })}
                    placeholder="Agregar notas o detalles de la cita..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-800 resize-none"
                  />
                </div>

                {appointmentError && (
                  <div className="text-red-600 text-sm">
                    {appointmentError}
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewAppointmentModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAppointment}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAppointment ? 'Creando...' : 'Crear Cita'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
