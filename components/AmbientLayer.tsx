'use client'

import { useEffect, useRef } from 'react'

type Mote = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  alpha: number
  phase: number
  speed: number
}

/**
 * Ambient "living loading screen" layer over the desk scene:
 * - drifting dust motes on a canvas, denser in the TV's light cone
 * - flickering blue light spill around the CRT
 * - a breathing warm glow from the desk lamp
 * Sits inside the fixed-aspect stage, so percentages track the image.
 */
export default function AmbientLayer({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Pre-render a soft round sprite once; per-frame shadowBlur is too slow.
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 32
    const sctx = sprite.getContext('2d')!
    const grad = sctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(190,210,255,1)')
    grad.addColorStop(0.5, 'rgba(150,180,255,0.35)')
    grad.addColorStop(1, 'rgba(150,180,255,0)')
    sctx.fillStyle = grad
    sctx.fillRect(0, 0, 32, 32)

    let motes: Mote[] = []
    let w = 0
    let h = 0

    const seed = () => {
      const count = Math.round(70 * density)
      motes = Array.from({ length: count }, () => {
        // Bias spawn toward the TV light cone (center-right of the image)
        const inCone = Math.random() < 0.6
        return {
          x: inCone ? w * (0.38 + Math.random() * 0.42) : Math.random() * w,
          y: inCone ? h * (0.12 + Math.random() * 0.6) : Math.random() * h,
          r: (0.6 + Math.random() * 1.6) * dpr,
          vx: (Math.random() - 0.5) * 0.08 * dpr,
          vy: (-0.02 - Math.random() * 0.06) * dpr,
          alpha: 0.08 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
        }
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = canvas.width = Math.max(1, Math.round(rect.width * dpr))
      h = canvas.height = Math.max(1, Math.round(rect.height * dpr))
      seed()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        m.x += m.vx + Math.sin(t * m.speed + m.phase) * 0.05 * dpr
        m.y += m.vy
        if (m.y < -8) {
          m.y = h + 8
          m.x = Math.random() * w
        }
        if (m.x < -8) m.x = w + 8
        if (m.x > w + 8) m.x = -8
        // Twinkle, brighter inside the TV cone
        const cone =
          m.x > w * 0.36 && m.x < w * 0.82 && m.y > h * 0.1 && m.y < h * 0.75 ? 1.5 : 0.7
        ctx.globalAlpha = m.alpha * cone * (0.65 + 0.35 * Math.sin(t * m.speed * 2 + m.phase))
        const s = m.r * 6
        ctx.drawImage(sprite, m.x - s / 2, m.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [density])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* TV light spill — flickers slightly, like a real CRT lighting the room */}
      <div
        className="tv-spill absolute"
        style={{
          left: '22%',
          top: '2%',
          width: '72%',
          height: '92%',
          background:
            'radial-gradient(ellipse 50% 45% at 50% 42%, rgba(96,140,255,0.14) 0%, rgba(70,110,255,0.06) 45%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Desk lamp — slow warm breathing, bottom left */}
      <div
        className="lamp-breathe absolute"
        style={{
          left: '-6%',
          top: '30%',
          width: '38%',
          height: '65%',
          background:
            'radial-gradient(ellipse 50% 45% at 30% 55%, rgba(255,170,90,0.10) 0%, rgba(255,140,60,0.04) 50%, transparent 72%)',
          mixBlendMode: 'screen',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
