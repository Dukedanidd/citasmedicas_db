"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function DoctorForm({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    especialidad: "",
    password: "",
    consultorio_id: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [consultorios, setConsultorios] = useState([])

  // Cargar consultorios
  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        const response = await fetch('/api/consultorios')
        if (!response.ok) throw new Error('Error al cargar consultorios')
        const data = await response.json()
        setConsultorios(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchConsultorios()
  }, [])

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (initialData?.doctor_id) {
        try {
          const response = await fetch(`/api/doctores/${initialData.doctor_id}`)
          if (!response.ok) throw new Error('Error al cargar datos del doctor')
          const data = await response.json()
          console.log('Datos completos del doctor:', data)
          setFormData({
            doctor_id: data.doctor_id,
            primer_nombre: data.primer_nombre || "",
            segundo_nombre: data.segundo_nombre || "",
            apellido_paterno: data.apellido_paterno || "",
            apellido_materno: data.apellido_materno || "",
            email: data.email || "",
            especialidad: data.especialidad || "",
            password: "", // No mostramos la contraseña al editar
            consultorio_id: data.consultorio_id || null
          })
        } catch (error) {
          console.error('Error al cargar datos del doctor:', error)
        }
      }
    }
    fetchDoctorData()
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Asegurarnos de que consultorio_id sea null si está vacío
    const submitData = {
      ...formData,
      consultorio_id: formData.consultorio_id === "" ? null : formData.consultorio_id
    }
    onSubmit(submitData)
    
    // Limpiar el formulario después de enviar
    if (!initialData) {
      setFormData({
        primer_nombre: "",
        segundo_nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        especialidad: "",
        password: "",
        consultorio_id: null
      })
    }
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!initialData}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 pr-10"
            placeholder={initialData ? "Dejar en blanco para mantener la actual" : "Ingrese la contraseña"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? "Dejar en blanco para mantener la contraseña actual" : "La contraseña es requerida para crear un nuevo doctor"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Especialidad <span className="text-red-500">*</span>
        </label>
        <select
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
        >
          <option value="">Seleccionar especialidad...</option>
          <option value="Cardiología">Cardiología</option>
          <option value="Dermatología">Dermatología</option>
          <option value="Endocrinología">Endocrinología</option>
          <option value="Gastroenterología">Gastroenterología</option>
          <option value="Ginecología">Ginecología</option>
          <option value="Neurología">Neurología</option>
          <option value="Oftalmología">Oftalmología</option>
          <option value="Ortopedia">Ortopedia</option>
          <option value="Otorrinolaringología">Otorrinolaringología</option>
          <option value="Pediatría">Pediatría</option>
          <option value="Psiquiatría">Psiquiatría</option>
          <option value="Urología">Urología</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Consultorio
        </label>
          <select
            name="consultorio_id"
          value={formData.consultorio_id || ""}
            onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          >
          <option value="">Sin consultorio asignado</option>
            {consultorios.map(consultorio => (
              <option key={consultorio.consultorio_id} value={consultorio.consultorio_id}>
                {consultorio.nombre}
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
          {initialData ? 'Actualizar' : 'Crear'} Doctor
        </button>
      </div>
    </form>
  )
}