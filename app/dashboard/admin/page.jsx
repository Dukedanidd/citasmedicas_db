"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Modal from "../../../components/ui/Modal"
import DoctorForm from "../../../components/ui/DoctorForm"
import PatientForm from "../../../components/ui/PatientForm"
import { useRouter } from "next/navigation"
import {
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Stethoscope,
  UserPlus,
  Trash2,
  Edit,
  Filter,
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("doctors") // doctors, patients, appointments
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  
  const [doctores, setDoctores] = useState([
    { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología", pacientes: 45, citas: 12 },
    { id: 2, nombre: "Dra. María García", especialidad: "Pediatría", pacientes: 60, citas: 8 },
    { id: 3, nombre: "Dr. Carlos López", especialidad: "Dermatología", pacientes: 30, citas: 5 },
  ])

  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    // Aquí podrías verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        
        if (!data.authenticated || data.user?.rol !== 'admin') {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('/api/pacientes')
        const data = await response.json()
        setPacientes(data)
      } catch (error) {
        console.error('Error al obtener pacientes:', error)
      }
    }

    fetchPacientes()
  }, [])

  const handleLogout = () => {
    router.push("/")
  }

  const handleAddDoctor = (newDoctor) => {
    const doctorWithId = {
      ...newDoctor,
      id: doctores.length + 1,
      pacientes: 0,
      citas: 0
    }
    setDoctores([...doctores, doctorWithId])
    setIsDoctorModalOpen(false)
  }

  const handleAddPatient = (newPatient) => {
    const patientWithId = {
      ...newPatient,
      id: pacientes.length + 1,
      ultimaCita: new Date().toISOString().split('T')[0]
    }
    setPacientes([...pacientes, patientWithId])
    setIsPatientModalOpen(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "doctors":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Gestión de Doctores</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg"
                  onClick={() => setIsDoctorModalOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agregar Doctor
                </motion.button>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar doctores..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pacientes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Citas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctores.map((doctor) => (
                      <tr key={doctor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-sky-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doctor.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.especialidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.pacientes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.citas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case "patients":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Gestión de Pacientes</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg"
                  onClick={() => setIsPatientModalOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agregar Paciente
                </motion.button>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar pacientes..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre Completo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Nacimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sexo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pacientes.map((paciente) => (
                      <tr key={paciente.paciente_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-sky-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {`${paciente.primer_nombre} ${paciente.segundo_nombre || ''} ${paciente.apellido_paterno} ${paciente.apellido_materno || ''}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paciente.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paciente.sexo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paciente.doctor_especialidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paciente.doctor_especialidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case "appointments":
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Gestión de Citas</h2>
            {/* Aquí irá el contenido de gestión de citas */}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <Stethoscope className="h-8 w-8 text-sky-500" />
                <span className="text-xl font-bold text-slate-800">
                  MediCare Pro
                </span>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Bell className="h-6 w-6 text-slate-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-slate-600"
                >
                  <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                    A
                  </div>
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Doctores</p>
                <h3 className="text-2xl font-bold text-slate-800">24</h3>
              </div>
              <div className="h-12 w-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-sky-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Pacientes</p>
                <h3 className="text-2xl font-bold text-slate-800">1,234</h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Citas Hoy</p>
                <h3 className="text-2xl font-bold text-slate-800">42</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Reportes Pendientes</p>
                <h3 className="text-2xl font-bold text-slate-800">15</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex space-x-1 p-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("doctors")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === "doctors"
                  ? "bg-sky-500 text-white"
                  : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              Doctores
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("patients")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === "patients"
                  ? "bg-sky-500 text-white"
                  : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              Pacientes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab("appointments")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === "appointments"
                  ? "bg-sky-500 text-white"
                  : "text-slate-600 hover:bg-sky-50"
              }`}
            >
              Citas
            </motion.button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Modales */}
      <Modal 
        isOpen={isDoctorModalOpen} 
        onClose={() => setIsDoctorModalOpen(false)}
        title="Agregar Nuevo Doctor"
      >
        <DoctorForm onClose={() => setIsDoctorModalOpen(false)} onSubmit={handleAddDoctor} />
      </Modal>

      <Modal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)}
        title="Agregar Nuevo Paciente"
      >
        <PatientForm onClose={() => setIsPatientModalOpen(false)} onSubmit={handleAddPatient} />
      </Modal>
    </div>
  )
}
