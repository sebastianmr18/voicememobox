"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mic, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Procesamiento en menos de 2 minutos",
  "Múltiples formatos de audio",
  "Historial organizado y búsqueda",
  "Exportación en varios formatos",
  "Almacenamiento de audios y transcripciones en la nube por 30 días",
  "Hasta 5 transcripciones cada 24 horas",
  "Soporte técnico y constante mejoras en la plataforma",
]

export function LandingCTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                ¿Listo para transformar tu productividad?
              </h2>

              <p className="text-xl text-red-100 leading-relaxed">
                Haz parte de los profesionales que ya están ahorrando horas de trabajo manual con VoiceMemoBox
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/transcribir">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center space-x-4 text-red-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm">Configuración sencilla</span>
              </div>
            </div>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6">Todo incluido desde el primer día:</h3>

            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-8"
            >
              <p className="text-center text-red-100">
                <strong>Siempre te escuchamos</strong> - Si no estás satisfecho, nuestro equipo atenderá tus preguntas
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
