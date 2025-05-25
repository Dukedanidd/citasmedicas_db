"use client"

import { useState } from "react"
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

export default function PatientRecords() {
  const [activeTab, setActiveTab] = useState("general")

  const patientData = {
    general: {
      nombre: "Juan Pérez",
      edad: 35,
      genero: "Masculino",
      tipoSangre: "O+",
      alergias: ["Penicilina", "Polen"],
      condiciones: ["Hipertensión"],
    },
    historial: [
      {
        fecha: "2024-03-15",
        doctor: "Dr. Carlos López",
        diagnostico: "Control de presión arterial",
        tratamiento: "Continuar medicación actual",
      },
      {
        fecha: "2024-02-20",
        doctor: "Dra. María García",
        diagnostico: "Resfriado común",
        tratamiento: "Reposo y medicamentos",
      },
    ],
    medicamentos: [
      {
        nombre: "Losartan",
        dosis: "50mg",
        frecuencia: "1 vez al día",
        inicio: "2024-01-15",
      },
      {
        nombre: "Aspirina",
        dosis: "100mg",
        frecuencia: "1 vez al día",
        inicio: "2024-02-01",
      },
    ],
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
              href="/dashboard/patient"
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
                  onClick={() => setActiveTab("medicamentos")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === "medicamentos"
                      ? "bg-sky-500 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  Medicamentos
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
                          <span className="font-medium">Tipo de Sangre:</span> {patientData.general.tipoSangre}
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Información Médica</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-slate-600 mb-1">Alergias:</p>
                          <div className="flex flex-wrap gap-2">
                            {patientData.general.alergias.map((alergia, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                              >
                                {alergia}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-slate-600 mb-1">Condiciones:</p>
                          <div className="flex flex-wrap gap-2">
                            {patientData.general.condiciones.map((condicion, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                              >
                                {condicion}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "historial" && (
                <div className="space-y-4">
                  {patientData.historial.map((registro, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-sky-50 border border-sky-200 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-slate-800 font-medium">{registro.doctor}</p>
                          <p className="text-slate-600 text-sm">{registro.fecha}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-700">
                          <span className="font-medium">Diagnóstico:</span> {registro.diagnostico}
                        </p>
                        <p className="text-slate-700">
                          <span className="font-medium">Tratamiento:</span> {registro.tratamiento}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "medicamentos" && (
                <div className="space-y-4">
                  {patientData.medicamentos.map((medicamento, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-sky-50 border border-sky-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{medicamento.nombre}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-slate-600">
                              <span className="font-medium">Dosis:</span> {medicamento.dosis}
                            </p>
                            <p className="text-slate-600">
                              <span className="font-medium">Frecuencia:</span> {medicamento.frecuencia}
                            </p>
                            <p className="text-slate-600">
                              <span className="font-medium">Inicio:</span> {medicamento.inicio}
                            </p>
                          </div>
                        </div>
                        <div className="p-2 bg-sky-100 rounded-lg">
                          <Pill className="text-sky-600" size={24} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
} 