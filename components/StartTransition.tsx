'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Full-screen PS2-style transition after pressing START:
 * white flash -> blue geometric field with the name -> fade out.
 * `onReveal` fires while the overlay still covers the screen, so the
 * page can jump to the portfolio invisibly before the fade reveals it.
 */
export default function StartTransition({
  onReveal,
  onDone,
}: {
  onReveal: () => void
  onDone: () => void
}) {
  const [leaving, setLeaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      onReveal()
      setLeaving(true)
    }, 2100)
    const doneTimer = setTimeout(onDone, 2700)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(doneTimer)
    }
  }, [onReveal, onDone])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    const shapes = Array.from({ length: 26 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: (20 + Math.random() * 70) * dpr,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      vx: (Math.random() - 0.5) * 1.2 * dpr,
      vy: (Math.random() - 0.5) * 0.9 * dpr,
      color: ['#1a3aff', '#4a7aff', '#8ab4ff'][Math.floor(Math.random() * 3)],
      alpha: 0.15 + Math.random() * 0.5,
    }))

    let raf = 0
    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.fillStyle = '#000008'
      ctx.fillRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5)
      glow.addColorStop(0, 'rgba(60, 100, 255, 0.25)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      for (const s of shapes) {
        s.x += s.vx
        s.y += s.vy
        s.rot += s.rotSpeed
        if (s.x < -s.size) s.x = w + s.size
        if (s.x > w + s.size) s.x = -s.size
        if (s.y < -s.size) s.y = h + s.size
        if (s.y > h + s.size) s.y = -s.size

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rot)
        ctx.globalAlpha = s.alpha
        ctx.shadowColor = s.color
        ctx.shadowBlur = 24 * dpr
        ctx.fillStyle = s.color
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size)
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`fixed inset-0 z-50 ${leaving ? 'overlay-out' : ''}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="white-flash absolute inset-0 bg-white" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="name-fade-in crt-text font-crt text-[clamp(2rem,6vw,4.5rem)]">
          Carlos Ramirez
        </h1>
      </div>
      <div className="scanlines" />
    </div>
  )
}
