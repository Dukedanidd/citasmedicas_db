"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CitaForm({ onClose, onSubmit, initialData, doctores, pacientes }) {
  const [formData, setFormData] = useState({
    paciente_id: '',
    doctor_id: '',
    fecha_hora: '',
    estado_id: 1,
    notas: ''
  })

  const isCancelled = initialData?.estado_id === 3

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        fecha_hora: new Date(initialData.fecha_hora).toISOString().slice(0, 16)
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          Esta cita está cancelada y no puede ser editada.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Paciente <span className="text-red-500">*</span>
        </label>
        <select
          id="paciente_id"
          name="paciente_id"
          value={formData.paciente_id}
          onChange={handleChange}
          required
          disabled={isCancelled}
          className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 ${
            isCancelled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
        >
          <option value="">Seleccionar paciente...</option>
          {pacientes.map(paciente => (
            <option key={paciente.paciente_id} value={paciente.paciente_id}>
              {`${paciente.primer_nombre} ${paciente.apellido_paterno}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Doctor <span className="text-red-500">*</span>
        </label>
        <select
          id="doctor_id"
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          required
          disabled={isCancelled}
          className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 ${
            isCancelled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
        >
          <option value="">Seleccionar doctor...</option>
          {doctores.map(doctor => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {`Dr. ${doctor.primer_nombre} ${doctor.apellido_paterno}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Fecha y Hora <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="fecha_hora"
          name="fecha_hora"
          value={formData.fecha_hora}
          onChange={handleChange}
          required
          disabled={isCancelled}
          className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 ${
            isCancelled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estado <span className="text-red-500">*</span>
        </label>
        <select
          id="estado_id"
          name="estado_id"
          value={formData.estado_id}
          onChange={handleChange}
          required
          disabled={isCancelled}
          className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 ${
            isCancelled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
        >
          <option value="1">Programada</option>
          <option value="2">Confirmada</option>
          <option value="3">Cancelada</option>
          <option value="4">Completada</option>
          <option value="5">No asistió</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notas
        </label>
        <textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows="3"
          disabled={isCancelled}
          className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 ${
            isCancelled ? 'bg-slate-100 cursor-not-allowed' : ''
          }`}
          placeholder="Ingrese notas adicionales sobre la cita..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          {isCancelled ? 'Cerrar' : 'Cancelar'}
        </button>
        {!isCancelled && (
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {initialData ? 'Actualizar' : 'Crear'} Cita
          </button>
        )}
      </div>
    </form>
  )
} 