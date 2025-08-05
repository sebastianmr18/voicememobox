"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, FileText, Clock, Shield, Search, Download } from "lucide-react"

const features = [
  {
    icon: Mic,
    title: "Grabación Inteligente",
    description:
      "Graba directamente desde tu navegador o sube archivos existentes. Soporta MP3, WAV, M4A y más formatos.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: FileText,
    title: "Transcripción Precisa",
    description:
      "Tecnología AWS Transcribe con 99.9% de precisión. Incluye indicadores de confianza para cada palabra.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock,
    title: "Procesamiento Rápido",
    description: "Obtén tus transcripciones en menos de 2 minutos. Procesamiento en tiempo real con feedback visual.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Shield,
    title: "Totalmente Seguro",
    description:
      "Tus datos están protegidos con encriptación de extremo a extremo. Cumplimos con estándares de seguridad.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Search,
    title: "Búsqueda Inteligente",
    description: "Encuentra cualquier transcripción al instante. Busca por contenido, fecha, duración o formato.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Download,
    title: "Exportación Flexible",
    description: "Exporta tus transcripciones en múltiples formatos: TXT, PDF. Comparte fácilmente.",
    color: "bg-teal-50 text-teal-600",
  },
]

export function LandingFeatures() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Todo lo que necesitas para <span className="text-red-600">transcribir</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma completa que convierte tus ideas habladas en texto organizado y accesible
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>

                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
