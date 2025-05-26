"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

export default function PatientCalendar() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentReason, setAppointmentReason] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: "2024-03-20",
      time: "09:00",
      doctor: "Dr. Juan Pérez",
      reason: "Consulta de rutina",
      status: "scheduled"
    },
    {
      id: 2,
      date: "2024-03-25",
      time: "14:30",
      doctor: "Dra. María García",
      reason: "Seguimiento",
      status: "upcoming"
    }
  ])

  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setShowAppointmentModal(false)
  }

  const handleAppointmentCancel = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId))
  }

  const handleNewAppointment = () => {
    if (appointmentReason && selectedTime) {
      const newAppointment = {
        id: Date.now(),
        date: selectedDate,
        time: selectedTime,
        doctor: "Dr. Juan Pérez", // Esto vendría de la BD
        reason: appointmentReason,
        status: "scheduled"
      }
      setAppointments([...appointments, newAppointment])
      setShowAppointmentModal(false)
      setAppointmentReason("")
      setSelectedTime("")
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

  // Lógica para colorear días (simplificada por ahora)
  const getDayClassName = (day) => {
    const hasAppointment = appointments.some(apt => apt.date === `2024-03-${day}`)
    // Lógica básica para "upcoming" - debería compararse con la fecha actual
    const isUpcoming = appointments.some(apt => 
      apt.date === `2024-03-${day}` && apt.status === "upcoming"
    )

    if (hasAppointment) {
      return isUpcoming ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
    }
    return "bg-slate-50 text-slate-700"
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
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <Bell size={20} />
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

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  // Lógica para colorear días (simplificada por ahora)
                  const hasAppointment = appointments.some(apt => apt.date === `2024-03-${day}`)
                  const isUpcoming = appointments.some(apt => 
                    apt.date === `2024-03-${day}` && apt.status === "upcoming"
                  )
                  
                  const dayClassName = getDayClassName(day)

                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDateSelect(`2024-03-${day}`)}
                      className={`p-4 rounded-lg text-center ${dayClassName}`}
                    >
                      {day}
                    </motion.button>
                  )
                })}
              </div>

              {/* Selected Date Appointments */}
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Citas para {selectedDate}
                  </h3>
                  <div className="space-y-3">
                    {appointments
                      .filter(apt => apt.date === selectedDate)
                      .map(appointment => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-sky-50 border border-sky-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-slate-800 font-medium">
                                {appointment.time} - {appointment.doctor}
                              </p>
                              <p className="text-slate-600 text-sm mt-1">
                                {appointment.reason}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAppointmentCancel(appointment.id)}
                              className="p-2 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
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
                disabled={!appointmentReason || !selectedTime}
                className="w-full py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Cita
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 