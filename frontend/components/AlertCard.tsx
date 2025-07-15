"use client"

import type { Alert } from "@/types/alert"

interface AlertCardProps {
  alert: Alert
  isSelected: boolean
  onClick: () => void
}

export default function AlertCard({ alert, isSelected, onClick }: AlertCardProps) {
  const getSeverityStyles = (severity?: string) => {
    switch ((severity || '').toLowerCase()) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-300 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">ID #{alert._id}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityStyles(alert.alertType)}`}>
          {alert.alertType}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">Detected at {alert.detectionTime}</p>
      <p className="text-xs text-blue-600 font-medium">{alert.equipment || "Unknown machine"}</p>
    </div>
  )
}
