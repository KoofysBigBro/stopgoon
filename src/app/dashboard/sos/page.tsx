'use client'

import { useState, useEffect } from 'react'

export default function SOSPage() {
  const [isBreathing, setIsBreathing] = useState(false)
  const [breatheText, setBreatheText] = useState('Ready')
  const [scale, setScale] = useState(0.5)
  const [color, setColor] = useState('bg-indigo-500')

  useEffect(() => {
    let interval: NodeJS.Timeout
    let timeouts: NodeJS.Timeout[] = []

    if (isBreathing) {
      const cycle = () => {
        // Inhale (4s)
        setBreatheText('Inhale')
        setScale(1)
        setColor('bg-indigo-500')

        // Hold (4s)
        timeouts.push(setTimeout(() => {
          setBreatheText('Hold')
          setColor('bg-emerald-500')
        }, 4000))

        // Exhale (4s)
        timeouts.push(setTimeout(() => {
          setBreatheText('Exhale')
          setScale(0.5)
          setColor('bg-indigo-500')
        }, 8000))

        // Hold (4s)
        timeouts.push(setTimeout(() => {
          setBreatheText('Hold')
          setColor('bg-border')
        }, 12000))
      }

      cycle()
      interval = setInterval(cycle, 16000)
    } else {
      setBreatheText('Ready')
      setScale(0.5)
      setColor('bg-indigo-500')
    }

    return () => {
      clearInterval(interval)
      timeouts.forEach(clearTimeout)
    }
  }, [isBreathing])

  return (
    <div className="animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-500 mb-2">Emergency Mode</h1>
        <p className="text-xl text-muted">Breathe. This urge is temporary. You are safe.</p>
      </header>

      <div className="bg-surface border-2 border-red-500/30 dark:border-red-500/20 rounded-3xl p-10 text-center shadow-lg shadow-red-500/10 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Box Breathing</h2>
        <p className="text-muted mb-10">Follow the circle to regulate your nervous system.</p>
        
        <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center bg-surface-hover rounded-full overflow-hidden shadow-inner">
          <div className="relative z-10 text-2xl font-bold text-foreground drop-shadow-md">
            {breatheText}
          </div>
          <div 
            className={`absolute inset-0 rounded-full ${color} opacity-30`}
            style={{ 
              transform: `scale(${scale})`, 
              transition: isBreathing ? 'transform 4s linear, background-color 4s linear' : 'transform 1s ease-out' 
            }}
          ></div>
        </div>
        
        <button 
          onClick={() => setIsBreathing(!isBreathing)}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-colors ${isBreathing ? 'bg-surface-hover text-foreground hover:bg-border' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'}`}
        >
          {isBreathing ? 'Stop Exercise' : 'Start Exercise'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Grounding Technique (5-4-3-2-1)</h3>
          <p className="mb-4 text-muted">Acknowledge your surroundings:</p>
          <ul className="space-y-3 text-foreground">
            <li className="flex gap-3"><span className="text-xl">👀</span> <strong>5</strong> things you can see</li>
            <li className="flex gap-3"><span className="text-xl">🖐️</span> <strong>4</strong> things you can touch</li>
            <li className="flex gap-3"><span className="text-xl">👂</span> <strong>3</strong> things you can hear</li>
            <li className="flex gap-3"><span className="text-xl">👃</span> <strong>2</strong> things you can smell</li>
            <li className="flex gap-3"><span className="text-xl">👅</span> <strong>1</strong> thing you can taste</li>
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-foreground">Distraction Activities</h3>
          <ul className="space-y-4 text-foreground list-disc pl-5">
            <li>Drink a large glass of cold water</li>
            <li>Do 10 pushups or jumping jacks</li>
            <li>Splash cold water on your face</li>
            <li>Text a friend or accountability partner</li>
            <li>Step outside for 5 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
