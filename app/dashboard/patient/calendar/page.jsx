"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  FileText,
  Bell,
  Search,
  Clock,
  User,
  LogOut,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientCalendar() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentReason, setAppointmentReason] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [today, setToday] = useState(null)
  const [patientInfo, setPatientInfo] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState(null)

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const fetchPatientInfo = async () => {
    try {
      const patientId = sessionStorage.getItem('user_id')
      
      if (!patientId) {
        throw new Error('No se encontró información de sesión. Por favor, inicia sesión nuevamente.')
      }
      
      // Obtener información del paciente incluyendo su doctor asignado
      const patientResponse = await fetch(`/api/pacientes?pacienteId=${patientId}`)
      if (!patientResponse.ok) throw new Error('Error al cargar información del paciente')
      const patientData = await patientResponse.json()
      setPatientInfo(patientData)
      
      // Después obtener las citas
      await fetchAppointments(patientId)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const fetchAppointments = async (patientId = null) => {
    try {
      setLoading(true)
      
      const patientIdToUse = patientId || sessionStorage.getItem('user_id')
      
      if (!patientIdToUse) {
        throw new Error('No se encontró información de sesión.')
      }
      
      const response = await fetch(`/api/citas?pacienteId=${patientIdToUse}`)
      if (!response.ok) throw new Error('Error al cargar las citas')
      const data = await response.json()
      
      // Asegurarnos de que las fechas se procesen correctamente
      const processedData = data.map(appointment => ({
        ...appointment,
        fecha_hora: new Date(appointment.fecha_hora).toISOString()
      }))
      
      setAppointments(processedData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setToday(new Date())
    fetchPatientInfo()
  }, [])

  const handleDateSelect = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      setSelectedDate(date)
      setShowAppointmentModal(false)
    }

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return []
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.fecha_hora)
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAppointmentCancel = async (appointmentId) => {
    try {
      const response = await fetch(`/api/citas?citaId=${appointmentId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Error al cancelar la cita')
      await fetchAppointments()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleNewAppointment = async () => {
    if (appointmentReason && selectedTime && selectedDate && patientInfo) {
      try {
        // Obtener ID del paciente desde sessionStorage
        const patientId = sessionStorage.getItem('user_id')
        
        if (!patientId) {
          throw new Error('No se encontró información de sesión.')
        }

        if (!patientInfo.doctor_id) {
          throw new Error('No tienes un doctor asignado. Contacta al administrador.')
        }
        
        const response = await fetch('/api/citas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paciente_id: patientId,
            doctor_id: patientInfo.doctor_id,
            fecha_hora: `${selectedDate.toISOString().split('T')[0]} ${selectedTime}:00`,
            estado_id: 1, // Estado "Programada"
            notas: appointmentReason
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al crear la cita')
        }

        // Forzar una recarga completa de las citas
        await fetchAppointments()
        setShowAppointmentModal(false)
        setAppointmentReason("")
        setSelectedTime("")
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

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

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const navigateYear = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(currentMonth.getFullYear() + direction)
    setCurrentMonth(newMonth)
  }

  const selectMonth = (monthIndex) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(monthIndex)
    setCurrentMonth(newMonth)
    setShowMonthPicker(false)
  }

  const selectYear = (year) => {
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(year)
    setCurrentMonth(newMonth)
    setShowYearPicker(false)
  }

  const getYearRange = () => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 10 }, (_, i) => currentYear + i)
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const checkIfToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const checkIfSelected = (date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const handleMonthPicker = () => {
    setShowMonthPicker((prev) => !prev)
    setShowYearPicker(false)
  }

  const handleYearPicker = () => {
    setShowYearPicker((prev) => !prev)
    setShowMonthPicker(false)
  }

  // Días con citas en el mes actual
  const daysWithAppointments = appointments
    .filter(app => {
      const date = new Date(app.fecha_hora)
      return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      )
    })
    .map(app => {
      const date = new Date(app.fecha_hora)
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      }
    })

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return

    try {
      const response = await fetch(`/api/citas?citaId=${appointmentToDelete.cita_id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Error al cancelar la cita')
      await fetchAppointments()
      setShowDeleteModal(false)
      setAppointmentToDelete(null)
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-600">Cargando calendario...</div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600">Error: {error}</div>
    </div>
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
              <p className="text-sm text-slate-600">
                {loading ? 'Cargando...' : error ? 'Error al cargar datos' : 
                  `${patientInfo?.primer_nombre} ${patientInfo?.segundo_nombre || ''} ${patientInfo?.apellido_paterno} ${patientInfo?.apellido_materno || ''}`}
              </p>
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
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-sky-100 text-sky-700 shadow-sm"
            >
              <Calendar size={20} />
              <span className="font-medium">Calendario</span>
            </motion.a>

            <motion.a
              href="/dashboard/patient/records"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <FileText size={20} />
              <span className="font-medium">Expediente</span>
            </motion.a>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {today ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Calendar Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <Calendar className="mr-2 text-sky-600" size={24} />
                    Calendario de Citas
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAppointmentModal(true)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Agendar Cita
                  </motion.button>
                </div>

                {/* Month and Year */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={handleMonthPicker}
                        className="text-lg font-semibold text-slate-800 hover:text-sky-600 transition-colors"
                      >
                        {monthNames[currentMonth.getMonth()].charAt(0).toUpperCase() + monthNames[currentMonth.getMonth()].slice(1)}
                      </button>
                      {showMonthPicker && (
                        <div className="absolute top-full left-0 mt-2 min-w-[120px] bg-white rounded-lg shadow-xl border border-sky-100 p-2 z-30">
                          <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((month, index) => (
                              <button
                                key={month}
                                onClick={() => selectMonth(index)}
                                className="px-1 py-1 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors w-full text-left"
                              >
                                {month.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={handleYearPicker}
                      className="text-lg font-semibold text-slate-800 hover:text-sky-600 transition-colors"
                    >
                      {currentMonth.getFullYear()}
                    </button>
                    {showYearPicker && (
                      <div className="absolute top-full left-0 mt-2 min-w-[100px] bg-white rounded-lg shadow-xl border border-sky-100 p-2 z-30">
                        <div className="grid grid-cols-2 gap-2">
                          {getYearRange().map((year) => (
                            <button
                              key={year}
                              onClick={() => selectYear(year)}
                              className="px-1 py-1 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors w-full text-left"
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    const isToday = checkIfToday(day.date)
                    const isSelected = checkIfSelected(day.date)
                    const hasAppointment = daysWithAppointments.some(app => 
                      app.day === day.date.getDate() &&
                      app.month === day.date.getMonth() &&
                      app.year === day.date.getFullYear()
                    )
                    const isPast = day.date < new Date() && !isToday

                    let dayClassName = "bg-slate-50 text-slate-700"

                    if (isToday) {
                      dayClassName = "bg-purple-500 text-white font-bold"
                    } else if (hasAppointment && isPast) {
                      dayClassName = "bg-orange-200 text-orange-800"
                    } else if (hasAppointment) {
                      dayClassName = "bg-green-100 text-green-700"
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDateSelect(day.date.getDate())}
                        className={`p-4 rounded-lg text-center ${dayClassName} ${
                          !day.isCurrentMonth ? "opacity-50" : ""
                        } ${isSelected ? "ring-2 ring-sky-500" : ""}`}
                      >
                        {day.date.getDate()}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Color Legend */}
                <div className="mt-6 text-sm text-slate-700">
                  <h4 className="font-semibold mb-2">Simbología de Colores:</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <span className="block w-4 h-4 bg-purple-500 rounded-full mr-2"></span> Día Actual
                    </div>
                    <div className="flex items-center">
                      <span className="block w-4 h-4 bg-orange-200 rounded-full mr-2"></span> Cita Pasada
                    </div>
                    <div className="flex items-center">
                      <span className="block w-4 h-4 bg-green-100 rounded-full mr-2"></span> Cita Futura
                    </div>
                  </div>
                </div>

                {/* Selected Date Appointments */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-sky-100"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Citas para {formatDate(selectedDate)}
                    </h3>
                    <div className="space-y-4">
                      {getAppointmentsForSelectedDate().length > 0 ? (
                        getAppointmentsForSelectedDate().map(appointment => (
                          <motion.div
                            key={appointment.cita_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-sky-50 border border-sky-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-slate-800 font-medium">
                                  {formatTime(appointment.fecha_hora)} - Dr. {appointment.doctor_apellido}
                                </p>
                                <p className="text-slate-600 text-sm mt-1">
                                  {appointment.notas}
                                </p>
                                <p className="text-slate-500 text-sm mt-2">
                                  Estado: {appointment.estado_nombre}
                                </p>
                              </div>
                              {appointment.estado_id === 1 && (
                                <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteClick(appointment)}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <X size={16} />
                              </motion.button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-slate-600">No hay citas programadas para este día</p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAppointmentModal(true)}
                            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                          >
                            Agendar Cita
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center text-slate-600">Cargando calendario...</div>
          )}
        </main>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && today && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Agendar Nueva Cita</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAppointmentModal(false)}
                className="p-2 text-slate-600 hover:text-slate-800"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              {/* Fecha seleccionada */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha seleccionada
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={selectedDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                    className="p-2 bg-sky-50/50 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAppointmentModal(false)}
                    className="p-2 text-sky-600 hover:text-sky-800"
                  >
                    <Calendar size={20} />
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Motivo de la Consulta
                </label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full h-24 p-3 bg-sky-50/50 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Describe el motivo de tu consulta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Horario Disponible
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm ${
                        selectedTime === time
                          ? "bg-sky-500 text-white"
                          : "bg-sky-50 text-slate-700 hover:bg-sky-100"
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewAppointment}
                disabled={!appointmentReason || !selectedTime || !selectedDate}
                className="w-full py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Cita
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && appointmentToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Confirmar Cancelación</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowDeleteModal(false)
                  setAppointmentToDelete(null)
                }}
                className="p-2 text-slate-600 hover:text-slate-800"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                ¿Estás seguro de que deseas cancelar la cita con el Dr. {appointmentToDelete.doctor_apellido}{' '}
                programada para el {formatDate(new Date(appointmentToDelete.fecha_hora))} 
                a las {formatTime(appointmentToDelete.fecha_hora)}?
              </p>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDeleteModal(false)
                    setAppointmentToDelete(null)
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  No, mantener
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sí, cancelar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 