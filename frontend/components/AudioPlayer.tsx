"use client"

import { useState } from "react"
import { Play, Pause, Volume2 } from "lucide-react"

interface AudioPlayerProps {
  duration: string
}

export default function AudioPlayer({ duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime] = useState("0:09")
  const [progress] = useState(26) // 26% progress as shown in image

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Here you would implement actual audio playback
  }
 
  return (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        {isPlaying ? <Pause className="h-4 w-4 text-gray-700" /> : <Play className="h-4 w-4 text-gray-700 ml-0.5" />}
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-1">
          <div
            className="bg-gray-800 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <button className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded transition-colors">
        <Volume2 className="h-4 w-4 text-gray-700" />
      </button>
    </div>
  )
}
