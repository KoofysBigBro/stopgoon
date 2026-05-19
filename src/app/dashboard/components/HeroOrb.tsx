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
      // subtle movement based on mouse
      mouseX = ((e.clientX - centerX) / window.innerWidth) * 30
      mouseY = ((e.clientY - centerY) / window.innerHeight) * 30
    }

    const animate = () => {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.05
      currentY += (mouseY - currentY) * 0.05
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
    <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] mx-auto mt-4 mb-2 flex items-center justify-center">
      
      {/* Container that moves with mouse */}
      <div 
        ref={containerRef}
        className="relative w-full h-full will-change-transform"
      >
        {/* Soft back glow */}
        <div className="absolute inset-[-30%] rounded-full bg-primary/20 blur-[40px] animate-pulse-slow" />

        {/* The 3D Sphere */}
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* Base color and core 3D shading */}
          <div 
            className="absolute inset-0 rounded-full bg-[#0a1f1c]"
            style={{
              boxShadow: `
                inset -20px -20px 50px rgba(0,0,0,0.9), 
                inset 10px 10px 30px rgba(0, 212, 170, 0.4),
                inset -5px -5px 15px rgba(0,0,0,0.8)
              `
            }}
          />

          {/* Liquid/Energy surface texture (animated) */}
          <div 
            className="absolute inset-0 rounded-full opacity-60 mix-blend-screen"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(0, 255, 200, 0.4) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(0, 150, 120, 0.3) 0%, transparent 50%)
              `,
              animation: 'spin 20s linear infinite'
            }}
          />

          {/* Swirling energy overlay */}
          <div 
            className="absolute inset-[-50%] opacity-30 mix-blend-overlay"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(0,212,170,0.8), transparent 40%, rgba(0,255,200,0.5) 60%, transparent 80%)',
              animation: 'spin 15s linear infinite reverse'
            }}
          />

          {/* Sharp Specular Highlight (The glossy reflection) */}
          <div 
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '8%',
              left: '15%',
              width: '35%',
              height: '18%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.1))',
              filter: 'blur(1.5px)',
              transform: 'rotate(-25deg)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
            }}
          />
          
          {/* Secondary softer highlight */}
          <div 
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '25%',
              left: '10%',
              width: '20%',
              height: '40%',
              background: 'radial-gradient(ellipse, rgba(0,255,200,0.3) 0%, transparent 70%)',
              transform: 'rotate(-15deg)'
            }}
          />

          {/* Inner rim light (bottom right) */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: 'inset -3px -5px 12px rgba(0, 255, 200, 0.3)'
            }}
          />

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite alternate;
        }
        @keyframes pulse-slow {
          0% { opacity: 0.4; transform: scale(0.95); }
          100% { opacity: 0.7; transform: scale(1.05); }
        }
      `}} />
    </div>
  )
}
