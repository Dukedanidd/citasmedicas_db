"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function PatientForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    doctor: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí irá la lógica para guardar el paciente
    console.log(formData)
    onClose()
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
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        />
      </div>

      <div>
        <label htmlFor="edad" className="block text-sm font-medium text-gray-700">
          Edad
        </label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        />
      </div>

      <div>
        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
          Doctor Asignado
        </label>
        <select
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        >
          <option value="">Seleccionar doctor</option>
          <option value="Dr. Juan Pérez">Dr. Juan Pérez</option>
          <option value="Dra. María García">Dra. María García</option>
          <option value="Dr. Carlos López">Dr. Carlos López</option>
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
          Guardar
        </motion.button>
      </div>
    </form>
  )
}
