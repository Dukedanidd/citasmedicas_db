"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function BitacoraForm({ onClose }) {
  const [bitacora, setBitacora] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/bitacora')
        if (!response.ok) {
          throw new Error('Error al cargar la bitácora')
        }
        const data = await response.json()
        setBitacora(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (error) {
        console.error('Error:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBitacora()
  }, [])

  const filteredBitacora = bitacora.filter(entry => {
    const searchLower = searchTerm.toLowerCase()
    return (
      entry.tabla_afectada?.toLowerCase().includes(searchLower) ||
      entry.tipo?.toLowerCase().includes(searchLower) ||
      entry.detalle?.toLowerCase().includes(searchLower) ||
      entry.email?.toLowerCase().includes(searchLower)
    )
  })

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredBitacora.slice(startIndex, endIndex)
  }

  return (
    <div className="w-full max-w-[90vw] mx-auto space-y-4">
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en bitácora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tabla
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Cargando bitácora...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredBitacora.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay registros en la bitácora
                </td>
              </tr>
            ) : (
              getCurrentPageData().map((entry) => (
                <tr key={entry.log_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.fecha_hora).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.tabla_afectada}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-700' :
                      entry.tipo === 'actualizacion' ? 'bg-blue-50 text-blue-700' :
                      entry.tipo === 'delete' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-50 text-slate-700'
                    }`}>
                      {entry.tipo === 'ingreso' ? 'INSERT' :
                       entry.tipo === 'actualizacion' ? 'UPDATE' :
                       entry.tipo === 'delete' ? 'DELETE' :
                       entry.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {entry.detalle || 'Sin detalles'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-lg shadow">
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
                {filteredBitacora.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredBitacora.length)}
              </span>{' '}
              de{' '}
              <span className="font-medium">{filteredBitacora.length}</span>{' '}
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
              {(() => {
                const pages = []
                const showPages = 4
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
                let endPage = Math.min(totalPages, startPage + showPages - 1)

                // Ajustar startPage si estamos cerca del final
                if (endPage - startPage + 1 < showPages) {
                  startPage = Math.max(1, endPage - showPages + 1)
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setCurrentPage(i)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i
                          ? 'z-10 bg-sky-50 border-sky-500 text-sky-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </motion.button>
                  )
                }
                return pages
              })()}
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

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
} 