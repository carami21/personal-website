'use client'

import { useEffect, useRef } from 'react'

export type CRTPhase = 'boot' | 'idle'

type Shape = {
  x: number
  y: number
  z: number
  size: number
  rotation: number
  rotSpeed: number
  vx: number
  vy: number
  kind: 'rect' | 'diamond'
  color: string
}

const BLUES = ['#1a3aff', '#4a7aff', '#8ab4ff', '#2a4ae0', '#6a94ff']

/**
 * Canvas recreation of the PS2 startup screen: slow-drifting blue
 * geometric shapes on black, with light streaks behind them.
 * `phase` dims the scene and swaps the title for a blinking
 * "Press START" once the scroll animation reaches the idle state.
 */
export default function CRTScreen({ phase }: { phase: CRTPhase }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef<CRTPhase>(phase)
  const dimRef = useRef(0) // 0 = full boot brightness, 1 = fully idle

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let shapes: Shape[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = w * dpr
      canvas.height = h * dpr
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const W = () => canvas.width
    const H = () => canvas.height

    const spawn = (): Shape => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      z: 0.3 + Math.random() * 0.7,
      size: (14 + Math.random() * 46) * dpr,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      vx: (Math.random() - 0.5) * 0.35 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      kind: Math.random() > 0.45 ? 'rect' : 'diamond',
      color: BLUES[Math.floor(Math.random() * BLUES.length)],
    })

    shapes = Array.from({ length: 18 }, spawn)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      const w = W()
      const h = H()

      // ease brightness toward the current phase
      const target = phaseRef.current === 'idle' ? 1 : 0
      dimRef.current += (target - dimRef.current) * 0.03
      const dim = dimRef.current
      const brightness = 1 - dim * 0.75

      ctx.fillStyle = '#000005'
      ctx.fillRect(0, 0, w, h)

      // faint light streaks behind the shapes
      ctx.save()
      ctx.globalAlpha = 0.08 * brightness
      for (let i = 0; i < 4; i++) {
        const y = h * (0.25 + i * 0.18)
        const grad = ctx.createLinearGradient(0, y, w, y)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.5, '#4a7aff')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, y, w, 2 * dpr)
      }
      ctx.restore()

      // central glow
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.45)
      glow.addColorStop(0, `rgba(70, 110, 255, ${0.22 * brightness})`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      const speed = 1 - dim * 0.85

      for (const s of shapes) {
        if (!reduced) {
          s.x += s.vx * speed
          s.y += s.vy * speed
          s.rotation += s.rotSpeed * speed
        }
        if (s.x < -s.size) s.x = w + s.size
        if (s.x > w + s.size) s.x = -s.size
        if (s.y < -s.size) s.y = h + s.size
        if (s.y > h + s.size) s.y = -s.size

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rotation)
        ctx.globalAlpha = (0.25 + s.z * 0.45) * brightness
        ctx.shadowColor = s.color
        ctx.shadowBlur = 18 * s.z * dpr

        const half = (s.size * s.z) / 2
        if (s.kind === 'rect') {
          // lit face
          ctx.fillStyle = s.color
          ctx.fillRect(-half, -half, half * 2, half * 2)
          // shadow face for a fake-3D bevel
          ctx.globalAlpha *= 0.5
          ctx.fillStyle = '#000030'
          ctx.fillRect(-half, 0, half * 2, half)
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -half)
          ctx.lineTo(half, 0)
          ctx.lineTo(0, half)
          ctx.lineTo(-half, 0)
          ctx.closePath()
          ctx.fillStyle = s.color
          ctx.fill()
          ctx.globalAlpha *= 0.5
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(half, 0)
          ctx.lineTo(0, half)
          ctx.closePath()
          ctx.fillStyle = '#000030'
          ctx.fill()
        }
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="crt-screen crt-flicker absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Boot title */}
      <div
        className={`absolute inset-0 z-[12] flex items-center justify-center transition-opacity duration-700 ${
          phase === 'boot' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="crt-text font-crt text-[clamp(0.9rem,2.4vw,2rem)]">
          Carlos Ramirez Presents
        </span>
      </div>

      {/* Idle "Press START" */}
      <div
        className={`absolute inset-0 z-[12] flex items-center justify-center transition-opacity duration-700 ${
          phase === 'idle' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="crt-text blink-start font-crt text-[clamp(0.8rem,1.8vw,1.5rem)] tracking-widest">
          Press START
        </span>
      </div>

      <div className="scanlines" />
      <div className="screen-vignette" />
    </div>
  )
}
