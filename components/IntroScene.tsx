'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CRTScreen, { type CRTPhase } from './CRTScreen'
import AmbientLayer from './AmbientLayer'
import useTimeOfDay from './useTimeOfDay'

// three.js only makes sense in the browser; skip it in SSR entirely.
const Controller3D = dynamic(() => import('./Controller3D'), { ssr: false })

function TimeHud({ className = '' }: { className?: string }) {
  const tod = useTimeOfDay()
  if (!tod) return null
  return (
    <div
      className={`pointer-events-none z-20 text-right font-mono text-ps2-light ${className}`}
      style={{ textShadow: '0 0 12px rgba(74,122,255,0.7)' }}
      aria-hidden
    >
      <p className="text-lg tracking-[0.2em] md:text-xl">{tod.timeStr}</p>
      <p className="mt-0.5 text-[10px] tracking-[0.35em] text-ps2-light/70">
        {tod.dayStr} · {tod.grade.label}
      </p>
    </div>
  )
}

export default function IntroScene({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<CRTPhase>('boot')
  const [pulsing, setPulsing] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const tod = useTimeOfDay()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (isMobile !== false || !sectionRef.current) return

    gsap.registerPlugin(ScrollTrigger)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      // No scroll choreography: land in the ready-to-start state.
      setPhase('idle')
      setPulsing(true)
      return
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current!

      // Scene zoom (0% -> 100%)
      gsap.to('.scene-container', {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      })

      // Background blur as the controller approaches (40% -> 100%)
      gsap.to('.scene-bg', {
        filter: 'blur(3px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: '40% top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // Controller rises from below the viewport (30% -> 100%)
      gsap.fromTo(
        '.controller-wrap',
        { yPercent: 130, scale: 0.6, rotation: -5 },
        {
          yPercent: 0,
          scale: 1,
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '25% top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        }
      )

      // Subtle mouse parallax on the whole scene (composes with the
      // scroll-driven scale above — different transform channels)
      const px = gsap.quickTo('.scene-container', 'x', { duration: 0.8, ease: 'power2.out' })
      const py = gsap.quickTo('.scene-container', 'y', { duration: 0.8, ease: 'power2.out' })
      const onMove = (e: MouseEvent) => {
        px(((e.clientX / window.innerWidth) * 2 - 1) * -8)
        py(((e.clientY / window.innerHeight) * 2 - 1) * -5)
      }
      window.addEventListener('mousemove', onMove)

      // Phase switches driven by overall progress
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (st) => {
          setPhase(st.progress > 0.45 ? 'idle' : 'boot')
          setPulsing(st.progress > 0.72)
        },
      })

      return () => window.removeEventListener('mousemove', onMove)
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  // Avoid a flash of the wrong layout before we know the viewport size
  if (isMobile === null) {
    return <section className="h-screen bg-ink" aria-hidden />
  }

  const grade = tod?.grade

  /* ---------- Mobile: static scene, tap START ---------- */
  if (isMobile) {
    return (
      <section className="relative flex min-h-svh flex-col bg-ink">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <Image
            src="/hero-bg.png"
            alt="A dark bedroom desk with a PlayStation 2 and a Sony CRT TV showing 'Carlos Ramirez Presents'"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            style={{ filter: grade?.filter, transition: 'filter 2s ease' }}
          />
          {grade && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: grade.overlay,
                mixBlendMode: grade.blend as React.CSSProperties['mixBlendMode'],
                transition: 'background 2s ease',
              }}
              aria-hidden
            />
          )}
          <AmbientLayer density={0.5} />
          <TimeHud className="absolute right-4 top-4" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 pb-12">
          <div className="w-72">
            <Controller3D pulsing onStart={onStart} />
          </div>
          <p className="font-mono text-sm tracking-[0.25em] text-ps2-light">
            TAP START TO ENTER
          </p>
        </div>
      </section>
    )
  }

  /* ---------- Desktop: 250vh scroll-driven intro ---------- */
  return (
    <section ref={sectionRef} className="intro-section relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="scene-container relative h-full w-full will-change-transform">
          {/* Desk scene. The stage div reproduces object-cover math with a
              fixed aspect ratio so the CRT overlay percentages always track
              the TV screen in the image, at any viewport size. */}
          <div className="scene-bg absolute inset-0 overflow-hidden">
            {/* Slow idle drift — the "camera" never fully sits still */}
            <div className="scene-drift absolute inset-0">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 'max(100vw, 177.7vh)', aspectRatio: '1672 / 941' }}
              >
                <Image
                  src="/hero-bg.png"
                  alt="A dark bedroom desk with a PlayStation 2, stacked game cases, and a Sony CRT TV"
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                  style={{ filter: grade?.filter, transition: 'filter 2s ease' }}
                />
                {/* Time-of-day grade over the room (under the CRT overlay,
                    so the self-emissive screen stays untouched) */}
                {grade && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: grade.overlay,
                      mixBlendMode: grade.blend as React.CSSProperties['mixBlendMode'],
                      transition: 'background 2s ease',
                    }}
                    aria-hidden
                  />
                )}
                <AmbientLayer />
                {/* Opaque overlay sized to the TV glass — covers the baked-in
                    screen content so the canvas fully controls what's on the TV */}
                <div
                  className="absolute"
                  style={{ left: '36.2%', top: '18%', width: '43.8%', height: '49.5%' }}
                >
                  <CRTScreen phase={phase} />
                </div>
              </div>
            </div>
          </div>

          <TimeHud className="absolute right-8 top-6" />

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500 ${
              phase === 'boot' ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-6 justify-center rounded-full border border-ps2-light/60 pt-1.5">
                <div className="mouse-wheel h-2 w-1 rounded-full bg-ps2-light" />
              </div>
              <svg width="14" height="8" viewBox="0 0 14 8" className="chevron-pulse" fill="none">
                <path d="M1 1l6 6 6-6" stroke="#8ab4ff" strokeWidth="1.5" />
              </svg>
              <svg width="14" height="8" viewBox="0 0 14 8" className="chevron-pulse [animation-delay:0.2s]" fill="none">
                <path d="M1 1l6 6 6-6" stroke="#8ab4ff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controller — rises with scroll */}
        <div className="controller-wrap absolute bottom-[-6vh] left-1/2 z-30 w-[min(44vw,540px)] -translate-x-1/2 will-change-transform">
          <Controller3D pulsing={pulsing} onStart={onStart} />
          <p
            className={`mt-2 text-center font-mono text-sm tracking-[0.3em] text-ps2-light transition-opacity duration-500 ${
              pulsing ? 'opacity-100' : 'opacity-0'
            }`}
          >
            PRESS START
          </p>
        </div>
      </div>
    </section>
  )
}
