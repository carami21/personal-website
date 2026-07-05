'use client'

import { useEffect, useState } from 'react'

export type DayPeriod = 'dawn' | 'day' | 'dusk' | 'night'

/** Color-grade for the hero per period. The baked image is a night scene,
 *  so grading lifts/warms it rather than pretending it's noon. */
export const PERIOD_GRADE: Record<
  DayPeriod,
  { filter: string; overlay: string; blend: string; label: string }
> = {
  dawn: {
    filter: 'brightness(1.08) saturate(1.05)',
    overlay:
      'linear-gradient(180deg, rgba(255,150,100,0.14) 0%, rgba(120,110,255,0.10) 100%)',
    blend: 'soft-light',
    label: 'DAWN',
  },
  day: {
    filter: 'brightness(1.16) contrast(0.97)',
    overlay:
      'linear-gradient(180deg, rgba(210,225,255,0.16) 0%, rgba(255,245,220,0.08) 100%)',
    blend: 'soft-light',
    label: 'DAY',
  },
  dusk: {
    filter: 'brightness(1.05) saturate(1.1)',
    overlay:
      'linear-gradient(200deg, rgba(255,120,60,0.14) 0%, rgba(90,60,180,0.14) 100%)',
    blend: 'soft-light',
    label: 'DUSK',
  },
  night: {
    filter: 'brightness(1)',
    overlay:
      'linear-gradient(180deg, rgba(20,30,90,0.12) 0%, rgba(5,8,30,0.18) 100%)',
    blend: 'multiply',
    label: 'NIGHT',
  },
}

function periodOf(hours: number): DayPeriod {
  if (hours >= 5 && hours < 8) return 'dawn'
  if (hours >= 8 && hours < 17) return 'day'
  if (hours >= 17 && hours < 20) return 'dusk'
  return 'night'
}

/** Visitor-local clock + day period, ticking every 15s. Starts as `null`
 *  so the server render and first client render match. */
export default function useTimeOfDay() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const period = periodOf(now.getHours())
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dayStr = now.toLocaleDateString([], { weekday: 'short' }).toUpperCase()
  return { period, grade: PERIOD_GRADE[period], timeStr, dayStr }
}
