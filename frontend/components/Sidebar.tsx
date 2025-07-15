"use client"

import { ChevronLeft, ChevronDown } from "lucide-react"
import type { Alert } from "@/types/alert"
import AlertCard from "./AlertCard"

interface SidebarProps {
  alerts: Alert[]
  selectedAlert: Alert
  onSelectAlert: (alert: Alert) => void
  selectedMachine: string
  onSelectMachine: (machine: string) => void
}

export default function Sidebar({
  alerts,
  selectedAlert,
  onSelectAlert,
  selectedMachine,
  onSelectMachine,
}: SidebarProps) {
  // const newAlertsCount = alerts.filter((alert) => alert.isNew).length

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="mb-4">
          <div className="relative">
            <select
              className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMachine}
              onChange={(e) => onSelectMachine(e.target.value)}
            >
              <option value="CNC Machine">CNC Machine</option>
              <option value="Miling Machine">Miling Machine</option>
              <option value="Drilling Machine">Drilling Machine</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm">
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-sm text-gray-600">{alerts.length} Alerts</span>
          {/* New alerts badge removed: 'isNew' property does not exist on Alert */}
        </div>

        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <AlertCard
              key={`${alert._id}-${index}`}
              alert={alert}
              isSelected={selectedAlert === alert}
              onClick={() => onSelectAlert(alert)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
