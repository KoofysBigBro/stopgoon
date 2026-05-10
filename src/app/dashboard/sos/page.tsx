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
          setColor('bg-slate-300 dark:bg-slate-700')
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
        <p className="text-xl text-slate-600 dark:text-slate-400">Breathe. This urge is temporary. You are safe.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 border-2 border-red-500 dark:border-red-500/50 rounded-3xl p-10 text-center shadow-lg shadow-red-500/10 mb-8">
        <h2 className="text-2xl font-bold mb-2">Box Breathing</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Follow the circle to regulate your nervous system.</p>
        
        <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="relative z-10 text-2xl font-bold text-slate-900 dark:text-white drop-shadow-md">
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
          className={`px-8 py-4 rounded-full font-bold text-lg transition-colors ${isBreathing ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'}`}
        >
          {isBreathing ? 'Stop Exercise' : 'Start Exercise'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Grounding Technique (5-4-3-2-1)</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">Acknowledge your surroundings:</p>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3"><span className="text-xl">👀</span> <strong>5</strong> things you can see</li>
            <li className="flex gap-3"><span className="text-xl">🖐️</span> <strong>4</strong> things you can touch</li>
            <li className="flex gap-3"><span className="text-xl">👂</span> <strong>3</strong> things you can hear</li>
            <li className="flex gap-3"><span className="text-xl">👃</span> <strong>2</strong> things you can smell</li>
            <li className="flex gap-3"><span className="text-xl">👅</span> <strong>1</strong> thing you can taste</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Distraction Activities</h3>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300 list-disc pl-5">
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
