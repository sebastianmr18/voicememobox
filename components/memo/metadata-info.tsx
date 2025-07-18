import { Calendar, Clock, HardDrive, FileType } from "lucide-react"

interface MetadataInfoProps {
  memo: {
    duration: number
    createdAt: string
    metadata: {
      size: number
      format: string
    }
  }
}

export function MetadataInfo({ memo }: MetadataInfoProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center space-x-2 text-sm">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <p className="font-medium">Fecha</p>
          <p className="text-gray-600">{formatDate(memo.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <Clock className="h-4 w-4 text-gray-500" />
        <div>
          <p className="font-medium">Duración</p>
          <p className="text-gray-600">{formatDuration(memo.duration)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <HardDrive className="h-4 w-4 text-gray-500" />
        <div>
          <p className="font-medium">Tamaño</p>
          <p className="text-gray-600">{memo.metadata.size} MB</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <FileType className="h-4 w-4 text-gray-500" />
        <div>
          <p className="font-medium">Formato</p>
          <p className="text-gray-600">{memo.metadata.format}</p>
        </div>
      </div>
    </div>
  )
}
