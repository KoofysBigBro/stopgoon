'use client'

import { useState } from 'react'

export default function BlogImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (failed) {
    return (
      <div className={`bg-gradient-to-br from-primary/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <span className="text-3xl block mb-1">📷</span>
          <span className="text-xs text-muted">{alt}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {!loaded && (
        <div className={`bg-surface animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(true) }}
        loading="lazy"
      />
    </>
  )
}
