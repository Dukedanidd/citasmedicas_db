import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function DoctorForm({ onSubmit, onClose, initialData }) {
  const [formData, setFormData] = useState({
    doctor_id: "",
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    password: "",
    especialidad: "",
    consultorio_id: ""
  })

  const [consultorios, setConsultorios] = useState([])
  const [isLoadingConsultorios, setIsLoadingConsultorios] = useState(true)

  useEffect(() => {
    // Cargar datos iniciales si estamos editando
    if (initialData) {
      setFormData({
        doctor_id: initialData.doctor_id,
        primer_nombre: initialData.primer_nombre || "",
        segundo_nombre: initialData.segundo_nombre || "",
        apellido_paterno: initialData.apellido_paterno || "",
        apellido_materno: initialData.apellido_materno || "",
        email: initialData.email || "",
        password: "",
        especialidad: initialData.especialidad || "",
        consultorio_id: initialData.consultorio_id || ""
      })
    }

    // Cargar consultorios
    const fetchConsultorios = async () => {
      try {
        setIsLoadingConsultorios(true)
        const response = await fetch('/api/consultorios')
        if (!response.ok) {
          throw new Error('Error al obtener consultorios')
        }
        const data = await response.json()
        setConsultorios(data)
      } catch (error) {
        console.error('Error al obtener consultorios:', error)
      } finally {
        setIsLoadingConsultorios(false)
      }
    }

    fetchConsultorios()
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

      {!initialData && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required={!initialData}
          />
        </div>
      )}

      <div>
        <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
          Especialidad
        </label>
        <input
          type="text"
          id="especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          required
        />
      </div>

      <div>
        <label htmlFor="consultorio_id" className="block text-sm font-medium text-gray-700">
          Consultorio
        </label>
        {isLoadingConsultorios ? (
          <div className="mt-1 text-sm text-gray-500">Cargando consultorios...</div>
        ) : (
          <select
            id="consultorio_id"
            name="consultorio_id"
            value={formData.consultorio_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            required={!initialData}
          >
            <option value="">Seleccionar consultorio</option>
            {consultorios.map(consultorio => (
              <option key={consultorio.consultorio_id} value={consultorio.consultorio_id}>
                {consultorio.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600"
        >
          {initialData ? 'Actualizar' : 'Guardar'}
        </motion.button>
      </div>
    </form>
  )
}