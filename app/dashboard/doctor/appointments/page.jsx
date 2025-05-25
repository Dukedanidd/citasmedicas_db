"use client"

import { useState } from "react"
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
} from "lucide-react"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const appointments = [
    { id: 1, time: "09:00", patient: "Ana García", type: "Consulta General", duration: "30 min", status: "confirmada" },
    {
      id: 2,
      time: "09:30",
      patient: "Carlos López",
      type: "Control Diabetes",
      duration: "45 min",
      status: "pendiente",
    },
    {
      id: 3,
      time: "10:15",
      patient: "María Rodríguez",
      type: "Seguimiento Asma",
      duration: "30 min",
      status: "confirmada",
    },
    {
      id: 4,
      time: "11:00",
      patient: "José Martínez",
      type: "Terapia Física",
      duration: "60 min",
      status: "confirmada",
    },
    {
      id: 5,
      time: "14:00",
      patient: "Laura Sánchez",
      type: "Consulta Neurología",
      duration: "45 min",
      status: "pendiente",
    },
    { id: 6, time: "15:00", patient: "Pedro Gómez", type: "Chequeo General", duration: "30 min", status: "confirmada" },
    { id: 7, time: "16:00", patient: "Carmen Ruiz", type: "Control Anemia", duration: "30 min", status: "cancelada" },
  ]

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
              <p className="text-sm text-slate-600">Dr. María González</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Hoy: {new Date().toLocaleDateString("es-ES")}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <Bell size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Plus size={16} />
              <span>Nueva Cita</span>
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
                <h2 className="text-xl font-bold text-slate-800">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className="flex space-x-2">
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
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">{appointments.length} citas</span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      appointment.status === "confirmada"
                        ? "bg-green-50 border-green-200"
                        : appointment.status === "pendiente"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">{appointment.time}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "confirmada"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">{appointment.patient}</h4>
                    <p className="text-sm text-slate-600 mb-1">{appointment.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {appointment.duration}
                      </span>
                      <div className="flex space-x-1">
                        {appointment.status !== "cancelada" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="px-2 py-1 bg-sky-100 text-sky-800 rounded text-xs hover:bg-sky-200 transition-colors"
                            >
                              Editar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              Confirmar
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
