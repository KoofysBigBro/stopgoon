'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function BlogImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div className={`bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-center ${className}`}>
        <div className="text-center text-xs p-4">
          <span className="text-3xl block mb-1">📷</span>
          <span className="text-muted block max-w-[150px] truncate">{alt}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {!loaded && (
        <div className="absolute inset-0 bg-surface animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(true) }}
      />
    </div>
  )
}
