"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Stethoscope, Heart, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Redirigir al usuario según su rol
      router.push(data.redirectTo)
    } catch (error) {
      setError("Error al iniciar sesión")
    }
    
    setIsLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-20 text-sky-200">
        <Heart size={40} />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 right-32 text-blue-200"
        style={{ animationDelay: "1s" }}
      >
        <Stethoscope size={35} />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-32 left-40 text-indigo-200"
        style={{ animationDelay: "2s" }}
      >
        <Shield size={30} />
      </motion.div>

      {/* Contenedor principal */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-sm">
        {/* Tarjeta de login */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-sky-100 p-6 relative"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg"
            >
              <Stethoscope className="text-white" size={28} />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">MediCare Pro</h1>
            <p className="text-sm text-slate-600">Sistema de Gestión Médica</p>
          </motion.div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400" size={18} />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-sky-50/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-400"
                  placeholder="doctor@medicare.com"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400" size={18} />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-sky-50/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-400"
                  placeholder="••••••••"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Recordar y Olvidé contraseña */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center">
                <motion.input
                  whileHover={{ scale: 1.05 }}
                  type="checkbox"
                  className="w-4 h-4 text-sky-500 bg-sky-50 border-sky-300 rounded focus:ring-sky-400 focus:ring-2"
                />
                <span className="ml-2 text-xs text-slate-600">Recordarme</span>
              </label>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#"
                className="text-xs text-sky-500 hover:text-sky-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </motion.a>
            </motion.div>

            {/* Botón de login */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden mt-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "Iniciar Sesión"
                )}
              </motion.button>
            </motion.div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
          </form>
        </motion.div>

        {/* Información adicional */}
        <motion.div variants={itemVariants} className="mt-4 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Shield size={14} className="mr-1 text-sky-400" />
              <span>Cifrado SSL</span>
            </div>
            <div className="flex items-center">
              <Heart size={14} className="mr-1 text-sky-400" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
