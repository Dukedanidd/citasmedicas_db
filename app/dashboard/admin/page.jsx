"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Modal from "../../../components/ui/Modal"
import DoctorForm from "../../../components/ui/DoctorForm"
import PatientForm from "../../../components/ui/PatientForm"
import CitaForm from "../../../components/ui/CitaForm"
import BitacoraForm from "../../../components/ui/BitacoraForm"
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
  Clock,
  History,
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("doctors") // doctors, patients, appointments
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  
  const [doctores, setDoctores] = useState([])
  const [filteredDoctores, setFilteredDoctores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [doctorCurrentPage, setDoctorCurrentPage] = useState(1)
  const [doctorTotalPages, setDoctorTotalPages] = useState(1)

  const [pacientes, setPacientes] = useState([])
  const [filteredPacientes, setFilteredPacientes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5

  const [citas, setCitas] = useState([])
  const [filteredCitas, setFilteredCitas] = useState([])
  const [citaSearchTerm, setCitaSearchTerm] = useState('')
  const [citaCurrentPage, setCitaCurrentPage] = useState(1)
  const [citaTotalPages, setCitaTotalPages] = useState(1)
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const [stats, setStats] = useState({
    totalDoctores: 0,
    totalPacientes: 0,
    citasHoy: 0,
    citasProgramadas: 0
  })

  const [isBitacoraModalOpen, setIsBitacoraModalOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Aquí podrías verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const userId = sessionStorage.getItem('user_id')
        if (!userId) {
          router.push('/login')
          return
        }

        const res = await fetch('/api/auth/check', {
          headers: {
            'user-id': userId
          }
        })
        const data = await res.json()
        
        if (!data.authenticated || data.user?.rol !== 'admin') {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const userId = sessionStorage.getItem('user_id')
        if (!userId) {
          throw new Error('No se encontró información de sesión')
        }

        // Fetch doctores
        const doctoresRes = await fetch('/api/doctores')
        if (!doctoresRes.ok) {
          throw new Error('Error al cargar doctores')
        }
        const doctoresData = await doctoresRes.json()

        // Fetch pacientes
        const pacientesRes = await fetch('/api/pacientes')
        if (!pacientesRes.ok) {
          throw new Error('Error al cargar pacientes')
        }
        const pacientesData = await pacientesRes.json()

        // Fetch citas
        const citasRes = await fetch('/api/citas')
        if (!citasRes.ok) {
          throw new Error('Error al cargar citas')
        }
        const citasData = await citasRes.json()

        // Mapear los doctores a un objeto para fácil acceso
        const doctoresMap = doctoresData.reduce((acc, doctor) => {
          acc[doctor.doctor_id] = doctor
          return acc
        }, {})

        // Añadir la información del doctor a cada paciente
        const pacientesConDoctores = pacientesData.map(paciente => ({
          ...paciente,
          doctor: paciente.doctor_id ? doctoresMap[paciente.doctor_id] : null
        }))

        // Añadir información del doctor y paciente a cada cita
        const citasConInfo = citasData.map(cita => ({
          ...cita,
          doctor: doctoresMap[cita.doctor_id],
          paciente: pacientesConDoctores.find(p => p.paciente_id === cita.paciente_id)
        }))

        // Calcular citas de hoy
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const citasHoy = citasConInfo.filter(cita => {
          const citaDate = new Date(cita.fecha_hora)
          return citaDate >= today && citaDate < tomorrow
        }).length

        // Calcular citas programadas (estado_id = 1)
        const citasProgramadas = citasConInfo.filter(cita => cita.estado_id === 1).length

        setDoctores(doctoresData)
        setFilteredDoctores(doctoresData)
        setDoctorTotalPages(Math.ceil(doctoresData.length / itemsPerPage))

        setPacientes(pacientesConDoctores)
        setFilteredPacientes(pacientesConDoctores)
        setTotalPages(Math.ceil(pacientesConDoctores.length / itemsPerPage))

        setCitas(citasConInfo)
        setFilteredCitas(citasConInfo)
        setCitaTotalPages(Math.ceil(citasConInfo.length / itemsPerPage))

        // Actualizar estadísticas
        setStats({
          totalDoctores: doctoresData.length,
          totalPacientes: pacientesData.length,
          citasHoy: citasHoy,
          citasProgramadas: citasProgramadas
        })

      } catch (error) {
        console.error('Error al cargar datos:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = pacientes.filter(paciente => {
      const fullName = `${paciente.primer_nombre} ${paciente.segundo_nombre || ''} ${paciente.apellido_paterno} ${paciente.apellido_materno || ''}`.toLowerCase()
      const email = paciente.email.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      
      return fullName.includes(searchLower) || email.includes(searchLower)
    })
    
    setFilteredPacientes(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, pacientes])

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredPacientes.slice(startIndex, endIndex)
  }

  useEffect(() => {
    const filtered = doctores.filter(doctor => {
      const fullName = `${doctor.primer_nombre} ${doctor.segundo_nombre || ''} ${doctor.apellido_paterno} ${doctor.apellido_materno || ''}`.toLowerCase()
      const especialidad = doctor.especialidad?.toLowerCase() || ''
      const searchLower = doctorSearchTerm.toLowerCase()
      
      return fullName.includes(searchLower) || especialidad.includes(searchLower)
    })
    
    setFilteredDoctores(filtered)
    setDoctorTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setDoctorCurrentPage(1) // Reset to first page when searching
  }, [doctorSearchTerm, doctores])

  const getCurrentPageDoctors = () => {
    const startIndex = (doctorCurrentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredDoctores.slice(startIndex, endIndex)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleConfirmDeleteDoctor = (doctorId) => {
    setConfirmAction({ type: 'deleteDoctor', id: doctorId });
    setShowConfirmModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`/api/doctores/${doctorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el doctor');
      }

      // Actualizar el estado local eliminando el doctor
      setDoctores(prev => prev.filter(d => d.doctor_id !== doctorId));
      setFilteredDoctores(prev => prev.filter(d => d.doctor_id !== doctorId));
      setDoctorTotalPages(prev => Math.ceil((prev * itemsPerPage - 1) / itemsPerPage));
      
      setShowConfirmModal(false);
      setSuccessMessage('Doctor eliminado exitosamente');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error al eliminar doctor:', error);
      setError(error.message);
    }
  }

  const handleConfirmDeletePatient = (pacienteId) => {
    setConfirmAction({ type: 'deletePatient', id: pacienteId });
    setShowConfirmModal(true);
  };

  const handleDeletePatient = async (pacienteId) => {
    try {
      const response = await fetch(`/api/pacientes?pacienteId=${pacienteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el paciente');
      }

      // Actualizar el estado local eliminando el paciente
      setPacientes(prev => prev.filter(p => p.paciente_id !== pacienteId));
      setFilteredPacientes(prev => prev.filter(p => p.paciente_id !== pacienteId));
      
      // Calcular el nuevo número total de páginas
      const newTotalPages = Math.ceil((filteredPacientes.length - 1) / itemsPerPage);
      setTotalPages(newTotalPages);
      
      // Si la página actual es mayor que el nuevo total de páginas, ajustar a la última página
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
      
      setShowConfirmModal(false);
      setSuccessMessage('Paciente eliminado exitosamente');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      setError(error.message);
    }
  };

  const handleDeleteCita = async (citaId) => {
    setConfirmAction({ type: 'deleteCita', id: citaId })
    setShowConfirmModal(true)
  }

  const handleAddDoctor = async (doctorData) => {
    try {
      const response = await fetch('/api/doctores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el doctor')
      }

      const newDoctor = await response.json()
      setDoctores(prev => [...prev, newDoctor])
      setFilteredDoctores(prev => [...prev, newDoctor])
      setDoctorTotalPages(prev => Math.ceil((prev * itemsPerPage + 1) / itemsPerPage))
      setIsDoctorModalOpen(false)
      setSuccessMessage('Doctor creado exitosamente')
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEditDoctor = async (doctorData) => {
    try {
      const response = await fetch(`/api/doctores/${doctorData.doctor_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primer_nombre: doctorData.primer_nombre,
          segundo_nombre: doctorData.segundo_nombre,
          apellido_paterno: doctorData.apellido_paterno,
          apellido_materno: doctorData.apellido_materno,
          password: doctorData.password,
          especialidad: doctorData.especialidad,
          consultorio_id: doctorData.consultorio_id || null
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el doctor')
      }

      // Obtener los datos actualizados del doctor
      const getResponse = await fetch(`/api/doctores/${doctorData.doctor_id}`)
      if (!getResponse.ok) {
        throw new Error('Error al obtener los datos actualizados del doctor')
      }

      const updatedDoctor = await getResponse.json()
      setDoctores(prev => prev.map(d => d.doctor_id === updatedDoctor.doctor_id ? updatedDoctor : d))
      setFilteredDoctores(prev => prev.map(d => d.doctor_id === updatedDoctor.doctor_id ? updatedDoctor : d))
      setIsDoctorModalOpen(false)
      setSelectedDoctor(null)
      setSuccessMessage('Doctor actualizado exitosamente')
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleAddPatient = async (newPatient) => {
    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedPacientes = [...pacientes, {
          ...data,
          doctor: doctores.find(d => d.doctor_id === data.doctor_id) || null
        }]
        setPacientes(updatedPacientes)
        setFilteredPacientes(updatedPacientes)
        setTotalPages(Math.ceil(updatedPacientes.length / itemsPerPage))
        setIsPatientModalOpen(false)
        setSuccessMessage('Paciente creado exitosamente')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      } else {
        const error = await response.json()
        alert(error.message || 'Error al crear el paciente')
      }
    } catch (error) {
      console.error('Error al crear paciente:', error)
      alert('Error al crear el paciente')
    }
  }

  const handleEditPatient = (paciente) => {
    setEditingPatient(paciente);
    setIsPatientModalOpen(true);
  };

  const handleUpdatePatient = async (updatedPatient) => {
    try {
      const response = await fetch('/api/pacientes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPacientes = pacientes.map(p => 
          p.paciente_id === data.paciente_id ? {
            ...data,
            doctor: doctores.find(d => d.doctor_id === data.doctor_id) || null
          } : p
        );
        setPacientes(updatedPacientes);
        setFilteredPacientes(updatedPacientes);
        setIsPatientModalOpen(false);
        setEditingPatient(null);
        setSuccessMessage('Paciente actualizado exitosamente');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el paciente');
      }
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      setError(error.message);
    }
  };

  const handlePatientSubmit = (patientData) => {
    if (editingPatient) {
      handleUpdatePatient({ ...editingPatient, ...patientData });
    } else {
      handleAddPatient(patientData);
    }
  };

  const handleClosePatientModal = () => {
    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  const openDoctorModal = async (doctor = null) => {
    if (doctor) {
      try {
        // Obtener los datos completos del doctor
        const response = await fetch(`/api/doctores/${doctor.doctor_id}`)
        if (!response.ok) {
          throw new Error('Error al obtener los datos del doctor')
        }
        const doctorData = await response.json()
        
        // Asegurarse de que todos los campos necesarios estén presentes
        const formattedDoctorData = {
          doctor_id: doctorData.doctor_id,
          primer_nombre: doctorData.primer_nombre || '',
          segundo_nombre: doctorData.segundo_nombre || '',
          apellido_paterno: doctorData.apellido_paterno || '',
          apellido_materno: doctorData.apellido_materno || '',
          email: doctorData.email || '',
          especialidad: doctorData.especialidad || '',
          consultorio: doctorData.consultorio || '',
          consultorio_id: doctorData.consultorio_id || null,
          password: '' // No prellenamos la contraseña por seguridad
        }
        setSelectedDoctor(formattedDoctorData)
      } catch (error) {
        console.error('Error al cargar los datos del doctor:', error)
        setError('Error al cargar los datos del doctor')
        return
      }
    } else {
      setSelectedDoctor(null)
    }
    setIsDoctorModalOpen(true)
  }

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false)
    setSelectedDoctor(null)
  }

  useEffect(() => {
    const filtered = citas.filter(cita => {
      const pacienteNombre = `${cita.paciente?.primer_nombre || ''} ${cita.paciente?.apellido_paterno || ''}`.toLowerCase()
      const doctorNombre = `${cita.doctor?.primer_nombre || ''} ${cita.doctor?.apellido_paterno || ''}`.toLowerCase()
      const searchLower = citaSearchTerm.toLowerCase()
      
      return pacienteNombre.includes(searchLower) || 
             doctorNombre.includes(searchLower) ||
             cita.notas?.toLowerCase().includes(searchLower)
    })
    
    setFilteredCitas(filtered)
    setCitaTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCitaCurrentPage(1)
  }, [citaSearchTerm, citas])

  const getCurrentPageCitas = () => {
    const startIndex = (citaCurrentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredCitas.slice(startIndex, endIndex)
  }

  const handleAddCita = async (citaData) => {
    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citaData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la cita');
      }

      const newCita = await response.json();
      
      // Encontrar el doctor y paciente correspondientes
      const doctor = doctores.find(d => d.doctor_id === newCita.doctor_id);
      const paciente = pacientes.find(p => p.paciente_id === newCita.paciente_id);

      // Crear la cita con toda la información necesaria
      const citaCompleta = {
        ...newCita,
        doctor: doctor || null,
        paciente: paciente || null
      };

      // Actualizar el estado
      const updatedCitas = [...citas, citaCompleta];
      setCitas(updatedCitas);
      setFilteredCitas(updatedCitas);
      
      // Calcular el nuevo número total de páginas
      const newTotalPages = Math.ceil(updatedCitas.length / itemsPerPage);
      setCitaTotalPages(newTotalPages);
      
      // Ir a la última página donde aparecerá la nueva cita
      setCitaCurrentPage(newTotalPages);
      
      setIsCitaModalOpen(false);
      setSuccessMessage('Cita creada exitosamente');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditCita = async (citaData) => {
    try {
      const response = await fetch('/api/citas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citaData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la cita')
      }

      setCitas(citas.map(c => c.cita_id === citaData.cita_id ? citaData : c))
      setIsCitaModalOpen(false)
      setSelectedCita(null)
      setSuccessMessage('Cita actualizada exitosamente')
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      setError(error.message)
    }
  }

  const openCitaModal = (cita = null) => {
    setSelectedCita(cita)
    setIsCitaModalOpen(true)
  }

  const closeCitaModal = () => {
    setIsCitaModalOpen(false)
    setSelectedCita(null)
  }

  const handleConfirmAction = async () => {
    try {
      switch (confirmAction.type) {
        case 'deleteDoctor':
          await handleDeleteDoctor(confirmAction.id);
          break;
        case 'deletePatient':
          await handleDeletePatient(confirmAction.id);
          break;
        case 'deleteCita':
          await handleDeleteCita(confirmAction.id);
          break;
        default:
          break;
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
      setError(error.message);
    }
  };

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
                  onClick={() => openDoctorModal()}
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
                    value={doctorSearchTerm}
                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
                  />
                </div>
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
                        Consultorio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          Cargando doctores...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredDoctores.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay doctores registrados
                        </td>
                      </tr>
                    ) : (
                      getCurrentPageDoctors().map((doctor) => (
                        <tr key={doctor.doctor_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                                <Stethoscope className="h-5 w-5 text-sky-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {`${doctor.primer_nombre} ${doctor.segundo_nombre || ''} ${doctor.apellido_paterno} ${doctor.apellido_materno || ''}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doctor.especialidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {console.log('Doctor data:', doctor)}
                            {doctor.consultorio || 'No asignado'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-sky-600 hover:text-sky-900"
                                onClick={() => openDoctorModal(doctor)}
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleConfirmDeleteDoctor(doctor.doctor_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Doctors */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDoctorCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={doctorCurrentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      doctorCurrentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDoctorCurrentPage(prev => Math.min(prev + 1, doctorTotalPages))}
                    disabled={doctorCurrentPage === doctorTotalPages}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      doctorCurrentPage === doctorTotalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Siguiente
                  </motion.button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{' '}
                      <span className="font-medium">
                        {filteredDoctores.length === 0 ? 0 : (doctorCurrentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium">
                        {Math.min(doctorCurrentPage * itemsPerPage, filteredDoctores.length)}
                      </span>{' '}
                      de{' '}
                      <span className="font-medium">{filteredDoctores.length}</span>{' '}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setDoctorCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={doctorCurrentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          doctorCurrentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Anterior
                      </motion.button>
                      {[...Array(doctorTotalPages)].map((_, index) => (
                        <motion.button
                          key={index + 1}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setDoctorCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            doctorCurrentPage === index + 1
                              ? 'z-10 bg-sky-50 border-sky-500 text-sky-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setDoctorCurrentPage(prev => Math.min(prev + 1, doctorTotalPages))}
                        disabled={doctorCurrentPage === doctorTotalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          doctorCurrentPage === doctorTotalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Siguiente
                      </motion.button>
                    </nav>
                  </div>
                </div>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
                  />
                </div>
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
                        Doctor Asignado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentPageData().map((paciente) => (
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
                          {paciente.doctor_id && paciente.doctor ? 
                            `Dr. ${paciente.doctor.primer_nombre} ${paciente.doctor.apellido_paterno}` : 
                            'No asignado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-sky-600 hover:text-sky-900"
                              onClick={() => handleEditPatient(paciente)}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleConfirmDeletePatient(paciente.paciente_id)}
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

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Siguiente
                  </motion.button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{' '}
                      <span className="font-medium">
                        {filteredPacientes.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredPacientes.length)}
                      </span>{' '}
                      de{' '}
                      <span className="font-medium">{filteredPacientes.length}</span>{' '}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Anterior
                      </motion.button>
                      {[...Array(totalPages)].map((_, index) => (
                        <motion.button
                          key={index + 1}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-sky-50 border-sky-500 text-sky-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Siguiente
                      </motion.button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "appointments":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Gestión de Citas</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg"
                  onClick={() => openCitaModal()}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agregar Cita
                </motion.button>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar citas..."
                    value={citaSearchTerm}
                    onChange={(e) => setCitaSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
                  />
                </div>
                <div className="w-48">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          Cargando citas...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredCitas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay citas registradas
                        </td>
                      </tr>
                    ) : (
                      getCurrentPageCitas().map((cita) => (
                        <tr key={cita.cita_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-sky-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {cita.paciente ? `${cita.paciente.primer_nombre} ${cita.paciente.apellido_paterno}` : 'Paciente no encontrado'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                                <Stethoscope className="h-5 w-5 text-sky-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {cita.doctor ? `Dr. ${cita.doctor.primer_nombre} ${cita.doctor.apellido_paterno}` : 'Doctor no encontrado'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(cita.fecha_hora).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              cita.estado_id === 1 ? 'bg-yellow-100 text-yellow-800' :
                              cita.estado_id === 2 ? 'bg-green-100 text-green-800' :
                              cita.estado_id === 3 ? 'bg-red-100 text-red-800' :
                              cita.estado_id === 4 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {cita.estado_id === 1 ? 'Programada' :
                               cita.estado_id === 2 ? 'Confirmada' :
                               cita.estado_id === 3 ? 'Cancelada' :
                               cita.estado_id === 4 ? 'Completada' :
                               'No asistió'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cita.notas || 'Sin notas'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-sky-600 hover:text-sky-900"
                                onClick={() => openCitaModal(cita)}
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteCita(cita.cita_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Citas */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCitaCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={citaCurrentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      citaCurrentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCitaCurrentPage(prev => Math.min(prev + 1, citaTotalPages))}
                    disabled={citaCurrentPage === citaTotalPages}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      citaCurrentPage === citaTotalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Siguiente
                  </motion.button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{' '}
                      <span className="font-medium">
                        {filteredCitas.length === 0 ? 0 : (citaCurrentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium">
                        {Math.min(citaCurrentPage * itemsPerPage, filteredCitas.length)}
                      </span>{' '}
                      de{' '}
                      <span className="font-medium">{filteredCitas.length}</span>{' '}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCitaCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={citaCurrentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          citaCurrentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Anterior
                      </motion.button>
                      {[...Array(citaTotalPages)].map((_, index) => (
                        <motion.button
                          key={index + 1}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setCitaCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            citaCurrentPage === index + 1
                              ? 'z-10 bg-sky-50 border-sky-500 text-sky-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setCitaCurrentPage(prev => Math.min(prev + 1, citaTotalPages))}
                        disabled={citaCurrentPage === citaTotalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          citaCurrentPage === citaTotalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Siguiente
                      </motion.button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsBitacoraModalOpen(true)}
                className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
              >
                <History size={20} />
              </motion.button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Doctores</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalDoctores}</h3>
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
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalPacientes}</h3>
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
                <h3 className="text-2xl font-bold text-slate-800">{stats.citasHoy}</h3>
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
                <p className="text-sm text-slate-600">Citas Programadas</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.citasProgramadas}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
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
        <div className="min-h-[600px]"> {/* Altura mínima para evitar saltos */}
        {renderTabContent()}
        </div>
      </div>

      {/* Modales */}
      <Modal 
        isOpen={isDoctorModalOpen} 
        onClose={closeDoctorModal}
        title={selectedDoctor ? "Editar Doctor" : "Agregar Nuevo Doctor"}
      >
        <DoctorForm 
          onClose={closeDoctorModal} 
          onSubmit={selectedDoctor ? handleEditDoctor : handleAddDoctor}
          initialData={selectedDoctor}
        />
      </Modal>

      <Modal 
        isOpen={isPatientModalOpen} 
        onClose={handleClosePatientModal}
        title={editingPatient ? "Editar Paciente" : "Agregar Nuevo Paciente"}
      >
        <PatientForm 
          onClose={handleClosePatientModal} 
          onSubmit={handlePatientSubmit}
          initialData={editingPatient}
          doctores={doctores}
        />
      </Modal>

      <Modal 
        isOpen={isCitaModalOpen} 
        onClose={closeCitaModal}
        title={selectedCita ? "Editar Cita" : "Agregar Nueva Cita"}
      >
        <CitaForm 
          onClose={closeCitaModal} 
          onSubmit={selectedCita ? handleEditCita : handleAddCita}
          initialData={selectedCita}
          doctores={doctores}
          pacientes={pacientes}
        />
      </Modal>

      <Modal 
        isOpen={isBitacoraModalOpen} 
        onClose={() => setIsBitacoraModalOpen(false)}
        title="Bitácora del Sistema"
      >
        <BitacoraForm 
          onClose={() => setIsBitacoraModalOpen(false)}
        />
      </Modal>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4">Confirmar Acción</h2>
              <p className="text-slate-600 mb-6">
                {confirmAction?.type === 'deleteDoctor' && '¿Estás seguro de que deseas eliminar este doctor?'}
                {confirmAction?.type === 'deletePatient' && '¿Estás seguro de que deseas eliminar este paciente?'}
                {confirmAction?.type === 'deleteCita' && '¿Estás seguro de que deseas eliminar esta cita?'}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de Éxito */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
