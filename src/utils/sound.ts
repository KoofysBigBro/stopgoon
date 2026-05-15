let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return ctx
}

export function playPop() {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(660, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.08)
    g.gain.setValueAtTime(0.15, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
    o.start(c.currentTime)
    o.stop(c.currentTime + 0.12)
  } catch {}
}

export function playSuccess() {
  try {
    const c = getCtx()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.connect(g)
      g.connect(c.destination)
      o.type = 'sine'
      o.frequency.setValueAtTime(freq, c.currentTime + i * 0.1)
      g.gain.setValueAtTime(0.12, c.currentTime + i * 0.1)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.3)
      o.start(c.currentTime + i * 0.1)
      o.stop(c.currentTime + i * 0.1 + 0.3)
    })
  } catch {}
}

export function playError() {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(180, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.2)
    g.gain.setValueAtTime(0.1, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25)
    o.start(c.currentTime)
    o.stop(c.currentTime + 0.25)
  } catch {}
}

export function playClick() {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = 'square'
    o.frequency.setValueAtTime(1200, c.currentTime)
    g.gain.setValueAtTime(0.06, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04)
    o.start(c.currentTime)
    o.stop(c.currentTime + 0.04)
  } catch {}
}
