"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function PatientForm({ onClose, onSubmit, initialData, doctores = [] }) {
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    fecha_nacimiento: "",
    sexo: "",
    doctor_id: "",
    password: ""
  })

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        primer_nombre: initialData.primer_nombre || "",
        segundo_nombre: initialData.segundo_nombre || "",
        apellido_paterno: initialData.apellido_paterno || "",
        apellido_materno: initialData.apellido_materno || "",
        email: initialData.email || "",
        fecha_nacimiento: initialData.fecha_nacimiento ? new Date(initialData.fecha_nacimiento).toISOString().split('T')[0] : "",
        sexo: initialData.sexo || "",
        doctor_id: initialData.doctor_id || "",
        password: "" // No mostramos la contraseña al editar
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Primer Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="primer_nombre"
            value={formData.primer_nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Segundo Nombre
          </label>
          <input
            type="text"
            name="segundo_nombre"
            value={formData.segundo_nombre || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Apellido Paterno <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Apellido Materno
          </label>
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contraseña {!initialData && <span className="text-red-500">*</span>}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!initialData}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          placeholder={initialData ? "Dejar en blanco para mantener la actual" : "Ingrese la contraseña"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          >
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Doctor Asignado <span className="text-red-500">*</span>
        </label>
        <select
          name="doctor_id"
          value={formData.doctor_id || ''}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
        >
          <option value="">Seleccionar doctor...</option>
          {doctores.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              Dr. {doctor.primer_nombre} {doctor.apellido_paterno}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {initialData ? 'Actualizar' : 'Crear'} Paciente
        </button>
      </div>
    </form>
  )
}
