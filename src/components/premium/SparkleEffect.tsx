'use client'

import { useEffect, useRef } from 'react'

interface SparkleEffectProps {
  count?: number
  color?: string
  interactive?: boolean
}

export default function SparkleEffect({ count = 12, color, interactive = false }: SparkleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sparkles = Array.from({ length: count }, () => {
      const el = document.createElement('div')
      el.className = 'pointer-events-none absolute'
      el.style.cssText = `
        width: ${4 + Math.random() * 4}px;
        height: ${4 + Math.random() * 4}px;
        background: ${color || 'var(--primary)'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
        filter: blur(${Math.random() > 0.6 ? 1 : 0}px);
        animation: sparkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite;
      `
      return el
    })

    sparkles.forEach(s => container.appendChild(s))
    return () => sparkles.forEach(s => s.remove())
  }, [count, color])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: interactive ? 20 : 0 }}
    />
  )
}
