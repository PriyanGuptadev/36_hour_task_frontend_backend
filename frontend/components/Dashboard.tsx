"use client"

import { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import AlertDetail from "./AlertDetail"
import type { Alert } from "@/types/alert"
import { API_BASE_URL } from "../lib/api";
 
export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<string>("")

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/alerts`);
        if (!res.ok) throw new Error("Failed to fetch alerts")
        const data = await res.json()
        setAlerts(data.data.alerts)
        if (data.data.alerts.length > 0) {
          setSelectedAlertId(data.data.alerts[0]._id)
          setSelectedMachine(data.data.alerts[0].equipment || "")
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          // setError(err.message)
        } else {
          // setError("Unknown error")
        }
      } finally {
        // setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const selectedAlert = alerts.find(a => a._id === selectedAlertId) || null

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />
      <div className="flex">
        <Sidebar
          alerts={alerts}
          selectedAlert={selectedAlert as Alert}
          onSelectAlert={alert => setSelectedAlertId(alert._id)}
          selectedMachine={selectedMachine}
          onSelectMachine={setSelectedMachine}
        />
        {selectedAlert && <AlertDetail alert={selectedAlert} />}
      </div>
    </div>
  )
}
