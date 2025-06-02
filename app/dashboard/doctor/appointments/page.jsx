"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Bell,
  Stethoscope,
  LogOut,
  Users,
  CalendarIcon,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { useRouter } from 'next/navigation'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [doctorId, setDoctorId] = useState(null)
  const [showAllAppointments, setShowAllAppointments] = useState(false)
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [newAppointment, setNewAppointment] = useState({
    paciente_id: "",
    fecha_hora: "",
    notas: "",
    estado_id: 1
  })
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [formError, setFormError] = useState("")
  const router = useRouter()

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
        setDoctorId(data.doctor_id)
        return data.doctor_id
      } catch (err) {
        console.error('Error al cargar datos del doctor:', err)
        setError(err.message)
        return null
      }
    }

    const fetchAppointments = async (id) => {
      if (!id) return

      try {
        const response = await fetch(`/api/citas?doctorId=${id}`)
        if (!response.ok) {
          throw new Error('Error al cargar las citas')
        }
        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        console.error('Error al cargar citas:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const initializeData = async () => {
      const id = await fetchDoctorData()
      if (id) {
        await fetchAppointments(id)
      }
    }

    initializeData()
  }, [])

  // Función para obtener las citas del día seleccionado
  const getAppointmentsForSelectedDate = () => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.fecha_hora)
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }

  // Función para obtener el estado de la cita en español
  const getAppointmentStatus = (estadoId) => {
    switch (estadoId) {
      case 1: return { text: "Programada", color: "yellow" }
      case 2: return { text: "Confirmada", color: "green" }
      case 3: return { text: "Cancelada", color: "red" }
      case 4: return { text: "Completada", color: "blue" }
      case 5: return { text: "No asistió", color: "red" }
      default: return { text: "Desconocido", color: "gray" }
    }
  }

  // Función para formatear la hora de la cita
  const formatAppointmentTime = (fechaHora) => {
    const date = new Date(fechaHora)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
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

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

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
    .map(app => new Date(app.fecha_hora).getDate())

  // Add this new function to fetch patients
  const fetchPatients = async () => {
    setLoadingPatients(true)
    try {
      const response = await fetch(`/api/doctores/${doctorId}/pacientes`)
      if (!response.ok) {
        throw new Error('Error al cargar pacientes')
      }
      const data = await response.json()
      setPatients(data)
    } catch (err) {
      console.error('Error al cargar pacientes:', err)
      setError(err.message)
    } finally {
      setLoadingPatients(false)
    }
  }

  // Add this new function to handle new appointment creation
  const handleCreateAppointment = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validate appointment time
    const appointmentTime = new Date(newAppointment.fecha_hora)
    const hours = appointmentTime.getHours()
    const minutes = appointmentTime.getMinutes()

    if (hours < 8 || (hours === 20 && minutes > 0) || hours > 20) {
      setFormError("Las citas deben programarse entre las 8:00 AM y las 8:00 PM")
      return
    }

    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAppointment,
          doctor_id: doctorId
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear la cita')
      }

      const data = await response.json()
      
      // Find the selected patient's data
      const selectedPatient = patients.find(p => p.paciente_id === parseInt(newAppointment.paciente_id))
      
      // Refresh appointments list with patient name included
      const updatedAppointments = [...appointments, {
        ...newAppointment,
        cita_id: data.cita_id,
        doctor_id: doctorId,
        creado_el: new Date().toISOString(),
        paciente_nombre: `${selectedPatient.primer_nombre} ${selectedPatient.apellido_paterno}`
      }]
      setAppointments(updatedAppointments)
      
      // Reset form and close modal
      setNewAppointment({
        paciente_id: "",
        fecha_hora: "",
        notas: "",
        estado_id: 1
      })
      setShowNewAppointmentModal(false)
    } catch (err) {
      console.error('Error al crear cita:', err)
      setFormError(err.message)
    }
  }

  // Modify the useEffect to fetch patients when either modal opens
  useEffect(() => {
    if (showNewAppointmentModal || showEditAppointmentModal) {
      fetchPatients()
    }
  }, [showNewAppointmentModal, showEditAppointmentModal])

  // Add this new function to handle appointment editing
  const handleEditAppointment = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validate appointment time
    const appointmentTime = new Date(editingAppointment.fecha_hora)
    const hours = appointmentTime.getHours()
    const minutes = appointmentTime.getMinutes()

    if (hours < 8 || (hours === 20 && minutes > 0) || hours > 20) {
      setFormError("Las citas deben programarse entre las 8:00 AM y las 8:00 PM")
      return
    }

    try {
      const response = await fetch('/api/citas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cita_id: editingAppointment.cita_id,
          paciente_id: editingAppointment.paciente_id,
          doctor_id: doctorId,
          fecha_hora: editingAppointment.fecha_hora,
          estado_id: editingAppointment.estado_id,
          notas: editingAppointment.notas
        })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la cita')
      }

      // Update the appointments list
      const updatedAppointments = appointments.map(app => 
        app.cita_id === editingAppointment.cita_id ? editingAppointment : app
      )
      setAppointments(updatedAppointments)
      
      // Close modal and reset state
      setShowEditAppointmentModal(false)
      setEditingAppointment(null)
    } catch (err) {
      console.error('Error al actualizar cita:', err)
      setFormError(err.message)
    }
  }

  // Update the handleOpenEditModal function
  const handleOpenEditModal = (appointment) => {
    // Format the date for the datetime-local input using local time
    const date = new Date(appointment.fecha_hora)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`
    
    setEditingAppointment({
      ...appointment,
      fecha_hora: formattedDate
    })
    setShowEditAppointmentModal(true)
    fetchPatients() // Ensure patients are loaded when opening the modal
  }

  // Add this new function to handle appointment confirmation
  const handleConfirmAppointment = async (appointment) => {
    try {
      // Format the date to match the database format (YYYY-MM-DD HH:mm:ss)
      const formattedDate = new Date(appointment.fecha_hora)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19)

      const response = await fetch('/api/citas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cita_id: appointment.cita_id,
          paciente_id: appointment.paciente_id,
          doctor_id: doctorId,
          fecha_hora: formattedDate,
          estado_id: 2, // Change to "Confirmada"
          notas: appointment.notas
        })
      })

      if (!response.ok) {
        throw new Error('Error al confirmar la cita')
      }

      // Update the appointments list
      const updatedAppointments = appointments.map(app => 
        app.cita_id === appointment.cita_id 
          ? { ...app, estado_id: 2 }
          : app
      )
      setAppointments(updatedAppointments)
    } catch (err) {
      console.error('Error al confirmar cita:', err)
      setError(err.message)
    }
  }

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect to login page
    router.push('/login')
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
              <h1 className="text-xl font-bold text-slate-800">Calendario de Citas</h1>
              <p className="text-sm text-slate-600">{loading ? 'Cargando...' : error ? 'Error al cargar datos' : doctorName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Hoy: {new Date().toLocaleDateString("es-ES")}</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Plus size={16} />
              <span>Nueva Cita</span>
            </motion.button>
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
              href="/dashboard/doctor"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <Activity size={20} />
              <span className="font-medium">Dashboard</span>
            </motion.a>

            <motion.a
              href="/dashboard/doctor/patients"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
            >
              <Users size={20} />
              <span className="font-medium">Pacientes</span>
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-sky-100 text-sky-700 shadow-sm"
            >
              <CalendarIcon size={20} />
              <span className="font-medium">Calendario</span>
            </motion.div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={handleMonthPicker}
                      className="text-xl font-bold text-slate-800 hover:text-sky-600 transition-colors"
                    >
                      {monthNames[currentMonth.getMonth()]}
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
                  <div className="relative">
                    <button
                      onClick={handleYearPicker}
                      className="text-xl font-bold text-slate-800 hover:text-sky-600 transition-colors"
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
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateYear(-1)}
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth(-1)}
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth(1)}
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateYear(1)}
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-3 text-sm rounded-lg transition-all duration-200 ${
                      !day.isCurrentMonth
                        ? "text-slate-300"
                        : isToday(day.date)
                          ? "bg-sky-500 text-white font-bold"
                          : isSelected(day.date)
                            ? "bg-sky-100 text-sky-700 font-semibold"
                            : daysWithAppointments.includes(day.date.getDate())
                              ? "ring-2 ring-sky-400 bg-sky-50 text-sky-800 font-semibold"
                              : "text-slate-700 hover:bg-sky-50"
                    }`}
                  >
                    {day.date.getDate()}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Appointments for Selected Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Citas del {selectedDate.toLocaleDateString("es-ES")}
                </h3>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">{getAppointmentsForSelectedDate().length} citas</span>
              </div>
              <div className="mb-2">
                <button
                  className="text-sm italic text-slate-600 underline hover:text-sky-800 transition-colors"
                  onClick={() => setShowAllAppointments(true)}
                >
                  Total de citas: {appointments.length}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-slate-600">Cargando citas...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : getAppointmentsForSelectedDate().length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-600">No hay citas programadas para este día</p>
                  </div>
                ) : (
                  getAppointmentsForSelectedDate().map((appointment, index) => {
                    const status = getAppointmentStatus(appointment.estado_id)
                    return (
                      <motion.div
                        key={appointment.cita_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          status.color === "green"
                            ? "bg-green-50 border-green-200"
                            : status.color === "yellow"
                              ? "bg-yellow-50 border-yellow-200"
                              : status.color === "red"
                                ? "bg-red-50 border-red-200"
                                : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-800">
                            {formatAppointmentTime(appointment.fecha_hora)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              status.color === "green"
                                ? "bg-green-100 text-green-800"
                                : status.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status.color === "red"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {status.text}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1">
                          {appointment.paciente_nombre}
                        </h4>
                        <p className="text-sm text-slate-600 mb-1">{appointment.notas || "Sin notas"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            30 min
                          </span>
                          <div className="flex space-x-1">
                            {appointment.estado_id !== 3 && appointment.estado_id !== 5 && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => handleOpenEditModal(appointment)}
                                  className="px-2 py-1 bg-sky-100 text-sky-800 rounded text-xs hover:bg-sky-200 transition-colors"
                                >
                                  Editar
                                </motion.button>
                                {appointment.estado_id === 1 && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleConfirmAppointment(appointment)}
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors"
                                  >
                                    Confirmar
                                  </motion.button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modal de todas las citas */}
      {showAllAppointments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-xl"
              onClick={() => setShowAllAppointments(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Todas las citas</h2>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {appointments
                .slice()
                .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
                .map((appointment) => {
                  const status = getAppointmentStatus(appointment.estado_id)
                  return (
                    <div key={appointment.cita_id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-800 mr-2">
                          {formatAppointmentTime(appointment.fecha_hora)}
                        </span>
                        <span className="text-slate-600">{new Date(appointment.fecha_hora).toLocaleDateString('es-ES')}</span>
                        <span className="ml-2 text-sky-700 font-medium">{appointment.paciente_nombre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status.color === "green"
                            ? "bg-green-100 text-green-800"
                            : status.color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : status.color === "red"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}>
                          {status.text}
                        </span>
                        <span className="text-xs text-slate-500">{appointment.notas || "Sin notas"}</span>
                      </div>
                    </div>
                  )
                })}
              {appointments.length === 0 && (
                <div className="text-center text-slate-500 py-8">No hay citas registradas</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add this new modal component before the closing div of the main component */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500"
              onClick={() => setShowNewAppointmentModal(false)}
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 mb-4">Nueva Cita</h2>
            
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Paciente
                </label>
                <select
                  value={newAppointment.paciente_id}
                  onChange={(e) => setNewAppointment({...newAppointment, paciente_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {loadingPatients ? (
                    <option disabled>Cargando pacientes...</option>
                  ) : (
                    patients.map((patient) => (
                      <option key={patient.paciente_id} value={patient.paciente_id}>
                        {patient.primer_nombre} {patient.apellido_paterno}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={newAppointment.fecha_hora}
                  onChange={(e) => setNewAppointment({...newAppointment, fecha_hora: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Horario disponible: 8:00 AM - 8:00 PM
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={newAppointment.notas}
                  onChange={(e) => setNewAppointment({...newAppointment, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  rows="3"
                  placeholder="Agregar notas sobre la cita..."
                />
              </div>

              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Crear Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add the edit appointment modal before the closing div of the main component */}
      {showEditAppointmentModal && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500"
              onClick={() => {
                setShowEditAppointmentModal(false)
                setEditingAppointment(null)
              }}
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 mb-4">Editar Cita</h2>
            
            <form onSubmit={handleEditAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Paciente
                </label>
                <select
                  value={editingAppointment.paciente_id}
                  onChange={(e) => setEditingAppointment({...editingAppointment, paciente_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  required
                >
                  {patients.map((patient) => (
                    <option key={patient.paciente_id} value={patient.paciente_id}>
                      {patient.primer_nombre} {patient.apellido_paterno}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={editingAppointment.fecha_hora}
                  onChange={(e) => setEditingAppointment({...editingAppointment, fecha_hora: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Horario disponible: 8:00 AM - 8:00 PM
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={editingAppointment.estado_id}
                  onChange={(e) => setEditingAppointment({...editingAppointment, estado_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  required
                >
                  <option value={1}>Programada</option>
                  <option value={2}>Confirmada</option>
                  <option value={3}>Cancelada</option>
                  <option value={4}>Completada</option>
                  <option value={5}>No asistió</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={editingAppointment.notas}
                  onChange={(e) => setEditingAppointment({...editingAppointment, notas: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  rows="3"
                  placeholder="Agregar notas sobre la cita..."
                />
              </div>

              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAppointmentModal(false)
                    setEditingAppointment(null)
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
