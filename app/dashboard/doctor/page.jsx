"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Calendar,
  FileText,
  Save,
  Edit3,
  Bell,
  Search,
  Activity,
  Clock,
  Stethoscope,
  LogOut,
  AlertCircle,
  X,
} from "lucide-react"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState([])
  const [isEditingNote, setIsEditingNote] = useState(null)
  const [editNoteText, setEditNoteText] = useState("")
  const [doctorData, setDoctorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    pacientesHoy: 0,
    citasPendientes: 0,
    citasHoy: 0
  })
  const [showPacientesModal, setShowPacientesModal] = useState(false)
  const [showCitasModal, setShowCitasModal] = useState(false)
  const [pacientes, setPacientes] = useState([])
  const [citasPendientes, setCitasPendientes] = useState([])

  useEffect(() => {
    fetchDoctorData()
  }, [])

  const fetchDoctorData = async () => {
    try {
      setLoading(true)
      
      // Obtener ID del doctor desde sessionStorage
      const doctorId = sessionStorage.getItem('user_id')
      
      if (!doctorId) {
        throw new Error('No se encontró información de sesión. Por favor, inicia sesión nuevamente.')
      }
      
      console.log('[DOCTOR DASHBOARD] ID del doctor:', doctorId)
      
      // Obtener información del doctor
      const response = await fetch(`/api/doctores/${doctorId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar datos del doctor')
      }
      
      const data = await response.json()
      console.log('[DOCTOR DASHBOARD] Datos del doctor:', data)
      setDoctorData(data)

      // Obtener pacientes asignados al doctor
      const pacientesRes = await fetch(`/api/doctores/${data.doctor_id}/pacientes`)
      const pacientesData = pacientesRes.ok ? await pacientesRes.json() : []
      setPacientes(pacientesData)

      // Obtener citas del doctor
      const citasRes = await fetch(`/api/citas?doctorId=${data.doctor_id}`)
      const citas = citasRes.ok ? await citasRes.json() : []

      // Citas pendientes: estado_id 1 (Programada) o 2 (Confirmada)
      const citasPendientesData = Array.isArray(citas) ? citas.filter(cita => cita.estado_id === 1 || cita.estado_id === 2) : []
      setCitasPendientes(citasPendientesData)

      // Citas de hoy
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const citasHoy = Array.isArray(citas) ? citas.filter(cita => {
        const citaDate = new Date(cita.fecha_hora)
        return citaDate >= today && citaDate < tomorrow
      }).length : 0

      setStats({
        pacientesHoy: pacientesData.length,
        citasPendientes: citasPendientesData.length,
        citasHoy: citasHoy
      })
      
    } catch (err) {
      console.error('[DOCTOR DASHBOARD] Error al cargar datos del doctor:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Cargar apuntes reales al cargar la página o doctorData
  useEffect(() => {
    if (doctorData && doctorData.doctor_id) {
      fetchNotes()
    }
  }, [doctorData])

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/doctores/${doctorData.doctor_id}/apuntes`)
      if (res.ok) {
        const data = await res.json()
        setSavedNotes(data)
      }
    } catch (err) {}
  }

  const handleSaveNote = async () => {
    if (!notes.trim() || !doctorData?.doctor_id) return
    try {
      const res = await fetch(`/api/doctores/${doctorData.doctor_id}/apuntes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: notes })
      })
      if (res.ok) {
        setNotes("")
        fetchNotes()
      }
    } catch (err) {}
  }

  const handleEditNote = (id) => {
    const noteToEdit = savedNotes.find((note) => note.apunte_id === id)
    setEditNoteText(noteToEdit?.texto || "")
    setIsEditingNote(id)
  }

  const handleUpdateNote = async () => {
    if (!editNoteText.trim() || !isEditingNote) return;
    try {
      const res = await fetch(`/api/doctores/${doctorData.doctor_id}/apuntes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apunte_id: isEditingNote, texto: editNoteText })
      })
      if (res.ok) {
        setIsEditingNote(null)
        setEditNoteText("")
        fetchNotes()
      }
    } catch (err) {}
  }

  const handleDeleteNote = async (apunte_id) => {
    if (!apunte_id) return;
    try {
      const res = await fetch(`/api/doctores/${doctorData.doctor_id}/apuntes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apunte_id })
      })
      if (res.ok) {
        fetchNotes()
      }
    } catch (err) {}
  }

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect to login page
    router.push('/login')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-slate-600">Cargando información del doctor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-red-200 shadow-lg max-w-md">
          <div className="text-red-600 flex items-center gap-2 mb-4">
            <AlertCircle size={24} />
            <span className="text-lg font-semibold">Error al cargar datos</span>
          </div>
          <p className="text-slate-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-slate-600">No se encontraron datos del doctor</div>
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
              <Stethoscope className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">MediCare Pro</h1>
              <p className="text-sm text-slate-600">Dr. {doctorData.primer_nombre} {doctorData.apellido_paterno}</p>
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
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors"
            >
              <Search size={20} />
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
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-sky-100 text-sky-700 shadow-sm"
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
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPacientesModal(true)}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Pacientes</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.pacientesHoy}</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Users className="text-sky-600" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCitasModal(true)}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Citas Pendientes</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.citasPendientes}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Citas Hoy</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.citasHoy}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Notes Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <FileText className="mr-2 text-sky-600" size={24} />
                  Apuntes Médicos
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe tus apuntes médicos aquí..."
                    className="w-full h-32 p-4 bg-sky-50/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-400 resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  {isEditingNote ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdateNote}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save size={16} />
                        <span>Actualizar</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setNotes("")
                          setIsEditingNote(null)
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Cancelar
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveNote}
                      disabled={!notes.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} />
                      <span>Guardar Apunte</span>
                    </motion.button>
                  )}
                </div>

                {/* Saved Notes */}
                {savedNotes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Apuntes Guardados</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {savedNotes.map((note) => (
                        <motion.div
                          key={note.apunte_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-sky-50 border border-sky-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              {isEditingNote === note.apunte_id ? (
                                <>
                                  <textarea
                                    value={editNoteText}
                                    onChange={e => setEditNoteText(e.target.value)}
                                    className="w-full p-2 border border-sky-200 rounded mb-2 text-slate-800"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleUpdateNote}
                                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                                    >Guardar</button>
                                    <button
                                      onClick={() => { setIsEditingNote(null); setEditNoteText("") }}
                                      className="px-3 py-1 bg-slate-400 text-white rounded hover:bg-slate-500 text-xs"
                                    >Cancelar</button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-slate-800 text-sm whitespace-pre-line">{note.texto}</p>
                                  <p className="text-slate-500 text-xs mt-2">{new Date(note.fecha_hora).toLocaleString("es-ES")}</p>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <button
                                onClick={() => handleEditNote(note.apunte_id)}
                                className="p-1 text-sky-600 hover:text-sky-800 transition-colors text-xs"
                                disabled={isEditingNote === note.apunte_id}
                              >Editar</button>
                              <button
                                onClick={() => handleDeleteNote(note.apunte_id)}
                                className={`p-1 text-xs rounded transition-colors ${!note.apunte_id ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900'}`}
                                disabled={!note.apunte_id}
                              >Eliminar</button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Modales */}
          <AnimatePresence>
            {showPacientesModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowPacientesModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Pacientes Asignados</h2>
                    <button
                      onClick={() => setShowPacientesModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-600" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {pacientes.map((paciente) => (
                      <div
                        key={paciente.paciente_id}
                        className="bg-sky-50 border border-sky-200 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-slate-800">
                          {paciente.primer_nombre} {paciente.segundo_nombre} {paciente.apellido_paterno} {paciente.apellido_materno}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">{paciente.email}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          Fecha de Nacimiento: {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {showCitasModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowCitasModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Citas Pendientes</h2>
                    <button
                      onClick={() => setShowCitasModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-600" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {citasPendientes.map((cita) => (
                      <div
                        key={cita.cita_id}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              Cita #{cita.cita_id}
                            </h3>
                            <p className="text-slate-600 text-sm mt-1">
                              Fecha: {new Date(cita.fecha_hora).toLocaleString()}
                            </p>
                            <p className="text-slate-500 text-xs mt-2">
                              Estado: {cita.estado_id === 1 ? 'Programada' : 'Confirmada'}
                            </p>
                            {cita.notas && (
                              <p className="text-slate-600 text-sm mt-2">{cita.notas}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
