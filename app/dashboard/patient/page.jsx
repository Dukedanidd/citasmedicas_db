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
} from "lucide-react"
import Link from "next/link"

export default function PatientDashboardOverview() {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Simular ID del paciente (esto debería venir de la autenticación)
  const pacienteId = 1

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pacientes?pacienteId=${pacienteId}`)
        if (!response.ok) throw new Error('Error al cargar datos del paciente')
        const data = await response.json()
        setPatient(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-slate-600">Cargando datos del paciente...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Error: {error}</span>
        </div>
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
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 transition-all duration-300"
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
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Bienvenido, {patient?.primer_nombre} {patient?.apellido_paterno}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-sky-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Información Personal</h3>
                  <div className="space-y-2">
                    <p className="text-slate-600">
                      <span className="font-medium">Nombre completo:</span>{' '}
                      {`${patient?.primer_nombre || ''} ${patient?.segundo_nombre || ''} ${patient?.apellido_paterno || ''} ${patient?.apellido_materno || ''}`}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">Email:</span> {patient?.email}
                    </p>
                  </div>
                </div>

                <div className="bg-sky-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Información Médica</h3>
                  <div className="space-y-2">
                    <p className="text-slate-600">
                      <span className="font-medium">Doctor asignado:</span>{' '}
                      Especialidad: {patient?.doctor_especialidad}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600"
            >
              <p>Selecciona una opción del menú lateral para gestionar tus citas o ver tu expediente médico.</p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
} 