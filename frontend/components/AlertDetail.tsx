"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Alert } from "@/types/alert"
import AudioPlayer from "./AudioPlayer"
import SpectrogramChart from "./SpectrogramChart"
import WaveformChart from "./WaveformChart"

interface AlertDetailProps {
  alert: Alert
}

export default function AlertDetail({ alert }: AlertDetailProps) {
  const [suspectedReason, setSuspectedReason] = useState("Unknown Anomaly")
  const [actionRequired, setActionRequired] = useState("Select Action")
  const [comments, setComments] = useState("")

  const handleUpdate = async () => {
    try {
      // Here you would typically send the data to your backend
      const updateData = {
        alertId: alert._id,
        suspectedReason,
        actionRequired,
        comments,
        timestamp: new Date().toISOString(),
      }

      console.log("Updating alert:", updateData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      window.alert("Alert updated successfully!")
    } catch (error) {
      console.error("Error updating alert:", error)
      window.alert("Failed to update alert. Please try again.")
    }
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] overflow-y-auto">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Alert ID #{alert._id}</h1>
            <p className="text-gray-600 text-sm">Detected at {alert.detectionTime}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Anomaly Machine Output */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Machine Output</h3>
                <AudioPlayer duration="0:35" />
                <div className="mt-4 space-y-4">
                  <WaveformChart type="anomaly" />
                  <SpectrogramChart type="anomaly" />
                </div>
              </div>

              {/* Normal Machine Output */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Normal Machine Output</h3>
                <AudioPlayer duration="0:35" />
                <div className="mt-4 space-y-4">
                  <WaveformChart type="normal" />
                  <SpectrogramChart type="normal" />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment</label>
                <p className="text-gray-900 font-medium">{alert.equipment || "Unknown machine"}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Suspected Reason</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={suspectedReason}
                    onChange={(e) => setSuspectedReason(e.target.value)}
                  >
                    <option value="Unknown Anomaly">Unknown Anomaly</option>
                    <option value="Bearing Failure">Bearing Failure</option>
                    <option value="Vibration Issue">Vibration Issue</option>
                    <option value="Temperature Anomaly">Temperature Anomaly</option>
                    <option value="Lubrication Problem">Lubrication Problem</option>
                    <option value="Tool Wear">Tool Wear</option>
                    <option value="Misalignment">Misalignment</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Action Required</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={actionRequired}
                    onChange={(e) => setActionRequired(e.target.value)}
                  >
                    <option value="Select Action">Select Action</option>
                    <option value="Schedule Maintenance">Schedule Maintenance</option>
                    <option value="Immediate Inspection">Immediate Inspection</option>
                    <option value="Replace Component">Replace Component</option>
                    <option value="Monitor Closely">Monitor Closely</option>
                    <option value="Stop Machine">Stop Machine</option>
                    <option value="No Action Required">No Action Required</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
                <Textarea
                  placeholder="Add your comments here..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="min-h-[120px] resize-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleUpdate}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-semibold text-sm uppercase tracking-wide"
                >
                  UPDATE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
