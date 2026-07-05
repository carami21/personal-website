'use client'

import { useState } from 'react'

/**
 * SVG DualShock 2. The START button is a real <button> wrapped in
 * <foreignObject> so it's keyboard-focusable; `pulsing` drives the
 * glow ring once the scroll animation completes.
 */
export default function Controller({
  pulsing,
  onStart,
}: {
  pulsing: boolean
  onStart: () => void
}) {
  const [pressed, setPressed] = useState(false)

  const handleStart = () => {
    setPressed(true)
    setTimeout(() => {
      setPressed(false)
      onStart()
    }, 140)
  }

  return (
    <svg
      viewBox="0 0 640 420"
      className="h-auto w-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
      role="img"
      aria-label="PlayStation 2 DualShock controller — press START to enter the site"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a32" />
          <stop offset="45%" stopColor="#1a1a20" />
          <stop offset="100%" stopColor="#0e0e12" />
        </linearGradient>
        <radialGradient id="stickGrad" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#3a3a44" />
          <stop offset="70%" stopColor="#17171c" />
          <stop offset="100%" stopColor="#0a0a0d" />
        </radialGradient>
        <linearGradient id="gripGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232329" />
          <stop offset="100%" stopColor="#0c0c10" />
        </linearGradient>
      </defs>

      {/* shoulder buttons */}
      <rect x="96" y="18" width="88" height="30" rx="14" fill="#17171c" />
      <rect x="456" y="18" width="88" height="30" rx="14" fill="#17171c" />
      <text x="140" y="39" textAnchor="middle" fill="#55555f" fontSize="15" fontFamily="var(--font-mono)">L1</text>
      <text x="500" y="39" textAnchor="middle" fill="#55555f" fontSize="15" fontFamily="var(--font-mono)">R1</text>

      {/* grips */}
      <path
        d="M120 150 C 55 165, 30 260, 42 330 C 50 380, 95 405, 130 385 C 160 368, 172 320, 185 285 L 150 160 Z"
        fill="url(#gripGrad)"
      />
      <path
        d="M520 150 C 585 165, 610 260, 598 330 C 590 380, 545 405, 510 385 C 480 368, 468 320, 455 285 L 490 160 Z"
        fill="url(#gripGrad)"
      />

      {/* main body */}
      <path
        d="M150 78 C 200 58, 440 58, 490 78 C 545 100, 560 175, 545 235 C 530 290, 480 310, 425 300 C 395 294, 380 268, 320 268 C 260 268, 245 294, 215 300 C 160 310, 110 290, 95 235 C 80 175, 95 100, 150 78 Z"
        fill="url(#bodyGrad)"
        stroke="#33333d"
        strokeWidth="2"
      />

      {/* D-pad */}
      <g fill="#101014" stroke="#2c2c34" strokeWidth="1.5">
        <rect x="152" y="118" width="34" height="96" rx="6" />
        <rect x="121" y="149" width="96" height="34" rx="6" />
      </g>

      {/* face buttons */}
      <g>
        <circle cx="470" cy="126" r="17" fill="#15151a" stroke="#2c2c34" strokeWidth="1.5" />
        <path d="M470 117 l 8 14 h -16 Z" fill="none" stroke="#3fa65c" strokeWidth="2.2" />
        <circle cx="510" cy="166" r="17" fill="#15151a" stroke="#2c2c34" strokeWidth="1.5" />
        <circle cx="510" cy="166" r="8" fill="none" stroke="#c9503f" strokeWidth="2.2" />
        <circle cx="470" cy="206" r="17" fill="#15151a" stroke="#2c2c34" strokeWidth="1.5" />
        <path d="M463 199 l 14 14 M477 199 l -14 14" stroke="#7a9ccc" strokeWidth="2.2" />
        <circle cx="430" cy="166" r="17" fill="#15151a" stroke="#2c2c34" strokeWidth="1.5" />
        <rect x="422" y="158" width="16" height="16" fill="none" stroke="#c77bA8" strokeWidth="2.2" />
      </g>

      {/* SELECT + START row */}
      <g>
        <rect x="252" y="158" width="40" height="16" rx="8" fill="#101014" stroke="#2c2c34" strokeWidth="1.5" />
        <text x="272" y="190" textAnchor="middle" fill="#55555f" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">SELECT</text>

        {/* START — the interactive one */}
        {pulsing && (
          <circle cx="368" cy="166" r="30" fill="none" stroke="#8ab4ff" strokeWidth="1.5" opacity="0.7">
            <animate attributeName="r" values="24;34;24" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.15;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
        <g
          className={`start-button ${pulsing ? 'pulsing' : ''}`}
          transform={pressed ? 'translate(368 166) scale(0.9) translate(-368 -166)' : undefined}
          onClick={handleStart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleStart()
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Press START to enter the portfolio"
        >
          {/* generous invisible hit area */}
          <circle cx="368" cy="166" r="34" fill="transparent" />
          <path d="M350 158 L 386 158 L 378 174 L 350 174 Z" fill="#101014" stroke="#4a7aff" strokeWidth="1.5" />
        </g>
        <text x="368" y="190" textAnchor="middle" fill="#8ab4ff" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">START</text>
      </g>

      {/* PS logo button */}
      <circle cx="320" cy="222" r="15" fill="#15151a" stroke="#2c2c34" strokeWidth="1.5" />
      <text x="320" y="227" textAnchor="middle" fill="#4a7aff" fontSize="11" fontWeight="bold" fontFamily="var(--font-heading)">PS</text>

      {/* analog sticks */}
      <g>
        <circle cx="245" cy="252" r="34" fill="#101014" stroke="#2c2c34" strokeWidth="2" />
        <circle cx="245" cy="252" r="24" fill="url(#stickGrad)" />
        <circle cx="395" cy="252" r="34" fill="#101014" stroke="#2c2c34" strokeWidth="2" />
        <circle cx="395" cy="252" r="24" fill="url(#stickGrad)" />
      </g>

      {/* wordmark */}
      <text x="320" y="98" textAnchor="middle" fill="#44444e" fontSize="11" fontFamily="var(--font-heading)" letterSpacing="2">
        SONY
      </text>

      {/* cable */}
      <path d="M320 62 C 320 40, 300 30, 260 24" fill="none" stroke="#141418" strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}
