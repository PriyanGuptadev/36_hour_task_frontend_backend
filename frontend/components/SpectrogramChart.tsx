"use client"

interface SpectrogramChartProps {
  type: "anomaly" | "normal"
}

export default function SpectrogramChart({ type }: SpectrogramChartProps) {
  // Generate spectrogram data with 8kHz max frequency
  const generateSpectrogramData = () => {
    const timeSteps = 54 // 0 to 54 seconds as shown in image
    const freqBins = 40 // Frequency bins up to 8kHz
    const data = [] 

    for (let t = 0; t < timeSteps; t++) {
      for (let f = 0; f < freqBins; f++) {
        let intensity

        if (type === "anomaly") {
          // Anomaly pattern - more intense in mid-high frequencies
          if (f > freqBins * 0.3 && f < freqBins * 0.8) {
            intensity = 0.6 + Math.random() * 0.4
          } else {
            intensity = 0.2 + Math.random() * 0.3
          }
        } else {
          // Normal pattern - more uniform, less intense in high frequencies
          if (f > freqBins * 0.6) {
            intensity = 0.1 + Math.random() * 0.2
          } else {
            intensity = 0.3 + Math.random() * 0.4
          }
        }

        data.push({
          time: t,
          frequency: f,
          intensity: Math.min(intensity, 1),
        })
      }
    }

    return data
  }

  const spectrogramData = generateSpectrogramData()

  const getColor = (intensity: number, type: string) => {
    if (type === "anomaly") {
      // Purple to magenta gradient for anomaly (matching image)
      const hue = 280 + intensity * 40 // Purple to magenta
      const saturation = 60 + intensity * 40
      const lightness = 30 + intensity * 50
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    } else {
      // Orange to red gradient for normal (matching image)
      const hue = 20 - intensity * 20 // Orange to red
      const saturation = 80 + intensity * 20
      const lightness = 40 + intensity * 40
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs text-gray-500 space-y-4 mr-4">
          <div>8192</div>
          <div>4096</div>
          <div>2048</div>
          <div>1024</div>
          <div>512</div>
          <div>0</div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height="200" viewBox="0 0 540 200" className="bg-white border border-gray-100">
          {spectrogramData.map((point, index) => (
            <rect
              key={index}
              x={point.time * 10}
              y={200 - (point.frequency / 40) * 200}
              width="10"
              height="5"
              fill={getColor(point.intensity, type)}
              opacity={0.7 + point.intensity * 0.3}
            />
          ))}
        </svg>

        {/* Time axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
          <span>0</span>
          <span>6</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
          <span>30</span>
          <span>36</span>
          <span>42</span>
          <span>48</span>
          <span>54</span>
        </div>
      </div>
    </div>
  )
}
