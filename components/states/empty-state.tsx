import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-sm">{description}</p>
      </div>
    </div>
  );
}
