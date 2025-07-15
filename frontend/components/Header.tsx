"use client"

import { Settings, User, Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-gray-800">GROUNDUP.AI</span>
          </div>
          <nav className="flex space-x-8">
            <button className="text-gray-500 hover:text-gray-700 font-medium py-2 border-b-2 border-transparent">
              DASHBOARD
            </button>
            <button className="text-gray-700 font-medium py-2 border-b-2 border-blue-500">ALERTS</button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <User className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              6
            </span>
          </div>
          <span className="text-gray-600 text-sm ml-2">Welcome Admin!</span>
        </div>
      </div>
    </header>
  )
}
