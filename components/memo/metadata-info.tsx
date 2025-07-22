import { Clock, Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetadataInfoProps {
  status: string;
  uploadedAt: string;
  filename: string;
  className?: string;
}

export function MetadataInfo({
  status,
  uploadedAt,
  filename,
  className = "",
}: MetadataInfoProps) {
  const fileType = filename.split(".").pop()?.toUpperCase() || "AUDIO";

  const statusMap = {
    started: {
      text: "Procesando",
      icon: <Loader2 size={14} className="animate-spin mr-1" />,
      variant: "secondary",
    },
    completed: {
      text: "Completado",
      icon: <Check size={14} className="mr-1" />,
      variant: "success",
    },
    failed: {
      text: "Fallido",
      icon: <X size={14} className="mr-1" />,
      variant: "destructive",
    },
  };

  const statusInfo =
    statusMap[status as keyof typeof statusMap] || statusMap.started;

  return (
    <div className={`grid grid-cols-3 gap-3 text-sm ${className}`}>
      <div className="space-y-1">
        <div className="text-muted-foreground">Estado</div>
        <Badge variant={statusInfo.variant as any} className="capitalize">
          {statusInfo.icon}
          {statusInfo.text}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="text-muted-foreground">Subido</div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          {new Date(uploadedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-muted-foreground">Duración</div>
        <div>--:--</div>
      </div>
    </div>
  );
}
