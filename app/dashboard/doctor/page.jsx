"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"

export default function DashboardPage() {
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState([])
  const [isEditingNote, setIsEditingNote] = useState(null)

  const handleSaveNote = () => {
    if (notes.trim()) {
      const newNote = {
        id: Date.now(),
        content: notes,
        timestamp: new Date().toLocaleString("es-ES"),
      }
      setSavedNotes([newNote, ...savedNotes])
      setNotes("")
    }
  }

  const handleEditNote = (id) => {
    const noteToEdit = savedNotes.find((note) => note.id === id)
    setNotes(noteToEdit.content)
    setIsEditingNote(id)
  }

  const handleUpdateNote = () => {
    setSavedNotes(
      savedNotes.map((note) =>
        note.id === isEditingNote ? { ...note, content: notes, timestamp: new Date().toLocaleString("es-ES") } : note,
      ),
    )
    setNotes("")
    setIsEditingNote(null)
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
              <Stethoscope className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">MediCare Pro</h1>
              <p className="text-sm text-slate-600">Dr. María González</p>
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Pacientes Hoy</p>
                    <p className="text-2xl font-bold text-slate-800">12</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Users className="text-sky-600" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-sky-100 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Citas Pendientes</p>
                    <p className="text-2xl font-bold text-slate-800">8</p>
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
                    <p className="text-slate-600 text-sm">Urgencias</p>
                    <p className="text-2xl font-bold text-slate-800">3</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Activity className="text-red-600" size={24} />
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
                          key={note.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-sky-50 border border-sky-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-slate-800 text-sm">{note.content}</p>
                              <p className="text-slate-500 text-xs mt-2">{note.timestamp}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditNote(note.id)}
                              className="ml-2 p-1 text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              <Edit3 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
