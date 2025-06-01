"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, User, Bell, Stethoscope, LogOut, Users, Calendar, Activity } from "lucide-react"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      } catch (err) {
        console.error('Error al cargar datos del doctor:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [])

  const patients = [
    { id: 1, name: "Ana García", age: 45, condition: "Hipertensión", lastVisit: "2024-01-15", status: "Estable" },
    { id: 2, name: "Carlos López", age: 32, condition: "Diabetes Tipo 2", lastVisit: "2024-01-14", status: "Control" },
    { id: 3, name: "María Rodríguez", age: 28, condition: "Asma", lastVisit: "2024-01-13", status: "Mejoría" },
    { id: 4, name: "José Martínez", age: 55, condition: "Artritis", lastVisit: "2024-01-12", status: "Tratamiento" },
    { id: 5, name: "Laura Sánchez", age: 38, condition: "Migraña", lastVisit: "2024-01-11", status: "Seguimiento" },
    { id: 6, name: "Pedro Gómez", age: 42, condition: "Hipertensión", lastVisit: "2024-01-10", status: "Estable" },
    { id: 7, name: "Carmen Ruiz", age: 29, condition: "Anemia", lastVisit: "2024-01-09", status: "Mejoría" },
    { id: 8, name: "Roberto Silva", age: 48, condition: "Colesterol Alto", lastVisit: "2024-01-08", status: "Control" },
  ]

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300"
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
                  {patients.filter((p) => p.status === "Estable").length}
                </p>
                <p className="text-sm text-slate-600">Estables</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {patients.filter((p) => p.status === "Control").length}
                </p>
                <p className="text-sm text-slate-600">En Control</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-sky-100 shadow-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {patients.filter((p) => p.status === "Mejoría").length}
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
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
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
                    <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                    <p className="text-sm text-slate-600">{patient.age} años</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Condición:</span>
                    <span className="text-sm font-medium text-slate-800">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Última visita:</span>
                    <span className="text-sm text-slate-800">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Estado:</span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        patient.status === "Estable"
                          ? "bg-green-100 text-green-800"
                          : patient.status === "Control"
                            ? "bg-yellow-100 text-yellow-800"
                            : patient.status === "Mejoría"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {patient.status}
                    </span>
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
                    className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                  >
                    Nueva Cita
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
