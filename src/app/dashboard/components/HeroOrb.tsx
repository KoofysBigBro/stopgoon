'use client'

import { useEffect, useRef } from 'react'

export default function HeroOrb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animId: number
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX = (e.clientX - centerX) / window.innerWidth * 24
      mouseY = (e.clientY - centerY) / window.innerHeight * 24
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.06
      currentY += (mouseY - currentY) * 0.06
      container.style.transform = `translate(${currentX}px, ${currentY}px)`
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] mx-auto will-change-transform"
      style={{ transition: 'transform 0.1s linear' }}
    >
      {/* Outer glow */}
      <div className="absolute inset-[-40%] rounded-full bg-[radial-gradient(circle,rgba(0,212,170,0.12)_0%,transparent_70%)] animate-[orb-breathe_6s_ease-in-out_infinite]" />

      {/* Main sphere body */}
      <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_80px_rgba(0,212,170,0.2),0_0_160px_rgba(0,180,140,0.08)]">
        {/* Base gradient — 3D sphere shading */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 38% 32%,
              rgba(0,232,190,0.7) 0%,
              rgba(0,180,150,0.5) 20%,
              rgba(0,120,100,0.4) 40%,
              rgba(0,60,55,0.7) 65%,
              rgba(4,20,18,0.95) 100%
            )`,
          }}
        />

        {/* Surface texture layer — animated */}
        <div
          className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay animate-[orb-surface_20s_linear_infinite]"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(0,212,170,0.2) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 80%, rgba(0,100,80,0.3) 0%, transparent 50%)
            `,
          }}
        />

        {/* Atmospheric band */}
        <div
          className="absolute inset-0 rounded-full opacity-25 animate-[orb-bands_15s_linear_infinite]"
          style={{
            background: `
              linear-gradient(135deg,
                transparent 20%,
                rgba(0,212,170,0.15) 35%,
                transparent 40%,
                transparent 55%,
                rgba(0,180,150,0.1) 65%,
                transparent 75%
              )
            `,
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: '12%',
            left: '22%',
            width: '35%',
            height: '25%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)',
            filter: 'blur(4px)',
            transform: 'rotate(-20deg)',
          }}
        />

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 8px -8px 30px rgba(0,0,0,0.6), inset -4px 4px 20px rgba(0,212,170,0.1)',
          }}
        />
      </div>

      {/* Rim light */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: 'conic-gradient(from 200deg, transparent 0%, rgba(0,212,170,0.3) 15%, transparent 30%, transparent 100%)',
        }}
      />
    </div>
  )
}
