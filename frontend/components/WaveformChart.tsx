"use client"

interface WaveformChartProps {
  type: "anomaly" | "normal"
}

export default function WaveformChart({ type }: WaveformChartProps) {
  // Generate more realistic waveform data based on the image
  const generateWaveformPath = () => {
    const width = 400
    const height = 120
    const centerY = height / 2
    const points = []

    for (let x = 0; x < width; x += 1) {
      let y = centerY

      if (type === "anomaly") {
        // More chaotic pattern for anomaly
        y += Math.sin(x * 0.05) * 25 + Math.sin(x * 0.02) * 15 + (Math.random() - 0.5) * 20
      } else {
        // More regular pattern for normal
        y += Math.sin(x * 0.03) * 20 + Math.sin(x * 0.01) * 10 + (Math.random() - 0.5) * 8
      }

      points.push(`${x},${Math.max(10, Math.min(110, y))}`)
    }

    return `M${points.join(" L")}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs text-gray-500 space-y-2 mr-4">
          <div>AMP</div>
        </div>
        <div className="text-xs text-gray-500 space-y-2 text-right">
          <div>0.75</div>
          <div>0.50</div>
          <div>0.25</div>
          <div>0.00</div>
          <div>-0.25</div>
          <div>-0.50</div>
          <div>-0.75</div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height="120" viewBox="0 0 400 120" className="bg-white">
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Center line */}
          <line x1="0" y1="60" x2="400" y2="60" stroke="#e5e7eb" strokeWidth="1" />

          {/* Waveform */}
          <path
            d={generateWaveformPath()}
            fill="none"
            stroke={`url(#gradient-${type})`}
            strokeWidth="1.5"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  )
}
