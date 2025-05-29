"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function PatientForm({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    fecha_nacimiento: "",
    sexo: "",
    doctor_id: ""
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
        doctor_id: initialData.doctor_id || ""
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
          <label htmlFor="primer_nombre" className="block text-sm font-medium text-gray-700">
            Primer Nombre
          </label>
          <input
            type="text"
            id="primer_nombre"
            name="primer_nombre"
            value={formData.primer_nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label htmlFor="segundo_nombre" className="block text-sm font-medium text-gray-700">
            Segundo Nombre
          </label>
          <input
            type="text"
            id="segundo_nombre"
            name="segundo_nombre"
            value={formData.segundo_nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>

        <div>
          <label htmlFor="apellido_paterno" className="block text-sm font-medium text-gray-700">
            Apellido Paterno
          </label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label htmlFor="apellido_materno" className="block text-sm font-medium text-gray-700">
            Apellido Materno
          </label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
            Sexo
          </label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required
          >
            <option value="">Seleccionar sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700">
          Doctor Asignado
        </label>
        <select
          id="doctor_id"
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        >
          <option value="">Seleccionar doctor</option>
          <option value="1">Dr. Juan Pérez - Cardiología</option>
          <option value="2">Dra. María García - Pediatría</option>
          <option value="3">Dr. Carlos López - Dermatología</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600"
        >
          {initialData ? "Actualizar" : "Guardar"}
        </motion.button>
      </div>
    </form>
  )
}
